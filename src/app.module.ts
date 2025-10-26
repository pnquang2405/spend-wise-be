import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionsModule,
  ],
})
export class AppModule {}
