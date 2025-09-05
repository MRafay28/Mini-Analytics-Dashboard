import { NextFunction, Request, Response } from 'express';

export function asyncHandler<T extends (req: Request, res: Response) => Promise<unknown>>(fn: T) {
    return function handler(req: Request, res: Response, next: NextFunction) {
        fn(req, res).catch(next);
    };
}


