import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL not set in env');
    }
    this.pool = new Pool({ connectionString });
  }

  async onModuleInit() {
    await this.pool.connect().then((c) => c.release());
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query<T = any>(text: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      const res = await client.query<T>(text, params);
      return res;
    } finally {
      client.release();
    }
  }
}
