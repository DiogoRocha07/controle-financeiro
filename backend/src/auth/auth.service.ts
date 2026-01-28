import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('User not exists');
    }

    if (password !== user.password) {
      throw new ConflictException('Email ou senha incorretos!');
    }

    return {
      message: 'Login successful',
    };
  }

  async register(username: string, email: string, password: string) {
    const userExisting = await this.usersService.findOne(email);

    if (userExisting) {
      throw new ConflictException('User already exists');
    }

    const user = await this.usersService.createUser(username, email, password);

    return {
      message: 'User successfully created',
      user,
    };
  }
}
