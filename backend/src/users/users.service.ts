import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user || null;
  }

  async createUser(username: string, email: string, password: string) {
    const user = await this.prisma.user.create({
      data: { username, email, password },
    });

    return user;
  }

  async deleteUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { email: email },
    });

    return {
      message: 'Usuario excluido!',
    };
  }
}
