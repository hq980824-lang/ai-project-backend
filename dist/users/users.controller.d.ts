import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<import("./user.entity").UserEntity>;
    findAll(): Promise<import("./user.entity").UserEntity[]>;
    findOne(id: number): Promise<import("./user.entity").UserEntity>;
    update(id: number, dto: UpdateUserDto): Promise<import("./user.entity").UserEntity>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
