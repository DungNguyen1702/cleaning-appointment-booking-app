import { Request, Response } from 'express';
import { registerAccount, authenticateAccount } from '../services/auth.service';
import { validationResult } from 'express-validator';
import { generateToken } from '../utils/auth';
import { getUserByAccountId } from '../services/user.service';
import { getCompanyByAccountId } from '../services/company.service';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, birthday, role } = req.body;

  try {
    await registerAccount(fullname, email, password, birthday, role);
    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: 'Đã xảy ra lỗi' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const account = await authenticateAccount(email, password);
    const token = generateToken(account.account_id);

    // Kiểm tra vai trò và lấy thông tin người dùng hoặc công ty
    let userOrCompany;
    if (account.role === 'CUSTOMER') {
      // Lấy thông tin user
      userOrCompany = await getUserByAccountId(account.account_id);
    } else if (account.role === 'COMPANY') {
      // Lấy thông tin công ty
      userOrCompany = await getCompanyByAccountId(account.account_id);
    }

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      userOrCompany,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: 'Đã xảy ra lỗi' });
  }
};
