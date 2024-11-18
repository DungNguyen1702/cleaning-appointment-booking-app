import { AppDataSource } from '../config/data-source';
import { Account } from '../entity/account.entity';
import { hashPassword, comparePassword } from '../utils/auth';
import { AccountRoleEnum } from '../enums/account.enum';
import { UserStatusEnum } from '../enums/userStatus.enum';

export const registerAccount = async (
  // fullname: string,
  email: string,
  password: string,
  birthday: string,
  role: AccountRoleEnum = AccountRoleEnum.CUSTOMER
) => {
  const accountRepository = AppDataSource.getRepository(Account);
  const existingAccount = await accountRepository.findOneBy({ email });

  if (existingAccount) {
    throw new Error('email đã được sử dụng');
  }

  const hashedPassword = await hashPassword(password);
  const account = accountRepository.create({
    // fullname,
    email,
    password: hashedPassword,
    birthday,
    role,
    status: UserStatusEnum.ACTIVE,
  });

  await accountRepository.save(account);
  return account;
};

export const authenticateAccount = async (email: string, password: string) => {
  const accountRepository = AppDataSource.getRepository(Account);
  const account = await accountRepository.findOneBy({ email });

  if (!account) {
    throw new Error('Tài khoản không tồn tại');
  }

  const isPasswordValid = await comparePassword(password, account.password);
  if (!isPasswordValid) {
    throw new Error('Mật khẩu không đúng');
  }

  return account;
};
