import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    const testAccount = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    if (!this.transporter) await this.initTransporter();

    try {
      const info = await this.transporter.sendMail({
        from: '"CollabBoard" <noreply@collabboard.dev>',
        to,
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`,
      });
      console.log(`📨 Email preview: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Ошибка при отправке письма');
    }
  }
}
