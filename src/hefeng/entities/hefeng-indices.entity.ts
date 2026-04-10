import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'hefeng_indices' })
@Index(['location', 'forecastDate', 'type'], { unique: true })
export class HefengIndicesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  location: string;

  /** API 字段 date */
  @Column({ name: 'forecast_date', type: 'varchar', length: 16 })
  forecastDate: string;

  @Column({ type: 'varchar', length: 8 })
  type: string;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 16 })
  level: string;

  @Column({ type: 'varchar', length: 64 })
  category: string;

  @Column({ type: 'text', nullable: true })
  text: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
