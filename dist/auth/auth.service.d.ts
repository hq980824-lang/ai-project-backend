import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/user-status.enum';
import { RegisterDto } from './dto/register.dto';
import { SmsService } from './sms.service';
export interface AuthTokenPayload {
    accessToken: string;
    user: {
        id: number;
        username: string;
        phone: string;
        status: UserStatus;
    };
}
export declare class AuthService {
    private readonly usersService;
    private readonly smsService;
    private readonly jwtService;
    private readonly passwordRounds;
    constructor(usersService: UsersService, smsService: SmsService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<AuthTokenPayload>;
    loginWithPassword(phone: string, password: string): Promise<AuthTokenPayload>;
    loginWithSms(phone: string, code: string): Promise<AuthTokenPayload>;
    private buildTokenResponse;
}
