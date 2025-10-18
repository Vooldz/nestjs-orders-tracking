import { IsEnum, IsOptional } from 'class-validator';
import { orderStatus } from '../status.enum';

export class UpdateOrderDto {
  @IsEnum(orderStatus, {
    message: `Status must be one of: ${Object.values(orderStatus).join(', ')}`,
  })
  @IsOptional()
  status?: orderStatus;
}
