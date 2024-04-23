/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EncryptionDecryptionService } from './encryptions.service';
import { DatabaseConfigService } from './database-config.service';

@Module({
    providers: [EncryptionDecryptionService, DatabaseConfigService],
    exports: [EncryptionDecryptionService, DatabaseConfigService], 
})
export class DatabaseModule { }

