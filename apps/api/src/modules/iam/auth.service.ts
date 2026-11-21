import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PasswordHasherService } from '../../common/security/password-hasher.service';
import { TokenService, GeneratedTokens } from '../../common/security/token.service';

export interface RegisterClinicInput {
  clinicName: string;
  slug: string;
  ownerName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  tenantId?: string;
  slug?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    tenantId: string;
  };
  tokens: GeneratedTokens;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenService: TokenService,
  ) {}

  async registerClinic(input: RegisterClinicInput): Promise<AuthResponse> {
    const slug = input.slug.toLowerCase().trim();
    const email = input.email.toLowerCase().trim();

    // 1. Verifica duplicidade de slug
    const existingTenant = await this.db.query(
      'SELECT id FROM tenants WHERE slug = $1 LIMIT 1',
      [slug],
      true,
    );
    if (existingTenant.rows.length > 0) {
      throw new ConflictException(`O identificador (slug) '${slug}' já está em uso.`);
    }

    // 2. Hash seguro da senha com Argon2id
    const passwordHash = await this.passwordHasher.hash(input.password);

    // 3. Criação transacional do Tenant + Branding + Usuário Dono da Clínica
    return await this.db.transaction(async (client) => {
      // Cria Tenant
      const tenantRes = await client.query(
        `INSERT INTO tenants (name, slug, plan)
         VALUES ($1, $2, 'STARTER')
         RETURNING id`,
        [input.clinicName, slug],
      );
      const tenantId = tenantRes.rows[0].id;

      // Cria Branding inicial
      await client.query(
        `INSERT INTO tenant_branding (tenant_id, primary_color, secondary_color)
         VALUES ($1, '#059669', '#064e3b')`,
        [tenantId],
      );

      // Cria Usuário Dono da Clínica (CLINIC_OWNER)
      const userRes = await client.query(
        `INSERT INTO users (tenant_id, email, password_hash, full_name, role)
         VALUES ($1, $2, $3, $4, 'CLINIC_OWNER')
         RETURNING id, email, full_name as "fullName", role`,
        [tenantId, email, passwordHash, input.ownerName],
      );
      const user = userRes.rows[0];

      // Gera Tokens JWT + Refresh Token
      const tokens = this.tokenService.generateTokens({
        sub: user.id,
        tenantId,
        role: user.role,
        email: user.email,
      });

      // Salva hash do Refresh Token no banco com family_id para detecção de reuso
      const tokenHash = this.tokenService.hashRefreshToken(tokens.refreshToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

      await client.query(
        `INSERT INTO refresh_tokens (user_id, tenant_id, token_hash, family_id, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, tenantId, tokenHash, tokens.familyId, expiresAt],
      );

      // Audit Log
      await client.query(
        `INSERT INTO audit_logs (tenant_id, user_id, action, resource, resource_id)
         VALUES ($1, $2, 'REGISTER_CLINIC', 'tenant', $3)`,
        [tenantId, user.id, tenantId],
      );

      return {
        user: { ...user, tenantId },
        tokens,
      };
    }, true);
  }

  async login(input: LoginInput, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const email = input.email.toLowerCase().trim();
    let tenantId = input.tenantId;

    // Se informou slug, busca o tenantId correspondente
    if (!tenantId && input.slug) {
      const tenantRes = await this.db.query(
        'SELECT id FROM tenants WHERE slug = $1 AND is_active = true LIMIT 1',
        [input.slug.toLowerCase().trim()],
        true,
      );
      if (tenantRes.rows.length === 0) {
        throw new NotFoundException(`Clínica não encontrada.`);
      }
      tenantId = tenantRes.rows[0].id;
    }

    if (!tenantId) {
      throw new BadRequestException('Identificador ou slug da clínica é obrigatório para autenticação.');
    }

    // Busca o usuário dentro do tenant específico
    const userRes = await this.db.query(
      `SELECT id, email, password_hash as "passwordHash", full_name as "fullName", role, is_active as "isActive"
       FROM users
       WHERE tenant_id = $1 AND email = $2
       LIMIT 1`,
      [tenantId, email],
      true, // bypass rls para validar login
    );

    if (userRes.rows.length === 0) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const user = userRes.rows[0];
    if (!user.isActive) {
      throw new UnauthorizedException('Esta conta está inativa.');
    }

    // Validação de senha com Argon2id
    const isPasswordValid = await this.passwordHasher.verify(user.passwordHash, input.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Gera Tokens
    const tokens = this.tokenService.generateTokens({
      sub: user.id,
      tenantId,
      role: user.role,
      email: user.email,
    });

    const tokenHash = this.tokenService.hashRefreshToken(tokens.refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.db.query(
      `INSERT INTO refresh_tokens (user_id, tenant_id, token_hash, family_id, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, tenantId, tokenHash, tokens.familyId, expiresAt],
      true,
    );

    // Grava log de auditoria
    await this.db.query(
      `INSERT INTO audit_logs (tenant_id, user_id, action, resource, ip_address, user_agent)
       VALUES ($1, $2, 'LOGIN', 'auth', $3, $4)`,
      [tenantId, user.id, ipAddress, userAgent],
      true,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId,
      },
      tokens,
    };
  }

  async refreshToken(rawRefreshToken: string): Promise<GeneratedTokens> {
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token não informado.');
    }

    const tokenHash = this.tokenService.hashRefreshToken(rawRefreshToken);

    const tokenRecord = await this.db.query(
      `SELECT id, user_id as "userId", tenant_id as "tenantId", family_id as "familyId",
              expires_at as "expiresAt", revoked_at as "revokedAt"
       FROM refresh_tokens
       WHERE token_hash = $1
       LIMIT 1`,
      [tokenHash],
      true,
    );

    if (tokenRecord.rows.length === 0) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    const record = tokenRecord.rows[0];

    // DETECÇÃO DE REUSO DE REFRESH TOKEN (Se o token já foi revogado, há roubo de sessão)
    if (record.revokedAt !== null) {
      // Invalida toda a família de tokens do usuário imediatamente
      await this.db.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE family_id = $1',
        [record.familyId],
        true,
      );
      throw new UnauthorizedException('Possível tentativa de sequestro de sessão detectada. Faça login novamente.');
    }

    // Verifica se expirou
    if (new Date() > new Date(record.expiresAt)) {
      throw new UnauthorizedException('Refresh token expirado.');
    }

    // Busca o usuário para reemitir os dados
    const userRes = await this.db.query(
      'SELECT id, email, role FROM users WHERE id = $1 AND tenant_id = $2 LIMIT 1',
      [record.userId, record.tenantId],
      true,
    );

    if (userRes.rows.length === 0) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const user = userRes.rows[0];

    // Rotação: Revoga o token atual e gera um novo na mesma família
    return await this.db.transaction(async (client) => {
      await client.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1', [record.id]);

      const newTokens = this.tokenService.generateTokens(
        {
          sub: user.id,
          tenantId: record.tenantId,
          role: user.role,
          email: user.email,
        },
        record.familyId,
      );

      const newTokenHash = this.tokenService.hashRefreshToken(newTokens.refreshToken);
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await client.query(
        `INSERT INTO refresh_tokens (user_id, tenant_id, token_hash, family_id, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, record.tenantId, newTokenHash, record.familyId, newExpiresAt],
      );

      return newTokens;
    }, true);
  }

  async getCurrentUser(userId: string, tenantId: string) {
    const res = await this.db.query(
      `SELECT u.id, u.email, u.full_name as "fullName", u.role, u.tenant_id as "tenantId",
              t.name as "clinicName", t.slug
       FROM users u
       JOIN tenants t ON t.id = u.tenant_id
       WHERE u.id = $1 AND u.tenant_id = $2
       LIMIT 1`,
      [userId, tenantId],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return res.rows[0];
  }
}
