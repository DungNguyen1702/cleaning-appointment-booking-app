import { Request, Response } from 'express';
import { getCompanyById, fetchAllCompanies } from '../services/company.service';

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
  const location = req.query.location as string || '';
  const name = req.query.name as string || '';

  // Kiểm tra dữ liệu đầu vào
  if (isNaN(page) || page <= 0) {
    return res.status(400).json({ message: 'Tham số page không hợp lệ!' });
  }

  if (isNaN(limit) || limit <= 0) {
    return res.status(400).json({ message: 'Tham số limit không hợp lệ!' });
  }

  try {
    const { companies, totalCompanies } = await fetchAllCompanies(page, limit, location, name);

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
    return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình truy vấn dữ liệu.' });
  }
};

