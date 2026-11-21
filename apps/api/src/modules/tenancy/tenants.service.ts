import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface TenantBrandingResponse {
  tenantId: string;
  clinicName: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  fontFamily: string;
}

@Injectable()
export class TenantsService {
  constructor(private readonly db: DatabaseService) {}

  async getBranding(tenantId: string): Promise<TenantBrandingResponse> {
    if (!tenantId) {
      throw new NotFoundException('Identificador de tenant não informado ou não resolvido.');
    }

    const result = await this.db.query(
      `SELECT t.id as "tenantId", t.name as "clinicName", t.slug,
              COALESCE(b.primary_color, '#059669') as "primaryColor",
              COALESCE(b.secondary_color, '#064e3b') as "secondaryColor",
              b.logo_url as "logoUrl",
              b.favicon_url as "faviconUrl",
              COALESCE(b.font_family, 'Inter') as "fontFamily"
       FROM tenants t
       LEFT JOIN tenant_branding b ON b.tenant_id = t.id
       WHERE t.id = $1 AND t.is_active = true
       LIMIT 1`,
      [tenantId],
      true, // Branding é público para renderização do layout
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Clínica ou tenant não encontrado.');
    }

    return result.rows[0];
  }

  async getBrandingBySlug(slug: string): Promise<TenantBrandingResponse> {
    const tenant = await this.db.query(
      'SELECT id FROM tenants WHERE slug = $1 AND is_active = true LIMIT 1',
      [slug],
      true,
    );

    if (tenant.rows.length === 0) {
      throw new NotFoundException(`Clínica '${slug}' não encontrada.`);
    }

    return await this.getBranding(tenant.rows[0].id);
  }
}
