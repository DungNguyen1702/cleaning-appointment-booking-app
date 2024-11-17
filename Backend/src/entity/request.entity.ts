import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../entity/user.entity';
import { Company } from '../entity/company.entity';
import { RequestStatusEnum } from '../enums/requestStatus.enum';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  request_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ type: 'date' })
  request_date: Date;

  @Column({ type: 'enum', enum: RequestStatusEnum })
  status: RequestStatusEnum;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text' })
  request: string;

  @Column({ type: 'datetime' })
  timejob: Date;

  @Column({ type: 'decimal', nullable: true, default: 0 })
  workingHours: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
