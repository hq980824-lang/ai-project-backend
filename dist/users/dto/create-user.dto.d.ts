import { UserStatus } from '../user-status.enum';
export declare class CreateUserDto {
    username: string;
    phone: string;
    status?: UserStatus;
}
