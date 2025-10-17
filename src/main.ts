import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpErrorFilter());

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Listening on port ${process.env.PORT || 3000}`);
}
bootstrap();
