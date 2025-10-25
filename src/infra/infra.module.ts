import { Module, Global } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from './jwt/jwt.module';
import { MailService } from './mail/mail.service';
import { CodeGeneratorService } from './utils/code-generator.service';

@Global()
@Module({
  imports: [PrismaModule, JwtModule],
  providers: [MailService, CodeGeneratorService],
  exports: [MailService, CodeGeneratorService, JwtModule],
})
export class InfraModule {}
