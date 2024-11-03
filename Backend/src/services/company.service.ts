import { Company } from '../entity/company.entity';
import { Request } from '../entity/request.entity';
import { RequestStatusEnum } from '../enums/requestStatus.enum';
import { AppDataSource } from '../config/data-source'; // Sử dụng DataSource từ file cấu hình
import { SelectQueryBuilder } from 'typeorm';

export const getCompanyByAccountId = async (accountId: number) => {
  const company = await Company.findOne({
    where: {
      account: {
        account_id: accountId,
      },
    },
    relations: ['account'],
  });

  return company;
};

export const getCompanyById = async (companyId: number) => {
  const company = await Company.createQueryBuilder('company')
    .leftJoinAndSelect('company.account', 'account')
    .leftJoinAndSelect('company.ratingStatistics', 'ratingStatistics')
    .where('company.company_id = :companyId', { companyId })
    .select([
      'company',
      'account.email',
      'ratingStatistics.rating',
      'ratingStatistics.count',
    ])
    .getOne();

  return company;
};

export const fetchAllCompanies = async (
  page: number,
  limit: number,
  location: string,
  name: string
) => {
  const companyRepository = AppDataSource.getRepository(Company); // Lấy repository của Company
  const requestRepository = AppDataSource.getRepository(Request); // Lấy repository của Request

  const query: SelectQueryBuilder<Company> = companyRepository
    .createQueryBuilder('company')
    .leftJoinAndSelect('company.account', 'account')
    .select([
      'company.company_id',
      'company.company_name',
      'company.address_tinh',
      'company.service_cost',
      'company.main_image',
    ]);

  // Thêm điều kiện lọc theo địa điểm
  if (location) {
    query.andWhere('company.address_tinh LIKE :location', {
      location: `%${location}%`,
    });
  }

  // Thêm điều kiện tìm kiếm theo tên công ty
  if (name) {
    query.andWhere('company.company_name LIKE :name', { name: `%${name}%` });
  }

  const [companies, totalCompanies] = await query
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  // Thêm bước đếm số lượng request có trạng thái COMPLETED cho mỗi công ty
  const companiesWithRequestCount = await Promise.all(
    companies.map(async company => {
      const completedRequestsCount = await requestRepository
        .createQueryBuilder('request')
        .where('request.company_id = :companyId', {
          companyId: company.company_id,
        })
        .andWhere('request.status = :status', {
          status: RequestStatusEnum.COMPLETED,
        })
        .getCount();

      return {
        company_id: company.company_id,
        company_name: company.company_name,
        address_tinh: company.address_tinh,
        service_cost: company.service_cost,
        main_image: company.main_image,
        completedRequestsCount,
      };
    })
  );

  return { companies: companiesWithRequestCount, totalCompanies };
};
