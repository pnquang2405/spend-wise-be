import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  user_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  category_id?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  transaction_date?: string;

  @IsOptional()
  meta?: Record<string, any>;
}
