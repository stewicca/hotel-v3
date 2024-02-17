import { prisma } from '../utilities/prisma';
import { AppError } from '../utilities/error';
import express, { Request, Response } from 'express';
import { asyncWrapper } from '../utilities/asyncWrapper';
import { mustLogin, mustAdmin } from '../middlewares/auth';

const router = express.Router();

// get all rooms
router.get('/room', mustLogin, mustAdmin, asyncWrapper(async (req: Request, res: Response) => {
  const rooms = await prisma.room.findMany({ include: { roomType: { select: { name: true }}}});

  if (!rooms) throw new AppError(400, { message: 'An error occurred while retrieving rooms data.' });

  res.status(200).json({ data: rooms });
}));

// create room
router.post('/room', mustLogin, mustAdmin, asyncWrapper(async (req: Request, res: Response) => {
  const { number, roomTypeId } = req.body;

  const room = await prisma.room.create({ data: { number, roomTypeId }});

  if (!room) throw new AppError(400, { message: 'An error occurred while creating the room.' });

  res.status(201).json({ data: room, message: 'Room has been successfully created.' });
}));

// update room
router.put('/room/:id', mustLogin, mustAdmin, asyncWrapper(async (req: Request, res: Response) => {
  const { number, roomTypeId } = req.body;

  const room = await prisma.room.update({ where: { id: req.params.id }, data: { number, roomTypeId }});

  if (!room) throw new AppError(400, { message: 'An error occurred while updating room.' });

  res.status(201).json({ data: room, message: 'Room has been successfully updated.' });
}));

// delete room
router.delete('/room/:id', mustLogin, mustAdmin, asyncWrapper(async (req: Request, res: Response) => {
  const room = await prisma.room.findUnique({ where: { id: req.params.id }});

  if (!room) throw new AppError(400, { message: 'Room not found!' });

  await prisma.room.delete({ where: { id: req.params.id }});

  res.status(200).json({ message: 'Room has been successfully deleted.' });
}));

export default router;
