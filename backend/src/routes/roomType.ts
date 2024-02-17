import fs from 'fs';
import path from 'path';
import { prisma } from '../utilities/prisma';
import { AppError } from '../utilities/error';
import { upload } from '../middlewares/uploadImage';
import express, { Request, Response } from 'express';
import { asyncWrapper } from '../utilities/asyncWrapper';
import { mustLogin, mustAdmin } from '../middlewares/auth';

const router = express.Router();

type RoomType = {
  name: string
  price: string
  desc: string
  image?: string
};

// get all room types
router.get('/roomtype', asyncWrapper(async (req: Request, res: Response) => {
  const roomType = await prisma.roomType.findMany();

  if (!roomType) throw new AppError(400, { message: 'An error occurred while retrieving room types data.' });

  res.status(200).json({ data: roomType });
}));

// get room type by id
router.get('/roomtype/:id', asyncWrapper(async (req: Request, res: Response) => {
  const roomType = await prisma.roomType.findUnique({ where: { id: req.params.id }});

  if (!roomType) throw new AppError(400, { message: 'An error occurred while retrieving room type data.' });

  res.status(200).json({ data: roomType });
}));

// create room type
router.post('/roomtype', mustLogin, mustAdmin, upload.single('image'), asyncWrapper(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, { message: 'No file uploaded!' });

  const finalImageUrl = req.protocol + '://' + req.get('host') + '/' + req.file.filename;

  const { name, price, desc } = req.body;

  const roomType = await prisma.roomType.create({
    data: {
      name,
      price,
      desc,
      image: finalImageUrl
    }
  });

  if (!roomType) throw new AppError(400, { message: 'An error occurred while creating the room type.' });

  res.status(201).json({ data: roomType, message: 'Room type has been successfully created.' });
}));

// update room type
router.put('/roomtype/:id', mustLogin, mustAdmin, upload.single('image'), asyncWrapper(async (req: Request, res: Response) => {
  const roomtype = await prisma.roomType.findUnique({ where: { id: req.params.id }});

  if (!roomtype) throw new AppError(404, { message: 'Room type not found!' })

  const { name, price, desc } = req.body;

  let data: RoomType = {
    name,
    price,
    desc
  };

  if (req.file) {
    const oldImage = roomtype.image.replace(req.protocol + '://' + req.get('host') + '/', '');
    const loc = path.join(__dirname, '../../public', oldImage);

    fs.unlink(loc, error => {
      if (error) throw new AppError(400, {message: 'An error occurred while deleting the image.', context: { private: error }});
    });
    
    const finalImageUrl = req.protocol + '://' + req.get('host') + '/' + req.file.filename;
    data.image = finalImageUrl;
  };

  const updateRoomType = await prisma.roomType.update({
    data,
    where: { id: req.params.id }
  });

  if (!updateRoomType) {
    throw new AppError(400, { message: 'An error occurred while updating room type.' });
  };

  res.status(201).json({ data: updateRoomType, message: 'Room type has been successfully updated.'});
}));

// delete room type
router.delete('/roomtype/:id', mustLogin, mustAdmin, asyncWrapper(async (req: Request, res: Response) => {
  const roomType = await prisma.roomType.findUnique({ where: { id: req.params.id }});

  if (!roomType) throw new AppError(404, { message: 'Room type not found!' });

  const delImg = roomType.image.replace(req.protocol + '://' + req.get('host') + '', '');
  const loc = path.join(__dirname, '../../public', delImg);

  fs.unlink(loc, error => {
    if (error) throw new AppError(400, {message: 'An error occurred while deleting the image.', context: { private: error }});
  });

  await prisma.roomType.delete({ where: { id: req.params.id }});

  res.status(200).json({ message: 'Room type has been successfully deleted.' });
}));

export default router;
