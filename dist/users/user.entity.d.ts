import { UserStatus } from './user-status.enum';
export declare class UserEntity {
    id: number;
    email: string;
    lastLoginAt: Date;
    status: UserStatus;
}
