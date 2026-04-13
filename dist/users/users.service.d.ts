import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { EmailService } from 'src/email/email.service';
export declare class UsersService {
    private readonly usersRepo;
    private readonly redis;
    private readonly emailService;
    constructor(usersRepo: Repository<UserEntity>, redis: Redis, emailService: EmailService);
    private generateCode;
    private registerOtpKey;
    private loginOtpKey;
    sendRegisterCode(email: string): Promise<void>;
    sendLoginCode(email: string): Promise<void>;
    register(email: string, code: string): Promise<UserEntity>;
    login(email: string, code: string): Promise<UserEntity>;
}
