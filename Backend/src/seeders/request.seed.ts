import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user.entity';
import { Company } from '../entity/company.entity';
import { Request } from '../entity/request.entity';
import { RequestStatusEnum } from '../enums/requestStatus.enum';

export async function seedRequests() {
  const userRepository = AppDataSource.getRepository(User);
  const companyRepository = AppDataSource.getRepository(Company);
  const requestRepository = AppDataSource.getRepository(Request);

  const users = await userRepository.find();
  const companies = await companyRepository.find();

  for (let i = 1; i <= 5; i++) {
    const request = new Request();
    request.user = users[i % users.length]; // Chọn ngẫu nhiên người dùng
    request.company = companies[i % companies.length]; // Chọn ngẫu nhiên công ty
    request.name = `Khách hàng ${i}`;
    request.phone = `012345678${i}`;
    request.address = `Địa chỉ ${i}`;
    request.status = RequestStatusEnum.COMPLETED; // Giả sử trạng thái đang chờ
    request.price = Math.floor(Math.random() * 1000000); // Giá ngẫu nhiên
    request.notes = `Ghi chú cho yêu cầu ${i}`;
    request.request = `Yêu cầu từ khách hàng ${i}`;
    request.request_date = new Date();
    request.timejob = new Date(`2024-10-25 10:00:00`);
    request.request_date = new Date();

    await requestRepository.save(request);
  }

  console.log('5 yêu cầu đã được chèn thành công!');
}
