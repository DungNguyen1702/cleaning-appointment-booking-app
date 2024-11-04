import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Account } from '../entity/account.entity';
import { RatingStatistic } from '../entity/ratingStatistic.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  company_id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  company_name: string;

  @Column()
  address: string;

  @Column({ type: 'text'})
  address_tinh: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  service: string;

  @Column({ type: 'decimal' })
  service_cost: number;

  @Column({ type: 'text', nullable: true })
  worktime: string;

  @Column({ nullable: true })
  main_image: string;

  @Column({ nullable: true })
  image2: string;

  @Column({ nullable: true })
  image3: string;

  @Column({ nullable: true })
  image4: string;

  @Column({ nullable: true })
  image5: string;

  @OneToMany(() => RatingStatistic, ratingStatistic => ratingStatistic.company)
  ratingStatistics: RatingStatistic[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
