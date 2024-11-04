import { Request, Response } from 'express';
import { getCustomerRequestsForWeek } from '../services/todo.service';

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
