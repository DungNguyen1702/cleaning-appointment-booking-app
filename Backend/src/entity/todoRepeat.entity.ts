import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Todo } from '../entity/todo.entity';
import { RepeatOptionEnum } from '../enums/repeatOption.enum';
import { DayOfWeekEnum } from '../enums/dayOfWeek.enum';
import { tuanThang } from '../enums/tuanThang.enum';

@Entity()
export class TodoRepeat {
  @PrimaryGeneratedColumn()
  repeat_id: number;

  @ManyToOne(() => Todo)
  @JoinColumn({ name: 'todo_id' })
  todo: Todo;

  @Column({ type: 'enum', enum: RepeatOptionEnum })
  repeat_option: RepeatOptionEnum;


  @Column({ type: 'enum', enum: DayOfWeekEnum })
  repeat_days: DayOfWeekEnum;

  @Column({ type: 'enum', enum: tuanThang })
  repeat_weekMonth: tuanThang;

  @Column()
  repeat_interval: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
