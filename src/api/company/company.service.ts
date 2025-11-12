import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { InitCompanyDto } from './dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async initCompany(dto: InitCompanyDto, user) {
    const existingCompany = await this.prisma.company.findFirst({
      where: { name: dto.name },
    });

    if (existingCompany) {
      throw new BadRequestException('Company name already exists');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.name,
        },
      });

      await tx.membership.create({
        data: {
          companyId: company.id,
          userId: user.id,
          role: 'OWNER',
        },
      });

      return company;
    });

    return {
      message: 'Company successfully created',
      company: {
        id: result.id,
        name: result.name,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  }
}
