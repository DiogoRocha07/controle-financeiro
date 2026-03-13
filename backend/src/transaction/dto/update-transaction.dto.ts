import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateTransaction {
  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  date?: string;
}
