import { Request, Response } from 'express';
import { RequestService } from '../services/request.service';

const requestService = new RequestService();

export const getUserRequestsForWeek = async (req: Request, res: Response) => {
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
    const weekData = await requestService.getUserRequestsForWeekService(
      userId,
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
      .json({
        message:
          'Đã xảy ra lỗi trong quá trình truy vấn dữ liệu. Hoặc bạn đã thiếu trường startDate và endDate',
      });
  }
};
