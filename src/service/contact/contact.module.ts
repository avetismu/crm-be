import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../../config/database.module';
import { ContactProviders } from './contact.providers';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';
import { ContactsController } from './contact.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => CompanyModule)],
  providers: [
    ...ContactProviders,
    ContactService,
  ],
  controllers: [ContactsController],
  exports: [ContactService]
})
export class ContactModule {}