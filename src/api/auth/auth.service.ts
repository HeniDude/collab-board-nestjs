import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/infra/mail/mail.service';
import { CodeGeneratorService } from 'src/infra/utils/code-generator.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private codeGeneratorService: CodeGeneratorService,
  ) {}

  async requestVerification(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = this.codeGeneratorService.generate();
    const expiresAt = this.codeGeneratorService.calcExpiresAtCode();

    await this.prisma.emailVerification.create({
      data: {
        email,
        code,
        passwordHash: hashedPassword,
        expiresAt,
      },
    });

    await this.mailService.sendVerificationEmail(email, code);

    return {
      message: 'Verification code sent on mail successfully',
    };
  }

  async verifyEmail(email: string, code: string) {
    const record = await this.prisma.emailVerification.findFirst({
      where: { email, code, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw new BadRequestException('Invalid or used code');
    if (record.expiresAt < new Date()) throw new BadRequestException('Verification code expired');

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new BadRequestException('Email already veriied and registered');

    const user = await this.prisma.user.create({
      data: { email, password: record.passwordHash, isVerified: true },
    });

    await this.prisma.emailVerification.update({
      where: { id: record.id },
      data: { used: true, userId: user.id },
    });
  }
}
