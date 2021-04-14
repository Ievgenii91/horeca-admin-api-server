import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useWebSocketAdapter(new IoAdapter(app));

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'dist'));

  app.enableCors();

  app.use(helmet());

  //router

  await app.listen(process.env.PORT || 8080);

  //socket init
  //error
}
bootstrap();
