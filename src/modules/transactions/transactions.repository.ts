import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { SqlLoaderService } from '@/db/sql-loader-service';
import { DbService } from '@/db/db.service';

@Injectable()
export class TransactionsRepository {
  constructor(
    private readonly db: DbService,
    private readonly sqlLoader: SqlLoaderService,
  ) {}

  async create(dto: CreateTransactionDto) {
    const sql = this.sqlLoader.loadSql('transactions/create');
    const params = [
      dto.user_id,
      dto.category_id ?? null,
      dto.amount,
      dto.type,
      dto.description ?? null,
      dto.transaction_date ?? null,
      dto.meta ? JSON.stringify(dto.meta) : '{}',
    ];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  async findAllByUser(userId: number) {
    const sql = this.sqlLoader.loadSql('transactions/find-all');
    const result = await this.db.query(sql, [userId]);
    return result.rows;
  }
}
