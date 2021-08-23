import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SocketIoAdapter } from './events/socket-io.adapter';
import * as S3Router from 'react-s3-uploader/s3router';

const corsOrigins = process.env.CORS_DOMAINS.split(',');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Horeca Project')
    .setDescription('Horeca Api definitions')
    .setVersion('1.0')
    .addTag('main')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useWebSocketAdapter(new SocketIoAdapter(app, corsOrigins));

  app.use(
    '/s3',
    S3Router({
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_BUCKET_REGION,
      ACL: 'public-read',
      uniquePrefix: true,
    }),
  );

  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'dist'));

  //router

  await app.listen(process.env.PORT || 8080);

  //socket init
  //error
}
bootstrap();
