import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { bcryptConfig } from 'src/config/generalConfig.config';
@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) { }

    async encode(payload:any): Promise<string> {
        return this.jwtService.sign(payload);
    }
    async decode(token:any): Promise<any> {
       return await this.jwtService.decode(token)
    }

    async makeHash(password:string){
        return await bcrypt.hash(password,bcryptConfig.round)
    }

    async matchHash(password:string,hash:string){
        return await bcrypt.compare(password,hash);
    }
    async verifyToken(token: string, secret: string): Promise<any> {
        try {
            const payload = await this.jwtService.verify(token, { secret })
            return payload
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

