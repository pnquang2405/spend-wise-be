import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return {
      code: 200,
      message: 'Register success',
      data: user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    const { token, ...rest } = result;

    res.cookie('token', token, {
      httpOnly: true,
      // secure: true, // bật khi deploy HTTPS
      sameSite: 'none', // nếu FE khác domain (VD: FE ở localhost:3000, BE ở 4000)
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return {
      code: 200,
      message: 'Login success',
      data: rest,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    // req.user set by Jwt guard
    return {
      code: 200,
      data: req.user,
    };
  }
}
