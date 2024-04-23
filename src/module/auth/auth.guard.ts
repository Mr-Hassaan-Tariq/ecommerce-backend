/* eslint-disable prettier/prettier */
import { AuthService } from './auth.service';
import { Request } from 'express'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtAuthService: AuthService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('no credentials send')
        }
        try {
            const payload = await this.jwtAuthService.verifyToken(token, process.env.JWT_SECRET_KEY)
            request['user'] = payload
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials')
        }
        return true
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}