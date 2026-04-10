import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/** 日出日落（/v7/astronomy/sun） */
@Entity({ name: 'hefeng_astronomy_sun' })
@Index(['location', 'calendarDate'], { unique: true })
export class HefengAstronomySunEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  location: string;

  /** 查询日 YYYY-MM-DD */
  @Column({ name: 'calendar_date', type: 'varchar', length: 16 })
  calendarDate: string;

  /** 北京时间 YYYY-MM-DD HH:mm:ss，高纬度可能为空 */
  @Column({ type: 'varchar', length: 32, nullable: true })
  sunrise: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  sunset: string | null;

  @Column({ name: 'update_time', type: 'varchar', length: 32, nullable: true })
  updateTime: string | null;

  @Column({ name: 'fx_link', type: 'varchar', length: 512, nullable: true })
  fxLink: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
