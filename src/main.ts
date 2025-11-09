import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { getCorsConfig } from 'src/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger(AppModule.name);

  app.enableCors(getCorsConfig(config));
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.get<string>('HTTP_HOST') || '0.0.0.0';

  try {
    await app.listen(port, host);

    logger.log(`Server is running on http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
  } catch (error) {
    logger.error('Failed to start server: ', error.message, error);
    process.exit(1);
  }
}

bootstrap();
