import { Repository, SelectQueryBuilder } from 'typeorm';
import { Todo } from '../entity/todo.entity';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user.entity';
import { Company } from '../entity/company.entity';
import { RequestStatusEnum } from '../enums/requestStatus.enum';
import { DayOfWeekEnum } from '../enums/dayOfWeek.enum';

const todoRepo: Repository<Todo> = AppDataSource.getRepository(Todo);
const userRepo: Repository<User> = AppDataSource.getRepository(User);
const companyRepo: Repository<Company> = AppDataSource.getRepository(Company);

export const getCustomerRequestsForWeek = async (companyId: number, startDate: Date, endDate: Date) => {
    const query: SelectQueryBuilder<Todo> = todoRepo
        .createQueryBuilder('todo')
        .leftJoinAndSelect('todo.user', 'user')
        .leftJoinAndSelect('todo.company', 'company')
        .where('todo.due_date BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('todo.company_id = :companyId', { companyId })
        .select([
            'todo.todo_id',
            'todo.title',
            'todo.description',
            'todo.due_date',
            'todo.start_time',
            'todo.end_time',
            'todo.task_content',
            'todo.location',
            'todo.status',
            'user.user_id',
            'user.full_name',
            'user.phone_number',
        ]);

    const todos = await query.getMany();

    // Tổ chức dữ liệu theo ngày trong tuần
    const weekData: { [key in DayOfWeekEnum]?: Todo[] } = {};

    Object.values(DayOfWeekEnum).forEach(day => {
        weekData[day] = [];
    });

    todos.forEach(todo => {
        const dayOfWeek = new Date(todo.due_date).toLocaleDateString('vi-VN', { weekday: 'long' }).toUpperCase();
        const dayKey = Object.keys(DayOfWeekEnum).find(key => DayOfWeekEnum[key as keyof typeof DayOfWeekEnum] === dayOfWeek);
        if (dayKey && weekData[DayOfWeekEnum[dayKey as keyof typeof DayOfWeekEnum]]) {
            weekData[DayOfWeekEnum[dayKey as keyof typeof DayOfWeekEnum]]?.push(todo);
        }
    });

    // Sắp xếp các công việc theo thời gian bắt đầu và todo_id
    Object.keys(weekData).forEach(day => {
        weekData[day as DayOfWeekEnum]?.sort((a, b) => {
            if (a.start_time === b.start_time) {
                return a.todo_id - b.todo_id;
            }
            return a.start_time.localeCompare(b.start_time);
        });
    });

    return weekData;
};