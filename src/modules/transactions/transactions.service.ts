import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsRepository } from './transactions.repository';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly repo: TransactionsRepository,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async createTransaction(
    dto: CreateTransactionDto,
    imageFile?: Express.Multer.File,
  ) {
    let meta = dto.meta || {};

    console.log('imageFile', imageFile);

    if (imageFile) {
      try {
        const url = await this.cloudinary.uploadImage(imageFile);
        console.log('Uploaded URL:', url);
        meta = { ...meta, receipt_url: url };
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
    return this.repo.create({
      ...dto,
      meta,
    });
  }
}
