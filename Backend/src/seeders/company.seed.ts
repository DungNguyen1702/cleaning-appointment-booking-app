import { AppDataSource } from '../config/data-source'; // Đường dẫn đến file data-source của bạn
import { Account } from '../entity/account.entity';
import { Company } from '../entity/company.entity';
import { AccountRoleEnum } from '../enums/account.enum';
import { UserStatusEnum } from '../enums/userStatus.enum';
import bcrypt from 'bcrypt';

const provinces = [
  'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Điện Biên',
  'Lai Châu', 'Sơn La', 'Yên Bái', 'Hòa Bình', 'Thái Nguyên', 'Lạng Sơn',
  'Quảng Ninh', 'Hải Dương', 'Hưng Yên', 'Thái Bình', 'Nam Định', 'Ninh Bình',
  'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế',
  'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa',
  'Ninh Thuận', 'Bình Thuận', 'Gia Lai', 'Kon Tum', 'Đắk Lắk', 'Đắk Nông',
  'Lâm Đồng', 'Bình Phước', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Hồ Chí Minh',
  'Tây Ninh', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long', 'Đồng Tháp', 'An Giang',
  'Kiên Giang', 'Hậu Giang', 'Cà Mau', 'Sóc Trăng', 'Bạc Liêu', 'Thái Bình'
];

export async function seedCompanies() {
  // const accountRepository = AppDataSource.getRepository(Account);
  // const companyRepository = AppDataSource.getRepository(Company);

  // for (let i = 1; i <= 50; i++) {
  //   // Tạo dữ liệu cho bảng Account
  //   const account = new Account();
  //   account.email = `company${i}@example.com`;
  //   const saltRounds = 10;
  //   account.password = await bcrypt.hash('123456', saltRounds); // Mã hóa mật khẩu
  //   account.fullname = `Công ty ${i}`;
  //   account.birthday = new Date('1990-01-01');
  //   account.role = AccountRoleEnum.COMPANY; // Giả sử có enum cho công ty
  //   account.status = UserStatusEnum.ACTIVE;

  //   // Lưu tài khoản vào cơ sở dữ liệu
  //   await accountRepository.save(account);

  //   // Tạo dữ liệu cho bảng Company
  //   const company = new Company();
  //   company.account = account; // Liên kết với tài khoản đã tạo
  //   company.company_name = `Công ty Dịch vụ ${i}`;
  //   company.address = `Địa chỉ ${i}`;
  //   company.phone = `098765432${i}`;
  //   company.description = `Công ty chuyên cung cấp dịch vụ ${i}.`;
  //   company.service = `Dịch vụ ${i}`;
  //   company.service_cost = 500000 + i * 10000; // Giá dịch vụ tăng dần
  //   company.worktime = 'T2 - CN (7 AM - 19 PM)';
  //   company.main_image =
  //     'https://goldenpacific.vn//uploads/images/ve-sinh-nha-o.jpg';
  //   company.image2 =
  //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOJ_TWE1Zy-gPUgef23zLMcoLnHpjKFni0Yw&s';
  //   company.image3 =
  //     'https://vesinhnha247.com/wp-content/uploads/2024/02/cong-ty-don-ve-sinh-1.jpg';

  //   // Lưu công ty vào cơ sở dữ liệu
  //   await companyRepository.save(company);
  // }
  // console.log('20 công ty đã được chèn thành công!');
}

export  async function updateCompanyAddressTinh() {
  const companyRepository = AppDataSource.getRepository(Company);

  const companies = await companyRepository.find();

  for (let i = 0; i < companies.length; i++) {
    companies[i].address_tinh = provinces[i % provinces.length]; // Gán tỉnh cho công ty
    await companyRepository.save(companies[i]);
  }

  console.log('Đã cập nhật address_tinh cho các công ty!');
}

export async function updateCompanyImage() {
  const companyRepository = AppDataSource.getRepository(Company);

  const companies = await companyRepository.find();

  for (const company of companies) {
    company.image4 = 'https://top10tphcm.com/wp-content/uploads/2019/09/top-dich-vu-don-dep-nha-cua-tot-nhat-tai-binh-duong.jpg';
    company.image5 = 'https://lh3.googleusercontent.com/proxy/YxU9lyWQbECF-wbtJlFsAeJIDdc3EarX926azPuyGk8IlcdTJuokYmIhekLExbI9MJL1WyrkxAjot6uoToP6YzCpqsZ0Dnf061AWYRCDBAh6f-dRfnATwtztekLVA-YaQVY';
    
    await companyRepository.save(company);
  }

  console.log('Đã cập nhật thành công đầy đủ hình ảnh cho các công ty!');
}