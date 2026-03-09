import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from '@my-website/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: env.NODE_ENV === 'production' ? 'https://mariocmesquita.com' : 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(env.SERVER_PORT, '0.0.0.0');
}
bootstrap();
