/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv'
dotenv.config()
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: process.env.JWT_EXPIRATION }
        })
    ],
    exports: [JwtModule],
})
export class JwtConfigModule { }