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
import { Todo } from '../entity/todo.entity';
import { RepeatOptionEnum } from '../enums/repeatOption.enum';
import { DayOfWeekEnum } from '../enums/dayOfWeek.enum';
import { tuanThang } from '../enums/tuanThang.enum';

@Entity()
export class TodoRepeat {
  @PrimaryGeneratedColumn()
  repeat_id: number;

  @Column({ type: 'enum', enum: RepeatOptionEnum })
  repeat_option: RepeatOptionEnum;

  @Column({ type: 'simple-array', nullable: true })
  repeat_days: DayOfWeekEnum[] | null;

  @Column({ type: 'enum', enum: tuanThang, nullable: true })
  repeat_weekMonth: tuanThang | null;

  @Column({ type: 'int', nullable: true })
  repeat_interval: number | null;

  @OneToOne(() => Todo, todo => todo.todo_repeat)
  todo: Todo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
