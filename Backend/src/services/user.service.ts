import { User } from '../entity/user.entity';
import uploadImageToCloudinary from '../utils/cloudinaryUpload';

export const getUserByAccountId = async (accountId: number) => {
  const user = await User.findOne({
    where: {
      account: {
        account_id: accountId,
      },
    },
    relations: ['account'],
  });

  return user;
};

export const getUserById = async (userId: number): Promise<User | null> => {
  const user = await User.findOne({
    where: { user_id: userId },
    relations: ['account'], // Lấy thông tin liên quan đến account
  });

  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  return user;
};

interface UpdateUserDTO {
  full_name?: string;
  phone_number?: string;
  address?: string;
  address_tinh?: string;
  avatar?: Express.Multer.File;
  email?: string;
  birthday?: Date;
  gender?: 0 | 1;
}

export const updateUserById = async (
  userId: number,
  updateData: UpdateUserDTO
): Promise<User> => {
  const user = await User.findOne({
    where: { user_id: userId },
    relations: ['account'], // Lấy cả thông tin account
  });

  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  // Cập nhật thông tin User
  user.full_name = updateData.full_name || user.full_name;
  user.phone_number = updateData.phone_number || user.phone_number;
  user.address = updateData.address || user.address;
  user.address_tinh = updateData.address_tinh || user.address_tinh;

  if (updateData.gender !== undefined) {
    user.gender = updateData.gender;
  }

  // Upload avatar nếu có
  if (updateData.avatar) {
    const uploadResult = await uploadImageToCloudinary(updateData.avatar);
    user.avatar = uploadResult.secure_url; // Lưu URL avatar từ Cloudinary
  }

  // Nếu có cập nhật thông tin của bảng Account
  if (user.account) {
    if (updateData.email) {
      user.account.email = updateData.email;
    }

    if (updateData.birthday) {
      user.account.birthday = updateData.birthday;
    }

    await user.account.save(); // Lưu thông tin Account
  }

  await user.save(); // Lưu thông tin User

  return user;
};
