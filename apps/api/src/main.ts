import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from '@my-website/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:
      env.NODE_ENV === 'production' ? 'https://mariocmesquita.com' : /^http:\/\/localhost:\d+$/,
    credentials: true,
  });
  app.setGlobalPrefix('api', { exclude: ['health'] });
  await app.listen(env.SERVER_PORT, '0.0.0.0');
}
bootstrap();
