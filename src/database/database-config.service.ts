/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv'
dotenv.config()
import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EncryptionDecryptionService } from './encryptions.service';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly encryptionDecryptionService: EncryptionDecryptionService) { }
    createTypeOrmOptions(): TypeOrmModuleOptions {
        const decryptedUsername = this.encryptionDecryptionService.decrypt(process.env.DATABASE_USER);
        const decryptedPassword = this.encryptionDecryptionService.decrypt(
            process.env.DATABASE_PASSWORD
        );
        
        return {
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            username: decryptedUsername,
            password: decryptedPassword,
            database: process.env.DATABASE_NAME,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: process.env.SYNCHRONIZE_DATABASE === "true" ? true : false,
        };

    }
}