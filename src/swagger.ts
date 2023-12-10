import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import {
  GLOBAL_ROOT_PREFIX,
  SWAGGER_DESCRIPTION,
  SWAGGER_TITLE,
} from './shared/constants/config.constant';

export async function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(
    path.join(GLOBAL_ROOT_PREFIX, 'documentation'),
    app,
    document,
    {
      swaggerOptions: {
        showCommonExtensions: true,
        showExtensions: true,
      },
    },
  );
}
