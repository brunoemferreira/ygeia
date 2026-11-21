import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import {
  TenantsService,
  TenantBrandingResponse,
  TenantSettingsResponse,
  NutritionistProfileResponse,
  TeamMemberResponse,
} from './tenants.service';
import { TenantContextService } from '../../common/context/tenant-context.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  updateTenantSettingsSchema,
  updateNutritionistProfileSchema,
  updateTenantBrandingSchema,
  inviteTeamMemberSchema,
} from '@ygeia/validation-schemas';

@Controller('api/v1/tenants')
export class TenantsController {
  constructor(
    @Inject(TenantsService) private readonly tenantsService: TenantsService,
    @Inject(TenantContextService) private readonly tenantContext: TenantContextService,
  ) {}

  @Get('branding')
  async getBranding(
    @Query('slug') slug?: string,
    @Req() req?: any,
  ): Promise<TenantBrandingResponse> {
    if (slug) {
      return await this.tenantsService.getBrandingBySlug(slug);
    }

    const tenantId = this.tenantContext.getTenantId() || req?.tenantId || req?.user?.tenantId;
    if (tenantId) {
      return await this.tenantsService.getBranding(tenantId);
    }

    // Se nenhum tenant foi especificado, retorna o tenant de demonstração padrão
    return await this.tenantsService.getBrandingBySlug('demo-clinica');
  }

  @Put('branding')
  @UseGuards(JwtAuthGuard)
  async updateBranding(@Body() body: any, @Req() req: any): Promise<TenantBrandingResponse> {
    const tenantId = req.user.tenantId;
    const validated = updateTenantBrandingSchema.parse(body);
    return await this.tenantsService.updateBranding(tenantId, validated);
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  async getSettings(@Req() req: any): Promise<TenantSettingsResponse> {
    const tenantId = req.user.tenantId;
    return await this.tenantsService.getSettings(tenantId);
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard)
  async updateSettings(@Body() body: any, @Req() req: any): Promise<TenantSettingsResponse> {
    const tenantId = req.user.tenantId;
    const validated = updateTenantSettingsSchema.parse(body);
    return await this.tenantsService.updateSettings(tenantId, validated);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getNutritionistProfile(@Req() req: any): Promise<NutritionistProfileResponse> {
    const tenantId = req.user.tenantId;
    const userId = req.user.sub;
    return await this.tenantsService.getNutritionistProfile(tenantId, userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateNutritionistProfile(
    @Body() body: any,
    @Req() req: any,
  ): Promise<NutritionistProfileResponse> {
    const tenantId = req.user.tenantId;
    const userId = req.user.sub;
    const validated = updateNutritionistProfileSchema.parse(body);
    return await this.tenantsService.updateNutritionistProfile(tenantId, userId, validated);
  }

  @Get('team')
  @UseGuards(JwtAuthGuard)
  async getTeam(@Req() req: any): Promise<TeamMemberResponse[]> {
    const tenantId = req.user.tenantId;
    return await this.tenantsService.getTeam(tenantId);
  }

  @Post('team/invite')
  @UseGuards(JwtAuthGuard)
  async inviteTeamMember(@Body() body: any, @Req() req: any) {
    if (req.user.role !== 'CLINIC_OWNER' && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas proprietários e administradores podem convidar membros.');
    }
    const tenantId = req.user.tenantId;
    const userId = req.user.sub;
    const validated = inviteTeamMemberSchema.parse(body);
    return await this.tenantsService.inviteTeamMember(tenantId, userId, validated);
  }
}
