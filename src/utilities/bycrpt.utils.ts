/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bycrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BycryptServices {
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashPassword = await bycrypt.hash(password, saltRounds)
        return hashPassword
    }
    async checkPassword(password: string, hashedPassword: string) {
        const isMatched = await bycrypt.compare(password, hashedPassword)
        return isMatched
    }
}
