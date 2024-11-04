import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token không tồn tại' }); // Không có token
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token không hợp lệ' }); // Token không hợp lệ
    }

    // Kiểm tra xem decoded có chứa userId không
    if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
      const payload = decoded as JwtPayload & { userId: number };
      req.userId = payload.userId;
      return next();
    } else {
      return res.status(403).json({ message: 'Token không có id người dùng' });
    }
  });
};
