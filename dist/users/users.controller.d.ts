import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    sendRegisterCode(email: string): Promise<void>;
    register(dto: CreateUserDto): Promise<import("./user.entity").UserEntity>;
    sendLoginCode(email: string): Promise<void>;
    login(dto: CreateUserDto): Promise<import("./user.entity").UserEntity>;
}
