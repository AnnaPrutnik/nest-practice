import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Nanny Hiring App API')
    .setDescription('Description...')
    .setVersion('1.0')
    .build();

  const option = {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  };

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, option);

  app.useGlobalPipes(new ValidationPipe());
  app.use(logger);

  await app.listen(port, () =>
    console.log(`Server is starting on PORT ${port}`),
  );
}
bootstrap();
