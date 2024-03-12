import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../../config/database.module';
import { CompanyService } from './company.service';
import { CompanyProviders } from './company.providers';
import CompanyController from './company.controller';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => ContactModule)],
  providers: [
    ...CompanyProviders,
    CompanyService,
  ],
  controllers: [CompanyController],
  exports: [CompanyService]
})
export class CompanyModule {}