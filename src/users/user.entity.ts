import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from './user-status.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'datetime', nullable: true})
  lastLoginAt: Date;

  @Column({ type: 'tinyint', unsigned: true, default: UserStatus.Normal })
  status: UserStatus;
}

