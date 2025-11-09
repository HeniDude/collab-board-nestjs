import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [forwardRef(() => QueueModule)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

