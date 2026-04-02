import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from './user-status.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  username: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  /** bcrypt，仅密码登录需要；短信注册/登录会写入 */
  @Column({ name: 'password_hash', type: 'varchar', length: 128, nullable: true })
  passwordHash: string | null;

  @Column({ type: 'tinyint', unsigned: true, default: UserStatus.Normal })
  status: UserStatus;
}

