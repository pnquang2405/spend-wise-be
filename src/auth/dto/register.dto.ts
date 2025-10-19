import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  name: string;

  @MinLength(6)
  password: string;
}
