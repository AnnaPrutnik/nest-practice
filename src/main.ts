import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<string>('PORT') || 3000;
  const config = new DocumentBuilder()
    .setTitle('Nanny Hiring App API')
    .setDescription('Description...')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Bearer token',
    )
    .build();

  const option = {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  };

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, option);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () =>
    console.log(`Server is starting on PORT ${port}`),
  );
}
bootstrap();
