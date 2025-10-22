import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { getCorsConfig } from 'src/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger(AppModule.name);

  app.enableCors(getCorsConfig(config));
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');

  try {
    await app.listen(port);

    logger.log('Server is running at: ', host);
  } catch (error) {
    logger.error('Failed to start server: ', error.message, error);
    process.exit(1);
  }
}

bootstrap();
