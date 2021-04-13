import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as helmet from 'helmet';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.use(
    session({
      secret: '0712asdas3',
      cookie: {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
      },
      resave: false,
      saveUninitialized: true,
    }),
  );

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
