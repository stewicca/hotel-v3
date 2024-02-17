import { ZodError } from 'zod';
import { AppError } from '../utilities/error';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    console.error(`${error.name}: ${error.message}`);
      if (error.context) {
        console.error('Context: ', JSON.stringify(error.context));
      }
      res.status(error.statusCode).json({
        name: error.name,
        message: error.message,
        context: error.context?.public
      });
  } else if (error instanceof ZodError) {
    res.status(400).json(error.message);
  } else {
    console.error('UnhandledError!: ', error);
    res.status(500).json({ message: 'An error occured.'});
  };
};
