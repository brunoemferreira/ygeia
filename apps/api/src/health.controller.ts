import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

/**
 * Controller de Observabilidade e Health Checks do Ygeía.
 * Implementa liveness e readiness probes compatíveis com Kubernetes, Docker e Cloud Run.
 */
@Controller('health')
export class HealthController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  async check() {
    const dbStatus = await this.db.ping();
    return {
      status: dbStatus.healthy ? 'ok' : 'degraded',
      service: 'ygeia-api',
      version: '0.1.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      dependencies: {
        database: {
          status: dbStatus.healthy ? 'up' : 'down',
          latencyMs: dbStatus.latencyMs,
        },
      },
    };
  }

  @Get('live')
  live() {
    return { status: 'alive' };
  }

  @Get('ready')
  async ready() {
    const dbStatus = await this.db.ping();
    if (!dbStatus.healthy) {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        database: 'unreachable',
      });
    }
    return { status: 'ready', database: 'connected' };
  }
}
