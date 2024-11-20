import { AppDataSource } from '../config/data-source';
import { Company } from '../entity/company.entity';
import { Statistic } from '../entity/statistic.entity';
import { Request } from '../entity/request.entity';
import { RequestStatusEnum } from '../enums/requestStatus.enum';

export async function seedStatistics() {
  const companyRepository = AppDataSource.getRepository(Company);
  const statisticRepository = AppDataSource.getRepository(Statistic);
  const requestRepository = AppDataSource.getRepository(Request);

  // Xóa dữ liệu cũ trong bảng Statistic
  await statisticRepository.clear();
  console.log('Dữ liệu cũ trong bảng Statistic đã bị xóa!');

  const companies = await companyRepository.find();

  for (const company of companies) {
    // Lấy tất cả các yêu cầu của công ty bằng cách tìm theo company_id
    const requests = await requestRepository.find({
      where: { company: { company_id: company.company_id } },
    });

    if (requests.length === 0) {
      console.log(`Công ty ${company.company_name} không có yêu cầu nào.`);
      continue; // Bỏ qua nếu không có yêu cầu
    }

    const total_revenue = Math.round(
      requests
        .filter(request => request.status === RequestStatusEnum.COMPLETED)
        .reduce((sum, request) => {
          // Kiểm tra nếu price và workingHours đều hợp lệ
          const price = Number(request.price);
          const workingHours = Number(request.workingHours);

          // Kiểm tra tính hợp lệ của price và workingHours
          if (
            isNaN(price) ||
            isNaN(workingHours) ||
            price <= 0 ||
            workingHours <= 0
          ) {
            console.log(
              `Yêu cầu với ID ${request.request_id} có giá trị không hợp lệ, bỏ qua.`
            );
            return sum; // Nếu không hợp lệ, bỏ qua yêu cầu này
          }

          // Tính doanh thu cho yêu cầu hợp lệ
          return sum + price * workingHours;
        }, 0)
    );
    const total_jobs = requests.length;

    const successful_jobs = requests.filter(
      request => request.status === RequestStatusEnum.COMPLETED
    ).length;

    const failed_jobs = requests.filter(
      request => request.status === RequestStatusEnum.REJECTED
    ).length;

    // Tạo bản ghi thống kê
    const statistic = new Statistic();
    statistic.company = company;
    statistic.total_revenue = Math.round(total_revenue);
    statistic.total_jobs = total_jobs;
    statistic.successful_jobs = successful_jobs;
    statistic.failed_jobs = failed_jobs;
    statistic.statistic_date = new Date();

    await statisticRepository.save(statistic);
    console.log(`Thống kê cho công ty ${company.company_name} đã được tạo.`);
  }

  console.log('Seed thống kê hoàn thành!');
}
