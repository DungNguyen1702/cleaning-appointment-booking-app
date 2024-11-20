import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../entity/company.entity';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  statistic_id: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'decimal', precision: 15 })
  total_revenue: number;

  @Column()
  total_jobs: number;

  @Column()
  successful_jobs: number;

  @Column()
  failed_jobs: number;

  @Column({ type: 'date' })
  statistic_date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
