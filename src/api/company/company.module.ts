import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [],
  controllers: [CompanyController],
  providers: [PrismaService, CompanyService],
})
export class CompanyModule {}
