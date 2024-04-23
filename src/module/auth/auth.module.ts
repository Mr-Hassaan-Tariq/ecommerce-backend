/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtConfigModule } from '../../config/jwt.config';

@Module({
    imports: [JwtConfigModule],
})
export class AuthModule {
}
