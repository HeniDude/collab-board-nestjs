import { Module, Global } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { CodeGeneratorService } from './utils/code-generator.service';
import { QueueModule } from './queue/queue.module';

@Global()
@Module({
  imports: [PrismaModule, JwtModule, QueueModule, MailModule],
  providers: [CodeGeneratorService],
  exports: [MailModule, CodeGeneratorService, JwtModule],
})
export class InfraModule {}
