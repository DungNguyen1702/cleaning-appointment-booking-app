import { RepeatOptionEnum } from '../enums/repeatOption.enum';
import { DayOfWeekEnum } from '../enums/dayOfWeek.enum';
import { tuanThang } from '../enums/tuanThang.enum';
import { RequestStatusEnum } from '../enums/requestStatus.enum';

export interface CreateTodoOptions {
  userId: number;
  description: string;
  due_date: Date;
  start_time: string;
  end_time: string;
  task_content: string;
  location: string;
  status: RequestStatusEnum;
  repeatOption?: RepeatOptionEnum;
  repeatDays: DayOfWeekEnum[] | null;
  repeatWeekMonth?: tuanThang;
  repeatInterval?: number;
}
