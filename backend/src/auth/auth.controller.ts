// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Controller, Post, Get, Query, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.username, body.email, body.password);
  }
}
