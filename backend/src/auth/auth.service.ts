import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtToken } from './dto/jwtToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ message: string; access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos!');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Email ou senha incorretos!');
    }

    const payload: JwtToken = { sub: user.id, email: user.email };

    const token: string = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token: token,
    };
  }

  async register(username: string, email: string, password: string) {
    const userExisting = await this.usersService.findByEmail(email);

    if (userExisting) {
      throw new ConflictException('User already exists');
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.usersService.createUser(
      username,
      email,
      hashedPassword,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeUser } = user;

    return {
      message: 'User successfully created',
      user: safeUser,
    };
  }
}
