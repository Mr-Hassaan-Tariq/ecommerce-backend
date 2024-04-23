/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Catch and handle errors here
        try {
            // Continue with the request processing
            next();
        } catch (error) {
            // Handle the error here
            console.error(error);

            // You can customize the error response based on your needs
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    }
}
