import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
interface JwtPayload {
    sub: string;
    email: string;
    roles: string[];
}
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor(config: ConfigService);
    validate(req: Request, payload: JwtPayload): {
        id: string;
        email: string;
        roles: string[];
        refreshToken: string;
    };
}
export {};
