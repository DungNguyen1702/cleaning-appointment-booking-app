import { Account } from '../entity/account.entity';
import { User } from '../entity/user.entity';
import { AccountRoleEnum } from '../enums/account.enum';
import { UserStatusEnum } from '../enums/userStatus.enum';
import { AppDataSource } from '../config/data-source';
import bcrypt from 'bcrypt';



const provinces = [
  'Hà Giang',
  'Cao Bằng',
  'Bắc Kạn',
  'Tuyên Quang',
  'Lào Cai',
  'Điện Biên',
  'Lai Châu',
  'Sơn La',
  'Yên Bái',
  'Hòa Bình',
  'Thái Nguyên',
  'Lạng Sơn',
  'Quảng Ninh',
  'Hải Dương',
  'Hưng Yên',
  'Thái Bình',
  'Nam Định',
  'Ninh Bình',
  'Thanh Hóa',
  'Nghệ An',
  'Hà Tĩnh',
  'Quảng Bình',
  'Quảng Trị',
  'Thừa Thiên Huế',
  'Đà Nẵng',
  'Quảng Nam',
  'Quảng Ngãi',
  'Bình Định',
  'Phú Yên',
  'Khánh Hòa',
  'Ninh Thuận',
  'Bình Thuận',
  'Gia Lai',
  'Kon Tum',
  'Đắk Lắk',
  'Đắk Nông',
  'Lâm Đồng',
  'Bình Phước',
  'Đồng Nai',
  'Bà Rịa - Vũng Tàu',
  'Hồ Chí Minh',
  'Tây Ninh',
  'Bến Tre',
  'Trà Vinh',
  'Vĩnh Long',
  'Đồng Tháp',
  'An Giang',
  'Kiên Giang',
  'Hậu Giang',
  'Cà Mau',
  'Sóc Trăng',
  'Bạc Liêu',
  'Thái Bình',
];


export async function seedCustomers() {
  // Thêm từ khóa export ở đây
  const accountRepository = AppDataSource.getRepository(Account);
  const userRepository = AppDataSource.getRepository(User); // Khởi tạo userRepository

  for (let i = 1; i <= 10; i++) {
    // Tạo dữ liệu cho bảng Account
    const account = new Account();
    account.email = `customer${i}@example.com`;
    const saltRounds = 10;
    account.password = await bcrypt.hash('123456', saltRounds);
    account.fullname = `Khách hàng ${i}`;
    account.birthday = new Date('1990-01-01');
    account.role = AccountRoleEnum.CUSTOMER;
    account.status = UserStatusEnum.ACTIVE;

    await accountRepository.save(account); // Lưu tài khoản vào cơ sở dữ liệu

    // Tạo dữ liệu cho bảng User
    const user = new User();
    user.account = account; // Liên kết với tài khoản đã tạo
    user.full_name = `Khách hàng ${i}`;
    user.phone_number = `012345678${i}`;
    user.avatar = null; // Không có ảnh đại diện
    user.address_tinh = provinces[i % provinces.length];
    user.address = `Địa chỉ ${i}`;

    await userRepository.save(user); // Lưu người dùng vào cơ sở dữ liệu
  }
  console.log('10 khách hàng đã được chèn thành công!');
}
