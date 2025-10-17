import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/schemas/user.schema';

type AuthResponse = {
  user: Omit<User, 'password'>;
  token: { accessToken: string };
};

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    const {
      user,
      token: { accessToken },
    } = await this.auth.register(registerDto);
    return { user, token: { accessToken } };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    const {
      user,
      token: { accessToken },
    } = await this.auth.login(loginDto);

    return { user, token: { accessToken } };
  }
}
