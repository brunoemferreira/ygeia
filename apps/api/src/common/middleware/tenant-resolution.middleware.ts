import { Injectable, NestMiddleware } from '@nestjs/common';
import { TenantContextService } from '../context/tenant-context.service';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class TenantResolutionMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly db: DatabaseService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    let tenantId = req.headers['x-tenant-id'] as string;

    // Se não veio no cabeçalho explícito, resolve através do Host header
    if (!tenantId) {
      const host = (req.headers.host || '').split(':')[0].toLowerCase();
      tenantId = await this.resolveTenantFromHost(host);
    }

    // Executa a requisição encapsulada no AsyncLocalStorage
    this.tenantContext.runWithContext({ tenantId }, () => {
      req.tenantId = tenantId;
      next();
    });
  }

  private async resolveTenantFromHost(host: string): Promise<string> {
    // 1. Procura em domínios customizados
    try {
      const domainResult = await this.db.query(
        'SELECT tenant_id FROM tenant_domains WHERE domain = $1 AND is_verified = true LIMIT 1',
        [host],
        true, // bypass RLS para resolução inicial
      );

      if (domainResult.rows.length > 0) {
        return domainResult.rows[0].tenant_id;
      }

      // 2. Procura por subdomínio: ex: "clinicasaude.ygeia.app"
      if (host.includes('.ygeia.app')) {
        const slug = host.replace('.ygeia.app', '');
        const tenantResult = await this.db.query(
          'SELECT id FROM tenants WHERE slug = $1 AND is_active = true LIMIT 1',
          [slug],
          true,
        );
        if (tenantResult.rows.length > 0) {
          return tenantResult.rows[0].id;
        }
      }
    } catch {
      // Caso ocorra erro ou durante boot inicial antes da migration
    }

    return '';
  }
}
