import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('upload')
export class Upload {
  /** 主键 */
  @PrimaryGeneratedColumn()
  id: number;

  /** 原始文件名 */
  @Column()
  originalName: string;

  /** OSS文件名 */
  @Column()
  filename: string;

  /** 文件路径 */
  @Column()
  url: string;

  /** 文件大小 */
  @Column()
  size: number;

  /** 文件类型 */
  @Column()
  mimetype: string;

  /** 创建时间 */
  @CreateDateColumn()
  createdAt: Date;
}
