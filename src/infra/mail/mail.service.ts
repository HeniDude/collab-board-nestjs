import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('mail-queue') private readonly mailQueue: Queue,
  ) {
    this.initTransporter();
  }

  private async initTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'false',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    await this.mailQueue.add('sendVerificationEmail', { to, code });
    this.logger.log(`📨 Добавлена задача на отправку письма ${to}`);
  }

  async sendWelcomeLetterAfterVerification(to: string) {
    await this.mailQueue.add('sendWelcomeEmail', { to });
    this.logger.log(`🎉 Добавлена задача на welcome письмо ${to}`);
  }

  private getTemplatePath(templateName: string): string {
    const distPath = path.join(process.cwd(), 'dist', 'infra', 'mail', 'templates', templateName);
    const srcPath = path.join(process.cwd(), 'src', 'infra', 'mail', 'templates', templateName);
    if (fs.existsSync(distPath)) {
      return distPath;
    }
    if (fs.existsSync(srcPath)) {
      return srcPath;
    }

    throw new Error(`Template ${templateName} not found in dist or src`);
  }

  async directSendVerificationEmail(to: string, code: string) {
    if (!this.transporter) await this.initTransporter();

    const templatePath = this.getTemplatePath('verification.hbs');
    const html = handlebars.compile(fs.readFileSync(templatePath, 'utf8'))({ code });

    await this.transporter.sendMail({
      from: `"CollabBoard" <${this.configService.get('SMTP_USER')}>`,
      to,
      subject: 'Verification Code',
      html,
    });
  }

  async directSendWelcomeLetter(to: string) {
    if (!this.transporter) await this.initTransporter();

    const templatePath = this.getTemplatePath('welcomeAfterVerification.hbs');
    const html = handlebars.compile(fs.readFileSync(templatePath, 'utf8'))({});

    await this.transporter.sendMail({
      from: `"CollabBoard" <${this.configService.get('SMTP_USER')}>`,
      to,
      subject: 'Добро пожаловать в CollabBoard 🎉',
      html,
    });
  }
}
