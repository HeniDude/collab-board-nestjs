import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../mail/mail.service';
import { Logger } from '@nestjs/common';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`📬 Обработка задачи "${job.name}" для ${job.data.to}`);

    switch (job.name) {
      case 'sendVerificationEmail':
        await this.mailService.directSendVerificationEmail(job.data.to, job.data.code);
        break;

      case 'sendWelcomeEmail':
        await this.mailService.directSendWelcomeLetter(job.data.to);
        break;

      default:
        this.logger.warn(`⚠️ Неизвестная задача: ${job.name}`);
        break;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`✅ Задача ${job.name} успешно выполнена`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: any) {
    this.logger.error(`❌ Ошибка в задаче ${job.name}: ${err.message}`);
  }
}
