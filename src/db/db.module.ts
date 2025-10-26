import { Module, Global } from '@nestjs/common';
import { DbService } from './db.service';
import { SqlLoaderService } from './sql-loader-service';

@Global()
@Module({
  providers: [DbService, SqlLoaderService],
  exports: [DbService, SqlLoaderService],
})
export class DbModule {}
