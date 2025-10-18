import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { orderStatus } from '../status.enum';

export class CreateOrderDto {
  @IsString({ message: 'Client name must be a string' })
  @IsNotEmpty({ message: 'Client name cannot be empty' })
  @MinLength(2, { message: 'Client name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Client name cannot exceed 100 characters' })
  clientName: string;

  @IsEnum(orderStatus, {
    message: `Status must be one of: ${Object.values(orderStatus).join(', ')}`,
  })
  @IsOptional()
  status?: orderStatus;
}
