import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface TokenPayload {
  sub: string;
  tenantId: string;
  role: string;
  email: string;
  jti?: string;
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
  familyId: string;
  expiresInSeconds: number;
}

@Injectable()
export class TokenService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_ygeia_dev_123456';
  private readonly accessTokenExpirySeconds = 15 * 60; // 15 minutos

  generateTokens(payload: Omit<TokenPayload, 'jti'>, familyId?: string): GeneratedTokens {
    const jti = crypto.randomUUID();
    const activeFamilyId = familyId || crypto.randomUUID();

    const accessToken = jwt.sign(
      { ...payload, jti },
      this.jwtSecret,
      { expiresIn: this.accessTokenExpirySeconds }
    );

    // Refresh Token é um token opaco e aleatório de 64 bytes hexadecimais
    const refreshToken = crypto.randomBytes(64).toString('hex');

    return {
      accessToken,
      refreshToken,
      familyId: activeFamilyId,
      expiresInSeconds: this.accessTokenExpirySeconds,
    };
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;
      return decoded;
    } catch {
      throw new UnauthorizedException('Token de acesso inválido ou expirado.');
    }
  }

  hashRefreshToken(refreshToken: string): string {
    return crypto.createHash('sha256').update(refreshToken).digest('hex');
  }
}
