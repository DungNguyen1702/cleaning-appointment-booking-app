import { Request, Response } from 'express';
import {
  getCustomerRequestsForWeek,
  createTodo,
  updateTodo,
  getUserTodosForWeekService,
} from '../services/todo.service';
import { CreateTodoOptions } from '../dtos/todo.dto';

export const getCustomerRequestsForWeekController = async (
  req: Request,
  res: Response
) => {
  const companyId = parseInt(req.params.id, 10);
  const startDate = new Date(req.query.startDate as string);
  const endDate = new Date(req.query.endDate as string);

  // Kiểm tra dữ liệu đầu vào
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: 'Tham số startDate và endDate là bắt buộc!' });
  }

  try {
    const weekData = await getCustomerRequestsForWeek(
      companyId,
      startDate,
      endDate
    );

    if (!weekData || Object.keys(weekData).length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu nào.' });
    }

    return res.status(200).json(weekData);
  } catch (error) {
    console.error('Lỗi trong quá trình lấy dữ liệu yêu cầu:', error);
    return res
      .status(500)
      .json({ message: 'Đã xảy ra lỗi trong quá trình truy vấn dữ liệu.' });
  }
};

export const createTodoController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      description,
      due_date,
      start_time,
      end_time,
      task_content,
      location,
      status,
      repeatOption,
      repeatDays,
      repeatWeekMonth,
      repeatInterval,
    }: CreateTodoOptions = req.body;

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Người dùng không hợp lệ' });
    }

    // Gọi service để tạo Todo
    // Gọi service để tạo Todo
    const { todo, repeat } = await createTodo({
      userId,
      description,
      due_date,
      start_time,
      end_time,
      task_content,
      location,
      status,
      repeatOption,
      repeatDays,
      repeatWeekMonth,
      repeatInterval,
    });

    const response = {
      todo: {
        todo_id: todo.todo_id,
        description: todo.description,
        due_date: todo.due_date,
        start_time: todo.start_time,
        end_time: todo.end_time,
        task_content: todo.task_content,
        location: todo.location,
        status: todo.status,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      },
      repeat: repeat
        ? {
          repeat_id: repeat.repeat_id,
          repeat_option: repeat.repeat_option,
          repeat_days: repeat.repeat_days,
          repeat_weekMonth: repeat.repeat_weekMonth,
          repeat_interval: repeat.repeat_interval,
          createdAt: repeat.createdAt,
          updatedAt: repeat.updatedAt,
        }
        : null,
    };

    return res.status(201).json(response);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || 'Internal Server Error' }); // Xử lý lỗi
  }
};

export const updateTodoController = async (req: Request, res: Response) => {
  const todoId = parseInt(req.params.id, 10);
  const updatedTodo = req.body.todo;
  const updatedTodoRepeat = req.body.todoRepeat;

  if (!updatedTodo) {
    return res.status(400).json({ message: 'Thông tin công việc không hợp lệ.' });
  }

  try {
    const result = await updateTodo(todoId, updatedTodo, updatedTodoRepeat);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi trong quá trình cập nhật công việc:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình cập nhật công việc.' });
  }
};

export const getUserTodosForWeek = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const userIdFromToken = req.userId;
  const startDateStr = req.query.startDate as string;
  const endDateStr = req.query.endDate as string;

  // Kiểm tra dữ liệu đầu vào
  if (!startDateStr || !endDateStr) {
    return res
      .status(400)
      .json({ message: 'Tham số startDate và endDate là bắt buộc!' });
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res
      .status(400)
      .json({ message: 'Tham số startDate và endDate không hợp lệ!' });
  }

  if (userId !== userIdFromToken) {
    console.log(userId, userIdFromToken);
    return res
      .status(403)
      .json({ message: 'Bạn không có quyền truy cập tài nguyên này!' });
  }

  try {
    const weekData = await getUserTodosForWeekService(
      userId,
      startDate,
      endDate
    );

    if (!weekData || Object.keys(weekData).length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy công việc nào.' });
    }

    return res.status(200).json(weekData);
  } catch (error) {
    console.error('Lỗi trong quá trình lấy dữ liệu công việc:', error);
    return res.status(500).json({
      message:
        'Đã xảy ra lỗi trong quá trình truy vấn dữ liệu. Hoặc bạn đã thiếu trường startDate và endDate',
    });
  }
};