import { Request, Response } from 'express';
import { getCompanyById, fetchAllCompanies } from '../services/company.service';
import { RequestService } from '../services/request.service';

const requestService = new RequestService();

export const getCompanyDetails = async (req: Request, res: Response) => {
  const companyId = parseInt(req.params.id, 10);

  try {
    const company = await getCompanyById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Công ty không tồn tại' });
    }

    return res.status(200).json(company);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: 'Đã xảy ra lỗi', error: error.message });
    }
    return res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
  }
};

export const getAllCompanies = async (req: Request, res: Response) => {
  let page = parseInt(req.query.page as string);
  let limit = parseInt(req.query.limit as string);
  const location = (req.query.location as string) || '';
  const name = (req.query.name as string) || '';

  // Kiểm tra dữ liệu đầu vào
  if (isNaN(page) || page <= 0) {
    return res.status(400).json({ message: 'Tham số page không hợp lệ!' });
  }

  if (isNaN(limit) || limit <= 0) {
    return res.status(400).json({ message: 'Tham số limit không hợp lệ!' });
  }

  try {
    const { companies, totalCompanies } = await fetchAllCompanies(
      page,
      limit,
      location,
      name
    );

    if (!companies) {
      return res.status(404).json({ message: 'Không tìm thấy công ty nào.' });
    }

    const totalPages = Math.ceil(totalCompanies / limit);

    return res.status(200).json({
      companies,
      totalCompanies,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Lỗi trong quá trình lấy dữ liệu công ty:', error);
    return res
      .status(500)
      .json({ message: 'Đã xảy ra lỗi trong quá trình truy vấn dữ liệu.' });
  }
};

export const getRequestsByCompanyId = async (req: Request, res: Response) => {
  const companyId = parseInt(req.params.companyId);
  const page = parseInt(req.query.page as string) || 1; // Mặc định là trang 1
  const limit = parseInt(req.query.limit as string) || 10; // Mặc định là 10 yêu cầu trên mỗi trang
  const name = req.query.name as string | undefined;

  try {
    const { requests, totalRequests, totalPages } =
      await requestService.getRequestsByCompanyId(companyId, page, limit, name);

    return res.status(200).json({
      totalRequests,
      totalPages,
      currentPage: page,
      requests,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Đã xảy ra lỗi', error });
  }
};

export const editRequestByCompany = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { workingHours, status } = req.body;

  try {
    const updatedRequest = await requestService.updateRequest(
      parseInt(requestId),
      { workingHours, status }
    );

    return res.status(200).json({
      message: 'Chỉnh sửa yêu cầu thành công',
      updatedRequest,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: 'Đã xảy ra lỗi' });
  }
};


export const getRequestIdDetails = async (req: Request, res: Response) => {
  const requestId = parseInt(req.params.requestId);

  try {
    const request = await requestService.getRequestDetailsById(
      requestId,
    );

    return res.status(200).json(request);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
  }
}

export const getCustomerRequestsForWeek = async (req: Request, res: Response) => {
  const companyId = parseInt(req.params.companyId, 10);
  const companyIdFromToken = req.userId;
  const startDate = new Date(req.query.startDate as string);
  const endDate = new Date(req.query.endDate as string);

  // Kiểm tra dữ liệu đầu vào
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: 'Tham số startDate và endDate là bắt buộc!' });
  }

  if (companyId !== companyIdFromToken) {
    console.log(companyId, companyIdFromToken)
    return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này!' });
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


