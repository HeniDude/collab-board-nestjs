import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { initCompanyDto } from './dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async initCompany(dto: initCompanyDto, user) {
    console.log('init company');
  }
}
