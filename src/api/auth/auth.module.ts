import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { JwtModule } from 'src/infra/jwt/jwt.module';
import { MailService } from 'src/infra/mail/mail.service';
import { CodeGeneratorService } from 'src/infra/utils/code-generator.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, MailService, CodeGeneratorService, JwtStrategy],
})
export class AuthModule {}
