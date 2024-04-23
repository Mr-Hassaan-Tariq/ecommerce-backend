import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

import * as dotenv from 'dotenv';
import * as express from 'express';
import path from 'path';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  app.setGlobalPrefix('/api/v1');
  app.use(json());
  await app.listen(5200);
}
bootstrap();

