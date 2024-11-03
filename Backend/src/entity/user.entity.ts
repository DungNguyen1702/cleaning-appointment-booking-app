import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { Account } from '../entity/account.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @OneToOne(() => Account, { eager: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  full_name: string;

  @Column()
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
