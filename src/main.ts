import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Exhibits')
    .setDescription('The Exhibits API description')
    .setVersion('1.0')
    .addTag('Exhibits')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('api', {
    exclude: ['users', 'users/register', 'users/my-profile'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
