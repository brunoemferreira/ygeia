import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import { Controller, Get } from '@nestjs/common';
import { AppModule } from './app.module';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'ygeia-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    };
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // Registro de Plugins Fastify
  await app.register(fastifyCookie as any, {
    secret: process.env.COOKIE_SECRET || 'cookie_secret_ygeia_dev_123456',
  });

  await app.register(fastifyHelmet as any, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
  });

  // Dynamic CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Em dev ou requisições mobile/sem origin direta, autoriza
      if (!origin || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      // Em produção, valida se termina com o domínio base ou domínio configurado
      if (origin.endsWith('.ygeia.app') || origin === 'https://ygeia.app') {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  });

  const port = process.env.PORT || 3333;
  await app.listen(port, '0.0.0.0');
  console.log(`[YGEÍA API] Servidor em execução na porta ${port}`);
}

bootstrap().catch((err) => {
  console.error('[YGEÍA API] Erro ao iniciar:', err);
  process.exit(1);
});
