import { UserStatus } from './user-status.enum';
export declare class UserEntity {
    id: number;
    username: string;
    phone: string;
    passwordHash: string | null;
    status: UserStatus;
}
