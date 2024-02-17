import { prisma } from '../utilities/prisma';
import { AppError } from '../utilities/error';
import express, { Request, Response } from 'express';
import { asyncWrapper } from '../utilities/asyncWrapper';
import { mustLogin, mustReceptionist } from '../middlewares/auth';

const router = express.Router();

// get all bookings
router.get('/booking', mustLogin, mustReceptionist, asyncWrapper(async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({ include: { user: true, roomType: true }});

  if (!bookings) throw new AppError(400, { message: 'An error occurred while retrieving bookings data.' });

  res.status(200).json({ data: bookings });
}));

// get booking by user id
router.get('/booking/:id', mustLogin, asyncWrapper(async (req: Request, res: Response) => {
  const booking = await prisma.booking.findMany({ where: { userId: req.params.id }, include: { roomType: { select: { name: true }}}});

  if (!booking) throw new AppError(400, { message: 'An error occurred while searching booking data.' });

  res.status(200).json({ data: booking });
}));

// create booking
router.post('/booking', mustLogin, asyncWrapper(async (req: Request, res: Response) => {
  const { bookerName, bookerEmail, checkInDate, checkOutDate, guestName, totalRooms, roomTypeId, userId } = req.body;

  const roomTypeData = await prisma.roomType.findUnique({ where: { id: roomTypeId }});

  if (!roomTypeData) throw new AppError(404, { message: 'Room type not found!' });

  const roomData = await prisma.room.findMany({ where: { roomTypeId: roomTypeId }});

  const checkIn: any = new Date(checkInDate);
  const checkOut: any = new Date(checkOutDate);
  
  const bookingData = await prisma.roomType.findMany({
    where: {
      id: roomTypeId,
      rooms: {
        some: {
          bookingDetail: {
            some: {
              accessDate: {
                lte: checkIn,
                gte: checkOut
              }
            }
          }
        }
      }
    },
    select: {
      id: true,
      name: true,
      rooms: {
        select: {
          id: true,
          roomTypeId: true,
          bookingDetail: {
            select: {
              accessDate: true,
            },
            where: {
              accessDate: {
                gte: checkIn,
                lte: checkOut,
              },
            },
          },
        },
      },
    },
  });

  // get available room
  const bookedRoom = bookingData.length !== 0 ? bookingData[0].rooms.map(room => room.id) : "";
  const availableRoom = roomData.filter(room => !bookedRoom.includes(room.id));

  // proccess booking room where status is available
  const roomDataSelected = availableRoom.slice(0, totalRooms);

  // count day
  const dayTotal = Math.round((checkOut - checkIn) / (1000 * 3600 * 24));

  if ( roomData === null || availableRoom.length < totalRooms || dayTotal === 0 || roomDataSelected === null) throw new AppError(400, { message: 'Room not available' });

  const booking = await prisma.booking.create({ data: { bookerName, bookerEmail, checkInDate: checkIn, checkOutDate: checkOut, guestName, totalRooms, roomTypeId, userId }, include: { roomType: { select: { name: true }}}});

  if (!booking) throw new AppError(400, { message: 'An error occurred while creating the booking.' });

  for (let i = 0; i < dayTotal; i++) {
    for (let j = 0; j < roomDataSelected.length; j++) {
      const accessDate = new Date(checkIn);
      accessDate.setDate(accessDate.getDate() + i);

      const bookingDetail = await prisma.bookingDetail.create({
        data: {
          bookingId: booking.id,
          roomId: roomDataSelected[j].id,
          accessDate: accessDate,
          price: roomTypeData.price
        }
      });

      if (!bookingDetail) throw new AppError(400, { message: 'An error ocurred while creating booking detail.' });
    };
  };

  res.status(200).json({ data: booking, message: 'Booking created!' });
}));

// update booking status
router.put('/booking/:id', mustLogin, mustReceptionist, asyncWrapper(async (req: Request, res: Response) => {
  const { bookingStatus } = req.body;

  const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { bookingStatus }});

  if (!booking) throw new AppError(400, { message: 'An error occurred while updating booking status.' });

  res.status(200).json({ message: 'Booking status has been successfully updated.' });
}));

// delete booking
router.delete('/booking/:id', mustLogin, mustReceptionist, asyncWrapper(async (req: Request, res: Response) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id }});

  if (!booking) throw new AppError(400, { message: 'Booking not found!' });

  await prisma.booking.delete({ where: { id: req.params.id }});

  res.status(200).json({ message: 'Booking has been successfully deleted.' });
}));

export default router;
