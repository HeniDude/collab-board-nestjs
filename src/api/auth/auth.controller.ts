import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestVerificationDto } from './dto/request-verification.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-verification')
  async requestVerification(@Body() dto: RequestVerificationDto) {
    return this.authService.requestVerification(dto.email, dto.password);
  }

  @Post('verify')
  async verify(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyEmail(dto.email, dto.code);
  }
}
