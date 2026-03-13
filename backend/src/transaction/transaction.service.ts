import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterTransaction } from './dto/register-transaction.dto';
import { UpdateTransaction } from './dto/update-transaction.dto';
import { Prisma } from '@prisma/client';
import { FindTransactionDto } from './dto/find-order.dto';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService) {}

  private buildDateRange(
    startDate?: string,
    endDate?: string,
  ): Prisma.DateTimeFilter {
    const range: Prisma.DateTimeFilter = {};

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      range.gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      range.lte = end;
    }

    return range;
  }

  async createTransaction(userId: string, data: RegisterTransaction) {
    return this.prismaService.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type,
        categoryId: data.categoryId,
        date: data.date,
        userId: userId,
      },
    });
  }

  async findAllByUser(userId: string, filters: FindTransactionDto) {
    const { type, categoryId, startDate, endDate } = filters;

    const where: Prisma.TransactionWhereInput = {
      userId,
    };

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (startDate || endDate) {
      where.date = this.buildDateRange(startDate, endDate);
    }

    const transactions = await this.prismaService.transaction.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    return transactions;
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

  async updateTransaction(id: string, userId: string, data: UpdateTransaction) {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { userId: userId, id },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    console.log(data);

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
