import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { InitCompanyDto } from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('init')
  @HttpCode(HttpStatus.CREATED)
  async initCompany(@Body() dto: InitCompanyDto, @CurrentUser() user: any) {
    return this.companyService.initCompany(dto, user);
  }
}
