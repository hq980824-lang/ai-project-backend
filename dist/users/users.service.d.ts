import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { UserStatus } from './user-status.enum';
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: Repository<UserEntity>);
    create(dto: CreateUserDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: number): Promise<UserEntity>;
    findOnePublic(id: number): Promise<UserEntity>;
    findByPhone(phone: string): Promise<UserEntity | null>;
    findByPhoneWithSecret(phone: string): Promise<UserEntity | null>;
    createWithPasswordHash(input: {
        username: string;
        phone: string;
        passwordHash: string;
        status?: UserStatus;
    }): Promise<UserEntity>;
    update(id: number, dto: UpdateUserDto): Promise<UserEntity>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
