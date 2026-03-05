import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ensureEnvLoaded } from './config/env';

ensureEnvLoaded();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Enable CORS for frontend
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
