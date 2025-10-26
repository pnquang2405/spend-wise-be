import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { DbModule } from '@/db/db.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [DbModule, CloudinaryModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
