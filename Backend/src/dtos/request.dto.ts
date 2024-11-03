import { RequestStatusEnum } from '../enums/requestStatus.enum';

export class CreateRequestDto {
  user_id: number;
  company_id: number;
  name: string;
  phone: string;
  address: string;
  request_date: string; // format: 'YYYY-MM-DD'
  timejob: string;
  status: RequestStatusEnum;
  price: number;
  notes?: string;
  request: string;
  workingHours?: number;
}
