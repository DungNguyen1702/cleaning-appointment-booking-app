// import { AppDataSource } from '../config/data-source';
// import { User } from '../entity/user.entity';
// import { Company } from '../entity/company.entity';
// import { Request } from '../entity/request.entity';
// import { RequestStatusEnum } from '../enums/requestStatus.enum';

// export async function seedRequests() {
//   const userRepository = AppDataSource.getRepository(User);
//   const companyRepository = AppDataSource.getRepository(Company);
//   const requestRepository = AppDataSource.getRepository(Request);

//   const users = await userRepository.find();
//   const companies = await companyRepository.find();

//   for (let i = 161; i <= 170; i++) {
//     const request = new Request();
//     request.user = users[i % users.length]; // Chọn ngẫu nhiên người dùng
//     request.company = companies[i % companies.length]; // Chọn ngẫu nhiên công ty
//     request.name = `Khách hàng ${i}`;
//     request.phone = `012345678${i}`;
//     request.address = `Địa chỉ ${i}`;
//     request.status = RequestStatusEnum.COMPLETED; // Giả sử trạng thái đang chờ
//     request.price = Math.floor(Math.random() * 1000000); // Giá ngẫu nhiên
//     request.notes = `Ghi chú cho yêu cầu ${i}`;
//     request.request = `Yêu cầu từ khách hàng ${i}`;
//     request.request_date = new Date();
//     request.timejob = new Date(`2024-11-17 14:00:00`);
//     request.request_date = new Date();
//     request.workingHours = parseFloat((Math.random() + 1).toFixed(1));

//     await requestRepository.save(request);
//   }
// }

import { AppDataSource } from '../config/data-source';
import { Company } from '../entity/company.entity';
import { Request } from '../entity/request.entity';

export async function updateRequestPrices() {
  const companyRepository = AppDataSource.getRepository(Company);
  const requestRepository = AppDataSource.getRepository(Request);

  // Lấy tất cả các công ty
  const companies = await companyRepository.find();

  for (const company of companies) {
    // Lấy tất cả các yêu cầu của công ty này
    const requests = await requestRepository.find({
      where: { company: { company_id: company.company_id } },
    });

    if (requests.length === 0) {
      console.log(`Công ty ${company.company_name} không có yêu cầu nào.`);
      continue; // Bỏ qua nếu không có yêu cầu
    }

    // Cập nhật giá trị price của mỗi yêu cầu với giá trị service_cost của công ty
    for (const request of requests) {
      if (!request.price || request.price <= 0) {
        request.price = company.service_cost;
        await requestRepository.save(request);
        console.log(`Đã cập nhật price cho yêu cầu ID: ${request.request_id}`);
      }
    }
  }

  console.log('Cập nhật giá trị price hoàn tất!');
}
