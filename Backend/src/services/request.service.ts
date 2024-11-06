import { Repository, SelectQueryBuilder } from 'typeorm';
import { Request } from '../entity/request.entity';
import { CreateRequestDto } from '../dtos/request.dto';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user.entity';
import { Company } from '../entity/company.entity';
import { DayOfWeekEnum } from '../enums/dayOfWeek.enum';
import { RequestStatusEnum } from '../enums/requestStatus.enum';

// Tạo ánh xạ chỉ số ngày tới enum
const dayOfWeekMap: { [key: number]: DayOfWeekEnum } = {
  0: DayOfWeekEnum.CHU_NHAT, // Chủ Nhật
  1: DayOfWeekEnum.THU_HAI, // Thứ Hai
  2: DayOfWeekEnum.THU_BA, // Thứ Ba
  3: DayOfWeekEnum.THU_TU, // Thứ Tư
  4: DayOfWeekEnum.THU_NAM, // Thứ Năm
  5: DayOfWeekEnum.THU_SAU, // Thứ Sáu
  6: DayOfWeekEnum.THU_BAY, // Thứ Bảy
};

export class RequestService {
  private requestRepo: Repository<Request>;
  private userRepo: Repository<User>;
  private companyRepo: Repository<Company>;

  constructor() {
    this.requestRepo = AppDataSource.getRepository(Request);
    this.userRepo = AppDataSource.getRepository(User);
    this.companyRepo = AppDataSource.getRepository(Company);
  }

  async createRequest(data: CreateRequestDto) {
    console.log(data);

    const userExists = await this.userRepo.findOne({
      where: { user_id: data.user_id },
    });
    const companyExists = await this.companyRepo.findOne({
      where: { company_id: data.company_id },
    });

    if (!userExists) {
      throw new Error('User not found');
    }
    if (!companyExists) {
      throw new Error('Company not found');
    }

    const newRequest = this.requestRepo.create({
      user: { user_id: data.user_id },
      company: { company_id: data.company_id },
      name: data.name,
      phone: data.phone,
      address: data.address,
      request_date: new Date(data.request_date),
      timejob: data.timejob,
      status: data.status,
      price: data.price,
      notes: data.notes,
      request: data.request,
    });

    console.log('New Request before save:', newRequest);
    return await this.requestRepo.save(newRequest);
  }

  async getRequests() {
    return await this.requestRepo.find({ relations: ['user', 'company'] });
  }

  async updateRequest(id: number, data: Partial<CreateRequestDto>) {
    const existingRequest = await this.requestRepo.findOne({
      where: { request_id: id },
    });

    if (!existingRequest) {
      throw new Error('Request not found');
    }
    Object.assign(existingRequest, data);
    await this.requestRepo.save(existingRequest);
    return existingRequest;
  }

  async deleteRequest(id: number) {
    return await this.requestRepo.delete(id);
  }

  async getRequestById(id: number) {
    return await this.requestRepo.findOne({
      where: { request_id: id },
      relations: ['user', 'company'],
    });
  }

  async getPagedRequests(
    userId: number,
    page: number,
    limit: number,
    startDate: string,
    companyName: string
  ) {
    const query: SelectQueryBuilder<Request> = this.requestRepo
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.company', 'company')
      .where('request.user_id = :userId', { userId })
      .select([
        'request.request_id',
        'request.timejob',
        'request.price',
        'request.request',
        'company.company_id',
        'company.company_name',
        'company.address_tinh',
        'company.main_image',
      ]);

    if (startDate) {
      const parsedStartDate = new Date(startDate);
      const nextDay = new Date(parsedStartDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.andWhere(
        'DATE(request.timejob) >= :startDate AND DATE(request.timejob) < :nextDay',
        {
          startDate: parsedStartDate.toISOString().slice(0, 10),
          nextDay: nextDay.toISOString().slice(0, 10),
        }
      );
    }

    if (companyName) {
      query.andWhere('company.company_name LIKE :companyName', {
        companyName: `%${companyName}%`,
      });
    }

    const [companies, totalCompanies] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalCompanies / limit);

    const formattedCompanies = companies.map(company => ({
      request_id: company.request_id,
      price: company.price,
      request: company.request,
      timejob: company.timejob.toISOString().slice(0, 10),
      company: {
        company_id: company.company.company_id,
        company_name: company.company.company_name,
        address_tinh: company.company.address_tinh,
        main_image: company.company.main_image,
      },
    }));

    return {
      companies: formattedCompanies,
      totalCompanies,
      totalPages,
      currentPage: page,
    };
  }

  async getCustomerRequestsForWeek(
    companyId: number,
    startDate: Date,
    endDate: Date
  ) {
    const query: SelectQueryBuilder<Request> = this.requestRepo
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('request.company', 'company')
      .where('DATE(request.timejob) BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
      .andWhere('request.company_id = :companyId', { companyId })
      .select([
        'request.request_id',
        'request.timejob',
        'request.status',
        'request.workingHours',
        'user.user_id',
        'user.full_name',
      ]);

    const requests = await query.getMany();

    // Tổ chức dữ liệu theo ngày trong tuần
    const weekData: { [key in DayOfWeekEnum]?: Request[] } = {};

    Object.values(DayOfWeekEnum).forEach(day => {
      weekData[day] = [];
    });

    requests.forEach(request => {
      const dayOfWeek = new Date(request.timejob).getDay();
      const dayKey = dayOfWeekMap[dayOfWeek];
      if (dayKey && weekData[dayKey]) {
        // Tính toán timeWorking
        const startTime = new Date(request.timejob);
        const workingHours = request.workingHours;
        const endTime = new Date(startTime.getTime() + workingHours * 60 * 60 * 1000);

        const formatTime = (date: Date) => {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        };

        // const timeWorking = `${formatTime(startTime)}-${formatTime(endTime)}`;
        const timeWorking = `${formatTime(startTime)}`;
        // Thêm timeWorking vào request
        (request as any).timeWorking = timeWorking;

        // Định dạng timejob
        const formatDate = (date: Date) => {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // tháng bắt đầu từ 0
          const year = date.getFullYear();
          return `${formatTime(date)} ${day}/${month}/${year}`;
        };

        (request as any).timejob = formatDate(new Date(request.timejob)); // cập nhật timejob

        weekData[dayKey]?.push(request);
      }
    });

    // Sắp xếp các công việc theo thời gian bắt đầu và request_id
    Object.keys(weekData).forEach(day => {
      weekData[day as DayOfWeekEnum]?.sort((a, b) => {
        if (a.timejob === b.timejob) {
          return a.request_id - b.request_id;
        }
        return new Date(a.timejob).getTime() - new Date(b.timejob).getTime();
      });
    });

    return weekData;
  }


  async getRequestDetailsById(id: number) {
    try {
      const requestDetails = await this.requestRepo
        .createQueryBuilder('request')
        .leftJoinAndSelect('request.user', 'user')
        .where('request.request_id = :id', { id })
        .select([
          'request.request_id',
          'request.price',
          'request.request',
          'request.notes',
          'request.timejob',
          'request.workingHours',
          'request.status',
          'user.user_id',
          'user.full_name',
          'user.phone_number',
          'user.address',
          'user.address_tinh',
        ])
        .getOne();

      if (!requestDetails) {
        throw new Error('Yêu cầu không tồn tại');
      }

      // Định dạng lại timejob
      const formattedTimejob = new Date(requestDetails.timejob).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Nếu muốn định dạng 24 giờ
      });

      return {
        ...requestDetails,
        timejob: formattedTimejob // Trả về timejob đã định dạng
      };
    } catch (error) {
      // Xử lý lỗi liên quan đến cơ sở dữ liệu hoặc truy vấn
      throw new Error('Lỗi khi truy vấn yêu cầu: ' + (error instanceof Error ? error.message : 'lỗi không xác định'));
    }
  }

  async getRequestsByCompanyId(
    companyId: number,
    page: number,
    limit: number,
    name?: string
  ) {
    const requestRepository = AppDataSource.getRepository(Request);

    const queryBuilder = requestRepository
      .createQueryBuilder('request')
      .where('request.company_id = :companyId', { companyId })
      .orderBy('request.createdAt', 'DESC')
      .skip((page - 1) * limit) // Xác định vị trí bắt đầu
      .take(limit); // Số lượng bản ghi trả về

    if (name) {
      queryBuilder.andWhere('request.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    const [requests, totalRequests] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalRequests / limit);

    // Định dạng lại thời gian của từng request
    const formatTimejob = (date: Date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    // Cập nhật lại `timejob` cho từng request
    const formattedRequests = requests.map(request => ({
      ...request,
      timejob: formatTimejob(new Date(request.timejob))
    }));

    return {
      totalRequests,
      totalPages,
      currentPage: page,
      requests: formattedRequests,
    };
  }
  async updateRequestByCompany(
    requestId: number,
    updateData: { workingHours?: string; status?: string }
  ) {
    const requestRepository = AppDataSource.getRepository(Request);
    const request = await requestRepository.findOneBy({
      request_id: requestId,
    });

    if (!request) {
      throw new Error('Yêu cầu không tồn tại');
    }

    if (updateData.workingHours !== undefined) {
      // Chuyển đổi từ string sang number
      const workingHours = parseFloat(updateData.workingHours as string);

      // Kiểm tra xem workingHours có phải là một số hợp lệ không
      if (!isNaN(workingHours)) {
        request.workingHours = workingHours;
      } else {
        throw new Error('workingHours phải là một số hợp lệ');
      }
    }
    if (updateData.status) {
      if (
        Object.values(RequestStatusEnum).includes(
          updateData.status as RequestStatusEnum
        )
      ) {
        request.status = updateData.status as RequestStatusEnum; // Gán giá trị đã kiểm tra
      } else {
        throw new Error(
          'status phải là một giá trị hợp lệ trong RequestStatusEnum'
        );
      }
    }

    await requestRepository.save(request);
    return request;
  }
  async getRequestByIdAndUserId(
    requestId: number,
    userId: number
  ): Promise<Request | null> {
    const requestRepository = AppDataSource.getRepository(Request);

    const query = requestRepository
      .createQueryBuilder('request')
      .where('request.request_id = :requestId', { requestId })
      .andWhere('request.user_id = :userId', { userId });

    const request = await query.getOne();
    return request; // Trả về yêu cầu hoặc null nếu không tìm thấy
  }

}
