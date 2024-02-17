import { prisma } from '../utilities/prisma';
import { AppError } from '../utilities/error';
import express, { Request, Response } from 'express';
import { asyncWrapper } from '../utilities/asyncWrapper';

const router = express.Router();

router.post("/filtering", asyncWrapper(async (req: Request, res: Response) => {
  const { checkInDate, checkOutDate } = req.body;

  const checkIn: any = new Date(checkInDate);
  const checkOut: any = new Date(checkOutDate);

  const availableRooms = await prisma.roomType.findMany({
    where: {
      rooms: {
        some: {
          NOT: {
            bookingDetail: {
              some: {
                accessDate: {
                  gte: checkIn,
                  lte: checkOut
                }
              }
            }
          }
        }
      }
    },
    include: {
      rooms: {
        where: {
          NOT: {
            bookingDetail: {
              some: {
                accessDate: {
                  gte: checkIn,
                  lte: checkOut
                },  
              }
            }
          }
        }
      }
    }
  });

  if (!availableRooms) throw new AppError(400, { message: 'There are no rooms available.' });

  return res.json({ room: availableRooms });
}));

export default router;
