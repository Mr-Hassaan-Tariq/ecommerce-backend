/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';

@Injectable()
export class EncryptionDecryptionService {
    private cryptr: Cryptr;
    constructor() {
        const secretKey = process.env.MY_SECRET_KEY;
        if (!secretKey) {
            throw new Error('Encryption secret key not found in environment variables.');
        }
        this.cryptr = new Cryptr(secretKey);
    }

    encrypt(text: string): string {
        return this.cryptr.encrypt(text);
    }

    decrypt(encryptedText: string): string {
        return this.cryptr.decrypt(encryptedText);
    }
}


