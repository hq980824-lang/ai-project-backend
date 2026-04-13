import { UserStatus } from '../user-status.enum';
export declare class CreateUserDto {
    email: string;
    code: string;
    status?: UserStatus;
}
