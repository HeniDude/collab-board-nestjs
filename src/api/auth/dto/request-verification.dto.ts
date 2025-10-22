import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RequestVerificationDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
