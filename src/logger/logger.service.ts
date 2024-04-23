/* eslint-disable prettier/prettier */
import { Injectable, Logger, Scope } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as dotenv from "dotenv"
dotenv.config()
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
    private logger: winston.Logger;

    constructor() {
        super();
        this.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.simple(),
            transports: [
                new winston.transports.Console(),
                new DailyRotateFile({
                    filename: 'logs/%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
            ],
        });
    }

    log(message: string) {
        super.log(message);
        this.logger.info(message);
    }

    error(message: string, trace: string) {
        super.error(message, trace);
        this.logger.error(message, trace);
    }

    warn(message: string) {
        super.warn(message);
        this.logger.warn(message);
    }

    debug(message: string) {
        super.debug(message);
        this.logger.debug(message);
    }

    verbose(message: string) {
        super.verbose(message);
        this.logger.verbose(message);
    }
}
