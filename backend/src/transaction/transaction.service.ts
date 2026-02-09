import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterTransaction } from './dto/register-transaction.dto';
import { UpdateTransaction } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService) {}

  async createTransaction(userId: string, data: RegisterTransaction) {
    const { description, amount, type, categoryId, date } = data;

    if (!description || !amount || !type || !categoryId || !date) {
      throw new BadRequestException('Some date is null');
    }

    return this.prismaService.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type,
        categoryId: data.categoryId,
        date: data.date,
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    const transaction = await this.prismaService.transaction.findMany({
      where: { userId: userId },
    });

    if (transaction.length === 0) {
      throw new NotFoundException('Transações não encontrada');
    }

    return transaction;
  }

  async findById(userId: string, id: string) {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { userId: userId, id },
    });

    if (transaction === null) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async findByCategory(categoryId: string, userId: string) {
    const transaction = await this.prismaService.transaction.findMany({
      where: { userId, categoryId },
    });

    if (transaction.length === 0) {
      throw new NotFoundException('Nenhuma transação nessa categoria');
    }

    return transaction;
  }

  async findByType(type: TransactionType, userId: string) {
    const transaction = await this.prismaService.transaction.findMany({
      where: { userId, type },
    });

    if (transaction.length === 0) {
      throw new NotFoundException(
        'Não foi encontrada nenhuma transação com esse tipo',
      );
    }

    if (type && !Object.values(TransactionType).includes(type)) {
      throw new BadRequestException('Tipo invalido');
    }

    return transaction;
  }

  async updateTransaction(id: string, userId: string, data: UpdateTransaction) {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { userId: userId, id },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    await this.prismaService.transaction.update({
      where: { userId: userId, id },
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type,
        categoryId: data.categoryId,
        date: data.date,
      },
    });

    return {
      message: 'Transação alterada',
    };
  }

  async deleteTransaction(id: string, userId: string) {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { userId: userId, id },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    await this.prismaService.transaction.delete({ where: { id } });

    return {
      message: 'Transação excluida com sucesso!',
    };
  }
}
