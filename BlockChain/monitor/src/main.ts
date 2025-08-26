import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors();
  const port = Number(config.get("PORT") ?? 6699);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`[monitor] listening on http://localhost:${port}`);
}
bootstrap();
