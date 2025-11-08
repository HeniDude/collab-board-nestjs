import { Controller, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { initCompanyDto } from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('init')
  async initCompany(dto: initCompanyDto, @CurrentUser() user: any) {
    return this.companyService.initCompany(dto, user);
  }
}
