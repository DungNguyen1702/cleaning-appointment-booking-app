import { Request, Response } from 'express';
import {
  getCustomerRequestsForWeek,
  createTodo,
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
      title,
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
    const todo = await createTodo({
      userId,
      title,
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

    return res.status(201).json(todo); // Trả về Todo vừa tạo
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || 'Internal Server Error' }); // Xử lý lỗi
  }
};
