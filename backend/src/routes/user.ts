import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { prisma } from '../utilities/prisma';
import { AppError } from '../utilities/error';
import { upload } from '../middlewares/uploadImage';
import express, { Request, Response } from 'express';
import { asyncWrapper } from '../utilities/asyncWrapper';
import { mustLogin, mustAdmin } from '../middlewares/auth';

const router = express.Router();

type Role = 'user' | 'admin' | 'receptionist';

type User = {
  username: string
  photo?: string
  email: string
  password?: string
  role: Role
};

// get all users
router.get('/user', mustLogin, mustAdmin, asyncWrapper(async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();

  if (!user) throw new AppError(400, { message: 'An error occurred while retrieving user data.' });

  res.status(200).json({ data: user });
}));

// get user by id
router.get('/user/:id', mustLogin, mustAdmin, asyncWrapper(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id }});

  if (!user) throw new AppError(400, { message: 'An error occurred while retrieving user data.' });

  res.status(200).json({ data: user });
}));

// create user
router.post('/user', upload.single('photo'), asyncWrapper(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, { message: 'No file uploaded!' });

  const finalImageUrl = req.protocol + '://' + req.get('host') + '/' + req.file.filename;

  const { username, email, password, role } = req.body;

  {
    const user = await prisma.user.findFirst({ where: { username }});

    if (user) throw new AppError(400, { message: 'Username is already taken!' });
  }

  {
    const user = await prisma.user.findFirst({ where: { email }});

    if (user) throw new AppError(400, { message: 'Email is already taken!' });
  }

  const user = await prisma.user.create({
    data: {
      username,
      photo: finalImageUrl,
      email,
      password: bcrypt.hashSync(password, 8),
      role
    }
  });

  if (!user) throw new AppError(400, { message: 'An error occurred while creating the user.' });

  res.status(201).json({ data: user, message: 'User has been successfully created.' });
}));

// update user
router.put('/user/:id', mustLogin, mustAdmin, upload.single('photo'), asyncWrapper(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id }});

  if (!user) throw new AppError(404, { message: 'User not found!' });

  const { username, email, role } = req.body;

  let data: User = {
    username,
    email,
    role
  };

  if (req.file) {
    const oldImage = user.photo.replace(req.protocol + '://' + req.get('host') + '/', '');
    const loc = path.join(__dirname, '../../public', oldImage);

    fs.unlink(loc, error => {
      if (error) throw new AppError(400, {message: 'An error occurred while deleting the image.', context: { private: error }});
    });
    
    const finalImageUrl = req.protocol + '://' + req.get('host') + '/' + req.file.filename;
    data.photo = finalImageUrl;
  };

  if (username !== user.username) {
    const user = await prisma.user.findFirst({ where: { username }});
    
    if (user) throw new AppError(400, { message: 'Username is already taken!' });
  };

  if (email !== user.email) {
    const user = await prisma.user.findFirst({ where: { email }});

    if (user) throw new AppError(400, { message: 'Email is already taken!' });
  };

  const updateUser = await prisma.user.update({
    data,
    where: { id: req.params.id }
  });

  if (!updateUser) {
    throw new AppError(400, { message: 'An error occurred while updating user.' });
  };

  res.status(201).json({ data: updateUser, message: 'User has been successfully updated.' });
}));

// delete user
router.delete('/user/:id', mustLogin, mustAdmin, asyncWrapper(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id }});

  if (!user) throw new AppError(404, { message: 'User not found!' });

  const delImg = user.photo.replace(req.protocol + '://' + req.get('host') + '/', '');
  const loc = path.join(__dirname, '../../public', delImg);

  fs.unlink(loc, error => {
    if (error) throw new AppError(400, {message: 'An error occurred while deleting the image.', context: { private: error }});
  });

  await prisma.user.delete({ where: { id: req.params.id }});

  res.status(200).json({ message: 'User has been successfully deleted.' });
}));

export default router;
