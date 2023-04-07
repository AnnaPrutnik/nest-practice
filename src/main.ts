import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger/logger.middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Nanny Hiring App API')
    .setDescription('Description...')
    .setVersion('1.0')
    .addTag('nannies')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(logger);

  await app.listen(port, () =>
    console.log(`Server is starting on PORT ${port}`),
  );
}
bootstrap();
