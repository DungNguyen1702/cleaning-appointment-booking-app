import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../entity/user.entity';
import { RequestStatusEnum } from '../enums/requestStatus.enum';
import { TodoRepeat } from '../entity/todoRepeat.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  todo_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  description: string;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ type: 'text' })
  task_content: string;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: RequestStatusEnum })
  status: RequestStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => TodoRepeat)
  @JoinColumn({ name: 'repeat_id' })
  todo_repeat: TodoRepeat;
}
