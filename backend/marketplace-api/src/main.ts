import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { loadEnvForPrisma } from './load-env-for-prisma';

loadEnvForPrisma();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('KisaanMela Marketplace API')
    .setDescription(
      'KisaanMela multi-vendor agriculture marketplace — Next.js + Tailwind (UI), NestJS, PostgreSQL/Prisma, JWT + mobile OTP, AWS S3 presigned uploads, Razorpay. Next.js hub: /marketplace/kisaan',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.PORT || '4000', 10);
  await app.listen(port);
  console.log(
    `API http://localhost:${port}/api  Swagger http://localhost:${port}/docs`,
  );
}
bootstrap();
