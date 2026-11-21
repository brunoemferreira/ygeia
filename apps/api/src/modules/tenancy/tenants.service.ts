import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import crypto from 'crypto';

export interface TenantBrandingResponse {
  tenantId: string;
  clinicName: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string | null;
  logoUrl: string | null;
  darkLogoUrl?: string | null;
  faviconUrl: string | null;
  fontFamily: string;
  letterheadTemplateUrl?: string | null;
}

export interface TenantSettingsResponse {
  tenantId: string;
  legalName: string | null;
  tradeName: string | null;
  taxId: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  addressStreet: string | null;
  addressNumber: string | null;
  addressComplement: string | null;
  addressNeighborhood: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZipCode: string | null;
  updatedAt: string;
}

export interface NutritionistProfileResponse {
  id: string;
  tenantId: string;
  userId: string;
  fullName: string;
  professionalName: string;
  crnNumber: string;
  crnRegion: string;
  specialties: string[];
  bio: string | null;
  avatarUrl: string | null;
  signatureStampUrl: string | null;
  isTechnicalManager: boolean;
}

export interface TeamMemberResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable()
export class TenantsService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  async getBranding(tenantId: string): Promise<TenantBrandingResponse> {
    if (!tenantId) {
      throw new NotFoundException('Identificador de tenant não informado ou não resolvido.');
    }

    const result = await this.db.query(
      `SELECT t.id as "tenantId", t.name as "clinicName", t.slug,
              COALESCE(b.primary_color, '#059669') as "primaryColor",
              COALESCE(b.secondary_color, '#064e3b') as "secondaryColor",
              b.accent_color as "accentColor",
              b.logo_url as "logoUrl",
              b.dark_logo_url as "darkLogoUrl",
              b.favicon_url as "faviconUrl",
              COALESCE(b.font_family, 'Plus Jakarta Sans') as "fontFamily",
              b.letterhead_template_url as "letterheadTemplateUrl"
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

  async updateBranding(tenantId: string, data: any): Promise<TenantBrandingResponse> {
    if (data.clinicName) {
      await this.db.query(
        'UPDATE tenants SET name = $1, updated_at = NOW() WHERE id = $2',
        [data.clinicName, tenantId],
      );
    }

    await this.db.query(
      `INSERT INTO tenant_branding (
         tenant_id, primary_color, secondary_color, accent_color,
         logo_url, dark_logo_url, favicon_url, font_family, letterhead_template_url
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (tenant_id) DO UPDATE SET
         primary_color = COALESCE($2, tenant_branding.primary_color),
         secondary_color = COALESCE($3, tenant_branding.secondary_color),
         accent_color = COALESCE($4, tenant_branding.accent_color),
         logo_url = COALESCE($5, tenant_branding.logo_url),
         dark_logo_url = COALESCE($6, tenant_branding.dark_logo_url),
         favicon_url = COALESCE($7, tenant_branding.favicon_url),
         font_family = COALESCE($8, tenant_branding.font_family),
         letterhead_template_url = COALESCE($9, tenant_branding.letterhead_template_url),
         updated_at = NOW()`,
      [
        tenantId,
        data.primaryColor || '#059669',
        data.secondaryColor || '#064e3b',
        data.accentColor || '#8b5cf6',
        data.logoUrl || null,
        data.darkLogoUrl || null,
        data.faviconUrl || null,
        data.fontFamily || 'Plus Jakarta Sans',
        data.letterheadTemplateUrl || null,
      ],
    );

    return await this.getBranding(tenantId);
  }

  async getSettings(tenantId: string): Promise<TenantSettingsResponse> {
    const res = await this.db.query(
      `SELECT tenant_id as "tenantId", legal_name as "legalName", trade_name as "tradeName",
              tax_id as "taxId", phone, whatsapp, email,
              address_street as "addressStreet", address_number as "addressNumber",
              address_complement as "addressComplement", address_neighborhood as "addressNeighborhood",
              address_city as "addressCity", address_state as "addressState",
              address_zip_code as "addressZipCode", updated_at as "updatedAt"
       FROM tenant_settings
       WHERE tenant_id = $1
       LIMIT 1`,
      [tenantId],
    );

    if (res.rows.length === 0) {
      const tenantRow = await this.db.query(
        'SELECT name FROM tenants WHERE id = $1 LIMIT 1',
        [tenantId],
        true,
      );
      const defaultName = tenantRow.rows[0]?.name || null;

      return {
        tenantId,
        legalName: defaultName,
        tradeName: defaultName,
        taxId: null,
        phone: null,
        whatsapp: null,
        email: null,
        addressStreet: null,
        addressNumber: null,
        addressComplement: null,
        addressNeighborhood: null,
        addressCity: null,
        addressState: null,
        addressZipCode: null,
        updatedAt: new Date().toISOString(),
      };
    }

    return res.rows[0];
  }

  async updateSettings(tenantId: string, data: any): Promise<TenantSettingsResponse> {
    await this.db.query(
      `INSERT INTO tenant_settings (
         tenant_id, legal_name, trade_name, tax_id, phone, whatsapp, email,
         address_street, address_number, address_complement, address_neighborhood,
         address_city, address_state, address_zip_code, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
       ON CONFLICT (tenant_id) DO UPDATE SET
         legal_name = EXCLUDED.legal_name,
         trade_name = EXCLUDED.trade_name,
         tax_id = EXCLUDED.tax_id,
         phone = EXCLUDED.phone,
         whatsapp = EXCLUDED.whatsapp,
         email = EXCLUDED.email,
         address_street = EXCLUDED.address_street,
         address_number = EXCLUDED.address_number,
         address_complement = EXCLUDED.address_complement,
         address_neighborhood = EXCLUDED.address_neighborhood,
         address_city = EXCLUDED.address_city,
         address_state = EXCLUDED.address_state,
         address_zip_code = EXCLUDED.address_zip_code,
         updated_at = NOW()`,
      [
        tenantId,
        data.legalName,
        data.tradeName,
        data.taxId,
        data.phone,
        data.whatsapp,
        data.email,
        data.addressStreet,
        data.addressNumber,
        data.addressComplement,
        data.addressNeighborhood,
        data.addressCity,
        data.addressState,
        data.addressZipCode,
      ],
    );

    return await this.getSettings(tenantId);
  }

  async getNutritionistProfile(tenantId: string, userId: string): Promise<NutritionistProfileResponse> {
    const res = await this.db.query(
      `SELECT id, tenant_id as "tenantId", user_id as "userId",
              full_name as "fullName", professional_name as "professionalName",
              crn_number as "crnNumber", crn_region as "crnRegion",
              specialties, bio, avatar_url as "avatarUrl",
              signature_stamp_url as "signatureStampUrl",
              is_technical_manager as "isTechnicalManager"
       FROM nutritionist_profiles
       WHERE tenant_id = $1 AND (user_id = $2 OR is_technical_manager = true)
       ORDER BY is_technical_manager DESC
       LIMIT 1`,
      [tenantId, userId],
    );

    if (res.rows.length === 0) {
      const userRes = await this.db.query(
        'SELECT full_name FROM users WHERE id = $1 LIMIT 1',
        [userId],
        true,
      );
      const defaultName = userRes.rows[0]?.full_name || '';

      return {
        id: '',
        tenantId,
        userId,
        fullName: defaultName,
        professionalName: defaultName,
        crnNumber: '',
        crnRegion: 'CRN-3',
        specialties: [],
        bio: null,
        avatarUrl: null,
        signatureStampUrl: null,
        isTechnicalManager: true,
      };
    }

    return res.rows[0];
  }

  async updateNutritionistProfile(
    tenantId: string,
    userId: string,
    data: any,
  ): Promise<NutritionistProfileResponse> {
    const res = await this.db.query(
      `INSERT INTO nutritionist_profiles (
         tenant_id, user_id, full_name, professional_name, crn_number, crn_region,
         specialties, bio, avatar_url, signature_stamp_url, is_technical_manager, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
       ON CONFLICT (tenant_id, user_id) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         professional_name = EXCLUDED.professional_name,
         crn_number = EXCLUDED.crn_number,
         crn_region = EXCLUDED.crn_region,
         specialties = EXCLUDED.specialties,
         bio = EXCLUDED.bio,
         avatar_url = EXCLUDED.avatar_url,
         signature_stamp_url = EXCLUDED.signature_stamp_url,
         is_technical_manager = EXCLUDED.is_technical_manager,
         updated_at = NOW()
       RETURNING id, tenant_id as "tenantId", user_id as "userId",
                 full_name as "fullName", professional_name as "professionalName",
                 crn_number as "crnNumber", crn_region as "crnRegion",
                 specialties, bio, avatar_url as "avatarUrl",
                 signature_stamp_url as "signatureStampUrl",
                 is_technical_manager as "isTechnicalManager"`,
      [
        tenantId,
        userId,
        data.fullName,
        data.professionalName,
        data.crnNumber,
        data.crnRegion,
        data.specialties || [],
        data.bio || null,
        data.avatarUrl || null,
        data.signatureStampUrl || null,
        data.isTechnicalManager ?? true,
      ],
    );

    return res.rows[0];
  }

  async getTeam(tenantId: string): Promise<TeamMemberResponse[]> {
    const res = await this.db.query(
      `SELECT id, email, full_name as "fullName", role, is_active as "isActive", created_at as "createdAt"
       FROM users
       WHERE tenant_id = $1
       ORDER BY created_at ASC`,
      [tenantId],
    );

    return res.rows;
  }

  async inviteTeamMember(tenantId: string, invitedByUserId: string, data: { email: string; role: string }) {
    const email = data.email.toLowerCase().trim();

    // Verifica se já é usuário
    const existingUser = await this.db.query(
      'SELECT id FROM users WHERE tenant_id = $1 AND email = $2 LIMIT 1',
      [tenantId, email],
    );
    if (existingUser.rows.length > 0) {
      throw new ConflictException('Este e-mail já pertence a um membro desta clínica.');
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 horas

    const res = await this.db.query(
      `INSERT INTO team_invitations (tenant_id, email, role, token_hash, expires_at, invited_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, role, expires_at as "expiresAt"`,
      [tenantId, email, data.role, tokenHash, expiresAt, invitedByUserId],
    );

    return {
      message: 'Convite criado com sucesso. Compartilhe o link de ativação com o membro da equipe.',
      invitation: res.rows[0],
      inviteLink: `/auth/accept-invite?token=${rawToken}`,
    };
  }
}
