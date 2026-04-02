import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginPasswordDto } from './dto/login-password.dto';
import { LoginSmsDto } from './dto/login-sms.dto';
import { RegisterDto } from './dto/register.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { SmsService } from './sms.service';
export declare class AuthController {
    private readonly authService;
    private readonly smsService;
    constructor(authService: AuthService, smsService: SmsService);
    sendSms(dto: SendSmsDto): Promise<{
        sent: boolean;
    }>;
    register(dto: RegisterDto): Promise<import("./auth.service").AuthTokenPayload>;
    loginPassword(dto: LoginPasswordDto): Promise<import("./auth.service").AuthTokenPayload>;
    loginSms(dto: LoginSmsDto): Promise<import("./auth.service").AuthTokenPayload>;
    me(req: Request & {
        user: {
            id: number;
            username: string;
            phone: string;
            status: number;
        };
    }): Express.User & {
        id: number;
        username: string;
        phone: string;
        status: number;
    };
}
