import { SmsPurpose } from '../sms-purpose.enum';
export declare class SmsVerificationEntity {
    id: number;
    phone: string;
    purpose: SmsPurpose;
    codeHash: string;
    expiresAt: Date;
    createdAt: Date;
}
