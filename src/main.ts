import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if configured
  if (process.env.CORS_ENABLED === 'true') {
    app.enableCors();
  }

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'Jasper Reports API')
    .setDescription(process.env.SWAGGER_DESCRIPTION || 'API for managing and generating Jasper Reports')
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addTag('reports')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api', app, document);

  const port = process.env.PORT || 3000;
  const swaggerPath = process.env.SWAGGER_PATH || 'api';
  
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/${swaggerPath}`);
}

bootstrap();