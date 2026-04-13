import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private readonly usersRepo;
    private readonly redis;
    private readonly emailService;
    private readonly jwtService;
    constructor(usersRepo: Repository<UserEntity>, redis: Redis, emailService: EmailService, jwtService: JwtService);
    private generateCode;
    private createToken;
    private registerOtpKey;
    private loginOtpKey;
    sendRegisterCode(email: string): Promise<void>;
    sendLoginCode(email: string): Promise<void>;
    register(email: string, code: string): Promise<{
        user: UserEntity;
        token: string;
    }>;
    login(email: string, code: string): Promise<{
        user: UserEntity;
        token: string;
    }>;
}
