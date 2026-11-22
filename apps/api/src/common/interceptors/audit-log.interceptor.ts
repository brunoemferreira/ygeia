import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatabaseService } from '../../database/database.service';
import { TenantContextService } from '../context/tenant-context.service';

/**
 * Interceptor de Auditoria LGPD e Tutela da Saúde.
 * Registra de forma assíncrona todas as operações em dados de pacientes e configurações
 * na tabela `audit_logs`, garantindo rastreabilidade legal sem degradar a latência da API.
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
    @Inject(TenantContextService) private readonly tenantContext: TenantContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logAuditEvent(req, startTime).catch((err) => {
            this.logger.warn(`Falha não bloqueante ao registrar log de auditoria: ${err.message}`);
          });
        },
      }),
    );
  }

  private async logAuditEvent(req: any, _startTime: number): Promise<void> {
    const url = req.url || '';

    // Ignora rotas de integridade técnica e arquivos estáticos
    if (url.startsWith('/health') || url.startsWith('/favicon.ico')) {
      return;
    }

    const tenantId = req.user?.tenantId || this.tenantContext.getTenantId();
    if (!tenantId) {
      return; // Ações sem tenant resolvido não pertencem a dados clínicos isolados
    }

    const userId = req.user?.sub || req.user?.id || null;
    const method = (req.method || 'GET').toUpperCase();

    // Mapeamento semântico de ação
    let action = 'READ';
    if (method === 'POST') action = 'CREATE';
    else if (method === 'PUT' || method === 'PATCH') action = 'UPDATE';
    else if (method === 'DELETE') action = 'DELETE';

    // Determina o recurso com base no path
    const urlParts = url.split('?')[0].split('/').filter(Boolean);
    const resource = urlParts[0] || 'general';
    const resourceId = req.params?.id || req.params?.patientId || urlParts[1] || null;

    const rawIp = req.ip || req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const ipAddress = typeof rawIp === 'string' ? rawIp.split(',')[0].trim().slice(0, 45) : null;
    const userAgent = req.headers?.['user-agent']
      ? String(req.headers['user-agent']).slice(0, 500)
      : null;

    await this.databaseService.query(
      `
      INSERT INTO audit_logs (tenant_id, user_id, action, resource, resource_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [tenantId, userId, action, resource, resourceId, ipAddress, userAgent],
      true, // bypassRls para o insert do log de auditoria do tenant
    );
  }
}
