import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { MailProcessor } from './mail.processor';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST') || 'localhost',
          port: Number(config.get<number>('REDIS_PORT')) || 6379,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    forwardRef(() => MailModule),
  ],
  providers: [MailProcessor],
  exports: [BullModule],
})
export class QueueModule {}
