import jwt, { Secret } from 'jsonwebtoken';
import { AppError } from '../utilities/error';
import { Request, Response, NextFunction } from 'express';

export const mustLogin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get('Authorization')?.split(' ')[1];

  if(!token) throw new AppError(401, { message: 'Unauthorized' });

  jwt.verify(token, process.env.SECRET as Secret, (error, decoded) => {
    if (error) throw new AppError(401, { message: `${error.message}` });

    req.user = decoded;

    next();
  });
};

export const mustAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user.role;

  if (!role || role !== 'admin') throw new AppError(403, { message: 'Forbidden' });

  next();
};

export const mustReceptionist = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user.role;

  if (!role || role !== 'receptionist') throw new AppError(403, { message: 'Forbidden' });

  next();
};
