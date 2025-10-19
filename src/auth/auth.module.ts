import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbService } from '../db/db.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '3600s') as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, DbService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
