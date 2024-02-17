import { Request, Response, NextFunction } from 'express';

export const asyncWrapper = (routeHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await routeHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
