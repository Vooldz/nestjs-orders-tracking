import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Role } from '../../auth/roles.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsOptional()
  @IsEnum(Role, {
    message: `Role must be either ${Role.USER} or ${Role.ADMIN}`,
  })
  role?: Role;
}
