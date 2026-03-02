import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }

  async findByEmail(email: string) {
    console.log('EMAIL RECEBIDO:', email);

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    return user || null;
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return users;
  }

  async createUser(username: string, email: string, password: string) {
    const user = await this.prismaService.user.create({
      data: { username, email, password },
    });

    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.user.delete({
      where: { id: userId },
    });

    return {
      message: 'Usuario excluido!',
    };
  }
}
