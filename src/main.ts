import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = generateDocument(app);
  app.enableCors();
  await app.listen(8000);
}
bootstrap();
