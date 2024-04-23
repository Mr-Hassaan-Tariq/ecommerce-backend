/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class DateHelper {
    formatDate(date: Date = new Date(), timeZone: string = 'UTC'): string {
        const options: Intl.DateTimeFormatOptions = {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
}
