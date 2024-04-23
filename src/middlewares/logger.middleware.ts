/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl: url, ip } = req;
        const userAgent = req.get('User-Agent') || '';

        this.logger.debug(`Request: ${method} ${url} from ${ip} User-Agent: ${userAgent}`);

        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('Content-Length') || '';

            this.logger.debug(`Response: ${method} ${url} ${statusCode} ${contentLength}`);
        });

        next();
    }
}
