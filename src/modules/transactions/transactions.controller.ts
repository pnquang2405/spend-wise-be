import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateTransactionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const transaction = await this.service.createTransaction(dto, file);
    return {
      message: 'Transaction created successfully',
      data: transaction,
    };
  }
}
