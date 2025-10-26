import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SqlLoaderService implements OnModuleInit {
  private readonly logger = new Logger(SqlLoaderService.name);
  private readonly sqlCache = new Map<string, string>();
  private readonly baseDir: string;

  constructor() {
    // ✅ Tự động chọn thư mục SQL đúng môi trường (dev hoặc build)
    const devPath = path.join(process.cwd(), 'src', 'db', 'sql');
    const prodPath = path.join(process.cwd(), 'dist', 'db', 'sql');
    this.baseDir = fs.existsSync(prodPath) ? prodPath : devPath;
  }

  onModuleInit() {
    this.preloadAllSqlFiles();
  }

  /**
   * 🔥 Load tất cả file .sql trong thư mục /db/sql và cache vào memory
   */
  private preloadAllSqlFiles() {
    if (!fs.existsSync(this.baseDir)) {
      this.logger.warn(`⚠️ SQL directory not found: ${this.baseDir}`);
      return;
    }

    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.sql')) {
          const key = path
            .relative(this.baseDir, fullPath)
            .replace(/\.sql$/, '');
          const sql = fs.readFileSync(fullPath, 'utf8');
          this.sqlCache.set(key, sql);
          this.logger.debug(`🗂️ Loaded SQL: ${key}`);
        }
      }
    };

    walk(this.baseDir);
    this.logger.log(
      `✅ Preloaded ${this.sqlCache.size} SQL file(s) from ${this.baseDir}`,
    );
  }

  /**
   * 🔎 Lấy nội dung SQL từ cache
   */
  loadSql(relativePath: string): string {
    const normalizedKey = relativePath.replace(/^\/|\/$/g, '');
    const sql = this.sqlCache.get(normalizedKey);
    if (!sql) {
      throw new Error(`❌ SQL not found in cache: ${normalizedKey}`);
    }
    return sql;
  }
}
