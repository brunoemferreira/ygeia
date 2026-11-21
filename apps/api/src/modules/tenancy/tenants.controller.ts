import { Controller, Get, Query, Req } from '@nestjs/common';
import { TenantsService, TenantBrandingResponse } from './tenants.service';
import { TenantContextService } from '../../common/context/tenant-context.service';

@Controller('api/v1/tenants')
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Get('branding')
  async getBranding(
    @Query('slug') slug?: string,
    @Req() req?: any,
  ): Promise<TenantBrandingResponse> {
    if (slug) {
      return await this.tenantsService.getBrandingBySlug(slug);
    }

    const tenantId = this.tenantContext.getTenantId() || req?.tenantId;
    return await this.tenantsService.getBranding(tenantId);
  }
}
