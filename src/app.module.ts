import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './service/contact/contact.module';
import { CompanyModule } from './service/company/company.module';

@Module({
  imports: [ContactModule, CompanyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
