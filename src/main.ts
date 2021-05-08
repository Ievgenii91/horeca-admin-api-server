import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SocketIoAdapter } from './events/socket-io.adapter';

const corsOrigins = [
  'http://localhost:3000',
  'https://horeca-admin.herokuapp.com',
  /vercel.app/,
];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useWebSocketAdapter(new SocketIoAdapter(app, corsOrigins));

  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'dist'));

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.use(helmet());

  //router

  await app.listen(process.env.PORT || 8080);

  //socket init
  //error
}
bootstrap();
