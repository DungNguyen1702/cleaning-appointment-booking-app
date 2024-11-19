import { Company } from '../entity/company.entity';
import { Request } from '../entity/request.entity';
import { RequestStatusEnum } from '../enums/requestStatus.enum';
import { AppDataSource } from '../config/data-source'; // Sử dụng DataSource từ file cấu hình
import { SelectQueryBuilder } from 'typeorm';
import { Statistic } from '../entity/statistic.entity';
import { Request as RequestEntity } from '../entity/request.entity';

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

//thảo sprint 3
export const getCompanyProfileById = async (companyId: number) => {
  const company = await Company.createQueryBuilder('company')
    .leftJoinAndSelect('company.account', 'account')
    .where('company.company_id = :companyId', { companyId })
    .select([
      'company.company_id',
      'company.company_name',
      'company.phone',
      'company.address',
      'company.address_tinh',
      'account.email',
      'company.service_cost',
      'company.main_image',
      'company.image2',
      'company.image3',
      'company.image4',
      'company.image5',
      'company.description',
      'company.service',
      'company.worktime',
    ])
    .getOne();

  return company;
};

export const getCompanyThongKeService = async (
  companyId: number,
  startDate: Date,
  endDate: Date
) => {
  // Lấy dữ liệu thống kê từ bảng Statistic
  const statistics = await AppDataSource.getRepository(Statistic)
    .createQueryBuilder('statistic')
    .leftJoinAndSelect('statistic.company', 'company')
    .leftJoinAndSelect('company.ratingStatistics', 'ratingStatistics')
    .where('company.company_id = :companyId', { companyId })
    .select([
      'statistic.statistic_id',
      'company.company_id',
      'statistic.total_revenue',
      'statistic.total_jobs',
      'statistic.successful_jobs',
      'statistic.failed_jobs',
      'statistic.statistic_date',
      'ratingStatistics.rating',
      'ratingStatistics.count',
      'ratingStatistics.statistic_id',
    ])
    .getMany();

  // Lấy dữ liệu yêu cầu từ bảng Request
  const requests = await AppDataSource.getRepository(RequestEntity)
    .createQueryBuilder('request')
    .where('request.company_id = :companyId', { companyId })
    .andWhere('DATE(request.request_date) BETWEEN :startDate AND :endDate', {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    })
    .select(['request.request_id', 'request.request_date'])
    .getMany();

  const weekData: { [key: string]: { soLuong: number }[] } = {
    THU_HAI: [],
    THU_BA: [],
    THU_TU: [],
    THU_NAM: [],
    THU_SAU: [],
    THU_BAY: [],
    CHU_NHAT: [],
  };

  const dayCount: { [key: string]: number } = {
    THU_HAI: 0,
    THU_BA: 0,
    THU_TU: 0,
    THU_NAM: 0,
    THU_SAU: 0,
    THU_BAY: 0,
    CHU_NHAT: 0,
  };

  requests.forEach(request => {
    const requestDate = new Date(request.request_date);
    const dayOfWeek = requestDate.getDay();
    const daysOfWeek = [
      'CHU_NHAT',
      'THU_HAI',
      'THU_BA',
      'THU_TU',
      'THU_NAM',
      'THU_SAU',
      'THU_BAY',
    ];
    const dayName = daysOfWeek[dayOfWeek];

    dayCount[dayName]++;
  });

  Object.keys(dayCount).forEach(day => {
    weekData[day].push({ soLuong: dayCount[day] });
  });

  const result = statistics.map((statistic: any) => {
    const company = statistic.company;

    return {
      statistic_id: statistic.statistic_id,
      company_id: company.company_id,
      total_revenue: statistic.total_revenue,
      total_jobs: statistic.total_jobs,
      successful_jobs: statistic.successful_jobs,
      failed_jobs: statistic.failed_jobs,
      statistic_date: statistic.statistic_date,
      ratingStatistics: company.ratingStatistics.map((ratingStat: any) => ({
        rating: ratingStat.rating,
        count: ratingStat.count,
      })),
      weekData:
        requests.length > 0
          ? weekData
          : {
            THU_HAI: [{ soLuong: 0 }],
            THU_BA: [{ soLuong: 0 }],
            THU_TU: [{ soLuong: 0 }],
            THU_NAM: [{ soLuong: 0 }],
            THU_SAU: [{ soLuong: 0 }],
            THU_BAY: [{ soLuong: 0 }],
            CHU_NHAT: [{ soLuong: 0 }],
          },
    };
  });

  return result;
};

export const updateCompanyProfile = async (
  companyId: number,
  updateData: {
    company_name?: string;
    address?: string;
    address_tinh?: string;
    phone?: string;
    email?: string;
    service_cost?: number;
    description?: string;
    service?: string;
    worktime?: string;
    main_image?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
  }
) => {
  // Lấy repository cho Company
  const companyRepository = AppDataSource.getRepository(Company);

  const company = await companyRepository.findOne({
    where: { company_id: companyId },
    relations: ['account'],
  });

  if (!company) {
    throw new Error('Công ty không tồn tại');
  }

  // Cập nhật các thông tin của công ty
  company.company_name = updateData.company_name || company.company_name;
  company.address = updateData.address || company.address;
  company.address_tinh = updateData.address_tinh || company.address_tinh;
  company.phone = updateData.phone || company.phone;
  company.service_cost = updateData.service_cost || company.service_cost;
  company.description = updateData.description || company.description;
  company.service = updateData.service || company.service;
  company.worktime = updateData.worktime || company.worktime;
  company.main_image = updateData.main_image || company.main_image;
  company.image2 = updateData.image2 || company.image2;
  company.image3 = updateData.image3 || company.image3;
  company.image4 = updateData.image4 || company.image4;
  company.image5 = updateData.image5 || company.image5;

  // Cập nhật email trong bảng Account nếu có
  if (updateData.email && company.account) {
    company.account.email = updateData.email; // Cập nhật email
    try {
      await company.account.save(); // Lưu thay đổi vào bảng Account
    } catch (error) {
      throw new Error('Không thể lưu email mới vào bảng Account');
    }
  }

  // Lưu thông tin công ty
  try {
    await company.save();
  } catch (error) {
    throw new Error('Không thể lưu thông tin công ty');
  }

  return company; // Trả về công ty đã cập nhật
};
