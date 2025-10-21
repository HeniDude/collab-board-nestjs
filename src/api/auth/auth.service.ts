import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // async requestVerification(email: string, password: string) {
  //   const existing = await this.prisma.user.findUnique({ where: { email } });

  //   if (existing) {
  //     throw new BadRequestException('Email already exists');
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const code = this.gene
  // }
}
