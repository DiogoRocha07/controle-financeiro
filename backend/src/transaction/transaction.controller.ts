import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionService } from './transaction.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthUser } from 'src/common/types/auth-user.type';
import { RegisterTransaction } from './dto/register-transaction.dto';
import { UpdateTransaction } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(
    @CurrentUser() user: AuthUser,
    @Body() body: RegisterTransaction,
  ) {
    return this.transactionService.createTransaction(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findTransactions(
    @CurrentUser() user: AuthUser,
    @Query('type') type?: TransactionType,
  ) {
    if (type) {
      return this.transactionService.findByType(type, user.userId);
    }

    return this.transactionService.findAllByUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.transactionService.findByCategory(categoryId, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findTransaction(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.transactionService.findById(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: UpdateTransaction,
  ) {
    return this.transactionService.updateTransaction(id, user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTransaction(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.transactionService.deleteTransaction(id, user.userId);
  }
}
