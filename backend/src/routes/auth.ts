import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { prisma } from '../utilities/prisma';
import { AppError } from '../utilities/error';
import express, { Request, Response } from 'express';
import { asyncWrapper } from '../utilities/asyncWrapper';

const router = express.Router();

router.post('/auth', asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email }});
  
  if (!user) throw new AppError(404, { message: 'User not found!' });

  if (!bcrypt.compareSync(password, user.password)) throw new AppError(400, { message: 'Wrong password!' });

  const payload = user;

  const token = jwt.sign(payload, process.env.SECRET as Secret);

  if (!token) throw new AppError(400, { message: 'An error occurred while logging in.' });

  res.status(200).json({ token: token, message: 'Login successful.' });
}));

export default router;
