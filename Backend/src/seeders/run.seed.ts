import { AppDataSource } from '../config/data-source';
import { seedCustomers } from '../seeders/user.seed';
import { seedCompanies, updateCompanyAddressTinh, updateCompanyImage } from '../seeders/company.seed';
import { seedRatingStatistics } from '../seeders/ratingStatistic.seed';
import { seedRequests } from '../seeders/request.seed';
import { seedReviews } from '../seeders/review.seed';
import { seedStatistics } from '../seeders/statistic.seed';
import { seedTodos } from '../seeders/todo.seed';
import { seedTodoRepeats } from '../seeders/todoRepeat.seed';

async function runSeed() {
  // Kết nối đến cơ sở dữ liệu
  await AppDataSource.initialize();

  // Chạy hàm seed
  // await seedCustomers();
  // await seedCompanies();
  // await seedRatingStatistics();
  // await seedRequests();
  // await seedReviews();
  // await seedStatistics();
  // await seedTodos();
  // await seedTodoRepeats();
  await updateCompanyAddressTinh();
  await updateCompanyImage();

  // Đóng kết nối
  await AppDataSource.destroy();
}

runSeed().catch(error => console.log(error));
