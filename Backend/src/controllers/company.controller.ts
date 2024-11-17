import { Request, Response } from 'express';
import {
  getCompanyById,
  fetchAllCompanies,
  getCompanyProfileById,
  getCompanyThongKeService,
  updateCompanyProfile,
} from '../services/company.service';
import { RequestService } from '../services/request.service';
import { RequestStatusEnum } from '../enums/requestStatus.enum';
import uploadImageToCloudinary from '../utils/cloudinaryUpload';

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
export const editRequestStatusByCompany = async (
  req: Request,
  res: Response
) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    // Kiểm tra xem status có phải là một giá trị hợp lệ trong RequestStatusEnum không
    if (!Object.values(RequestStatusEnum).includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const updatedRequest = await requestService.updateRequest(
      parseInt(requestId),
      { status }
    );

    return res.status(200).json({
      message: 'Chỉnh sửa trạng thái yêu cầu thành công',
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
    const request = await requestService.getRequestDetailsById(requestId);

    return res.status(200).json(request);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
  }
};

export const getCustomerRequestsForWeek = async (
  req: Request,
  res: Response
) => {
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
    console.log(companyId, companyIdFromToken);
    return res
      .status(403)
      .json({ message: 'Bạn không có quyền truy cập tài nguyên này!' });
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
};

//thảo sprint 3
export const getCompanyProfile = async (req: Request, res: Response) => {
  const companyId = parseInt(req.params.companyId, 10);
  const companyIdFromToken = req.userId; // Giả sử bạn đã xác thực và lấy companyId từ token

  if (companyId !== companyIdFromToken) {
    console.log(companyId, companyIdFromToken);
    return res
      .status(403)
      .json({ message: 'Bạn không có quyền truy cập tài nguyên này!' });
  }

  try {
    const companyProfile = await getCompanyProfileById(companyId);

    if (!companyProfile) {
      return res.status(404).json({ message: 'Công ty không tồn tại' });
    }

    return res.status(200).json(companyProfile);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: 'Đã xảy ra lỗi ở server', error: error.message });
    }
    return res
      .status(500)
      .json({ message: 'Đã xảy ra lỗi không xác định ở server' });
  }
};

export const getCompanyThongKe = async (req: Request, res: Response) => {
  const companyId = parseInt(req.params.companyId, 10);
  const companyIdFromToken = req.userId; // Giả sử bạn đã xác thực và lấy companyId từ token
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

  if (companyId !== companyIdFromToken) {
    console.log(companyId, companyIdFromToken);
    return res
      .status(403)
      .json({ message: 'Bạn không có quyền truy cập tài nguyên này!' });
  }

  try {
    const statistics = await getCompanyThongKeService(
      companyId,
      startDate,
      endDate
    );

    if (!statistics || statistics.length === 0) {
      return res.status(404).json({ message: 'Không có dữ liệu thống kê.' });
    }

    return res.status(200).json(statistics);
  } catch (error) {
    console.error('Lỗi trong quá trình lấy dữ liệu thống kê:', error);
    return res.status(500).json({
      message:
        'Đã xảy ra lỗi trong quá trình truy vấn dữ liệu. Hoặc bạn đã thiếu trường startDate và endDate',
    });
  }
};

export const editCompanyProfile = async (req: Request, res: Response) => {
  const companyId = parseInt(req.params.companyId); // Lấy companyId từ params
  const {
    company_name,
    address,
    address_tinh,
    phone,
    email,
    service_cost,
    description,
    service,
    worktime,
  } = req.body;

  const imageFiles = req.files as Express.Multer.File[]; // Lấy tất cả các tệp ảnh từ req.files

  try {
    const company = await getCompanyById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Công ty không tồn tại' });
    }

    let imageUrls: string[] = []; // Mảng lưu các URL ảnh

    // Nếu có ảnh được gửi lên, upload lên Cloudinary
    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        const result = await uploadImageToCloudinary(imageFile); // Upload ảnh lên Cloudinary
        imageUrls.push(result.secure_url); // Thêm URL vào mảng imageUrls
      }
    }

    // Cập nhật thông tin công ty trong cơ sở dữ liệu
    const updatedCompany = await updateCompanyProfile(companyId, {
      company_name: company_name || company.company_name, // Cập nhật nếu có, nếu không giữ nguyên
      address: address || company.address,
      address_tinh: address_tinh || company.address_tinh,
      phone: phone || company.phone,
      email: email || company.account?.email, // Cập nhật email nếu có
      service_cost: service_cost || company.service_cost,
      description: description || company.description,
      service: service || company.service,
      worktime: worktime || company.worktime,
      main_image: imageUrls[0] ?? company.main_image,
      image2: imageUrls[1] ?? company.image2,
      image3: imageUrls[2] ?? company.image3,
      image4: imageUrls[3] ?? company.image4,
      image5: imageUrls[4] ?? company.image5,
    });

    return res.status(200).json({
      message: 'Cập nhật thông tin công ty thành công',
      companyId,
      company_name: updatedCompany.company_name,
      address: updatedCompany.address,
      address_tinh: updatedCompany.address_tinh,
      phone: updatedCompany.phone,
      description: updatedCompany.description,
      service: updatedCompany.service,
      service_cost: updatedCompany.service_cost,
      worktime: updatedCompany.worktime,
      main_image: updatedCompany.main_image,
      image2: updatedCompany.image2,
      image3: updatedCompany.image3,
      image4: updatedCompany.image4,
      image5: updatedCompany.image5,
      account: {
        email: updatedCompany.account?.email, // Trả về email từ bảng Account
      },
    });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};
