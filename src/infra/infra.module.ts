import { Module, Global } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MailService } from './mail/mail.service';
import { CodeGeneratorService } from './utils/code-generator.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [MailService, CodeGeneratorService],
  exports: [MailService, CodeGeneratorService],
})
export class InfraModule {}
