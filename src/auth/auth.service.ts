import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Omit<User, 'password'>; token: { accessToken: string } }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.getTokenForUser(user);

    return { user: this.withoutPassword(user), token };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: Omit<User, 'password'>; token: { accessToken: string } }> {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.usersService.create(registerDto);

    const token = await this.getTokenForUser(user);

    return { user: this.withoutPassword(user), token };
  }

  withoutPassword(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  private async getTokenForUser(user: User): Promise<{ accessToken: string }> {
    const payload = { sub: user._id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;
    return user;
  }
}
