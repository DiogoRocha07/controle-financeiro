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
import { FindTransactionDto } from './dto/find-order.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Criar Transação' })
  @ApiResponse({ status: 201, description: 'Transação criada' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(
    @CurrentUser() user: AuthUser,
    @Body() body: RegisterTransaction,
  ) {
    return this.transactionService.createTransaction(user.userId, body);
  }

  @ApiOperation({ summary: 'Listar transações com filtros' })
  @ApiQuery({ name: 'type', required: false, enum: ['INCOME', 'EXPENSE'] })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findTransactions(
    @CurrentUser() user: AuthUser,
    @Query() filters: FindTransactionDto,
  ) {
    return this.transactionService.findAllByUser(user.userId, filters);
  }

  @ApiOperation({ summary: 'Buscar transação por ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findTransaction(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.transactionService.findById(user.userId, id);
  }

  @ApiOperation({ summary: 'Atualizar transação' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: UpdateTransaction,
  ) {
    return this.transactionService.updateTransaction(id, user.userId, body);
  }

  @ApiOperation({ summary: 'Excluir transação' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTransaction(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.transactionService.deleteTransaction(id, user.userId);
  }
}
