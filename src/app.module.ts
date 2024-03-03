import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './service/contact/contact.module';

@Module({
  imports: [ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
