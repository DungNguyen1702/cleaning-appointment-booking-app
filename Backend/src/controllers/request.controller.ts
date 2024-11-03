import { Request, Response } from 'express';
import { RequestService } from '../services/request.service';
import { CreateRequestDto } from '../dtos/request.dto';

const requestService = new RequestService();

export class RequestController {
  async create(req: Request, res: Response) {
    try {
      const data: CreateRequestDto = req.body;
      const newRequest = await requestService.createRequest(data);
      res.status(201).json(newRequest);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const requests = await requestService.getRequests();
      res.status(200).json(requests);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const request = await requestService.getRequestById(id);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
      res.status(200).json(request);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const data: Partial<CreateRequestDto> = req.body;
      const updatedRequest = await requestService.updateRequest(id, data);
      if (!updatedRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }
      res.status(200).json(updatedRequest);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await requestService.deleteRequest(id);
      res.status(200).json({ message: 'Đã xóa thành công' });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  async getRequestsCompanyHistory(req: Request, res: Response) {
    let page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 100;
    let userId = parseInt(req.params.id, 10);
    const startDate = (req.query.startDate as string) || ''; // Lấy tham số startDate
    const companyName = (req.query.companyName as string) || ''; // Lấy tham số companyName

    // Kiểm tra dữ liệu đầu vào
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: 'Tham số page không hợp lệ!' });
    }

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: 'Tham số limit không hợp lệ!' });
    }

    if (isNaN(userId) || userId <= 0 || null) {
      return res.status(400).json({ message: 'Tham số userId không hợp lệ!' });
    }

    try {
      const { companies, totalCompanies, totalPages, currentPage } =
        await requestService.getPagedRequests(
          userId,
          page,
          limit,
          startDate,
          companyName
        );

      if (!companies || companies.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy yêu cầu nào.' });
      }

      return res.status(200).json({
        companies,
        totalCompanies,
        totalPages,
        currentPage,
      });
    } catch (error) {
      console.error('Lỗi trong quá trình lấy dữ liệu yêu cầu:', error);
      return res
        .status(500)
        .json({ message: 'Đã xảy ra lỗi trong quá trình truy vấn dữ liệu.' });
    }
  }

  async getCustomerRequestsForWeek(req: Request, res: Response) {
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
      const weekData = await requestService.getCustomerRequestsForWeek(
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
  }
  async getRequestDetails(req: Request, res: Response) {
    const requestId = parseInt(req.params.requestId);
    const userId = req.userId; // userId nên được lấy từ token

    if (!userId) {
      return res.status(401).json({ message: 'Người dùng không hợp lệ' });
    }

    console.log('requestId:', requestId);
    console.log('userId:', userId);

    try {
      const request = await requestService.getRequestByIdAndUserId(
        requestId,
        userId
      );

      // Kiểm tra xem request có tồn tại không
      if (!request) {
        console.log(
          `Không tìm thấy yêu cầu với requestId: ${requestId} và userId: ${userId}`
        );
        return res.status(404).json({
          message: 'Yêu cầu không tồn tại hoặc bạn không có quyền truy cập',
        });
      }

      return res.status(200).json(request);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(400).json({ message: 'Đã xảy ra lỗi' });
    }
  }
}
