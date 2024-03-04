import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database.module';
import { CompanyService } from './company.service';
import { CompanyProviders } from './company.providers';
import CompanyController from '../contact/company.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...CompanyProviders,
    CompanyService,
  ],
  controllers: [CompanyController],
  exports: [CompanyService]
})
export class CompanyModule {}