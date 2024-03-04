import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database.module';
import { ContactProviders } from './contact.providers';
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';
import { ContactsController } from './contact.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [DatabaseModule, CompanyModule],
  providers: [
    ...ContactProviders,
    ContactService,
  ],
  controllers: [ContactsController]
})
export class ContactModule {}