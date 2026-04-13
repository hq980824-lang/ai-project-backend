import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    sendRegisterCode(email: string): Promise<void>;
    register(dto: CreateUserDto): Promise<{
        user: import("./user.entity").UserEntity;
        token: string;
    }>;
    sendLoginCode(email: string): Promise<void>;
    login(dto: CreateUserDto): Promise<{
        user: import("./user.entity").UserEntity;
        token: string;
    }>;
    getProfile(req: Request & {
        user: {
            id: number;
            email: string;
        };
    }): {
        id: number;
        email: string;
    };
}
