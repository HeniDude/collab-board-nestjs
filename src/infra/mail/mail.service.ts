import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private async initTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    if (!this.transporter) await this.initTransporter();

    try {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'infra',
        'mail',
        'templates',
        'verification.hbs',
      );
      const source = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(source);
      const html = template({ code });

      const info = await this.transporter.sendMail({
        from: `"CollabBoard" <${this.configService.get('SMTP_USER')}>`,
        to,
        subject: 'Verification Code',
        html,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Ошибка при отправке письма');
    }
  }

  async sendWelcomLetterAfterVerification(to: string) {
    if (!this.transporter) await this.initTransporter();

    try {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'infra',
        'mail',
        'templates',
        'welcomeAfterVerification.hbs',
      );

      const source = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(source);
      const html = template({});

      await this.transporter.sendMail({
        from: `"CollabBoard" <${this.configService.get('SMTP_USER')}>`,
        to,
        subject: 'Добро пожаловать в CollabBoard 🎉',
        html,
      });
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw new InternalServerErrorException('Ошибка при отправке письма приветствия');
    }
  }
}
