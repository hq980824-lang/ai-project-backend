import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { SmsVerificationEntity } from './entities/sms-verification.entity';
import { SmsPurpose } from './sms-purpose.enum';
export declare class SmsService {
    private readonly config;
    private readonly usersService;
    private readonly smsRepo;
    private readonly logger;
    private readonly lastSent;
    constructor(config: ConfigService, usersService: UsersService, smsRepo: Repository<SmsVerificationEntity>);
    requestCode(phone: string, purpose: SmsPurpose): Promise<void>;
    verifyAndConsumeCode(phone: string, purpose: SmsPurpose, code: string): Promise<void>;
    private dispatchAliyun;
}
