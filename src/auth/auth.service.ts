import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const check = await this.db.query('SELECT id FROM users WHERE email = $1', [
      dto.email,
    ]);
    if (check.rowCount > 0) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const res = await this.db.query(
      `INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name, created_at`,
      [dto.email, dto.name, hashed],
    );

    return res.rows[0];
  }

  async login(dto: LoginDto) {
    const res = await this.db.query(
      'SELECT id, email, name, password FROM users WHERE email = $1',
      [dto.email],
    );
    if (res.rowCount === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = res.rows[0];
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    const { _password, ...userSafe } = user;
    return { token, user: userSafe };
  }

  async validateUser(userId: number) {
    const res = await this.db.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [userId],
    );
    return res.rowCount ? res.rows[0] : null;
  }
}
