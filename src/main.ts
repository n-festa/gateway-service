import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_PORT } from './shared/constants/config.constant';
import { setupSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import { validationErrorParser } from './shared/exceptions/validation-error.parser';
import { ValidatePayloadExistsPipe } from './shared/pipe-transform/validate-payload-exist.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      validationError: {
        target: true,
        value: true,
      },
      exceptionFactory: validationErrorParser,
    }),
    new ValidatePayloadExistsPipe(),
  );

  await setupSwagger(app);

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://www.2all.com.vn',
      'https://2all.com.vn',
      'http://13.214.73.95',
    ],
    credentials: true,
  });

  console.log(`---- APP PORT ${configService.get<number>('appPort')}`);
  await app.listen(configService.get<number>('appPort') || DEFAULT_PORT);
}
bootstrap();
