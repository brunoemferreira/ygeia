import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PasswordHasherService } from './password-hasher.service';
import { TokenService } from './token.service';

describe('Security Services (Argon2id & JWT)', () => {
  const passwordHasher = new PasswordHasherService();
  const tokenService = new TokenService();

  describe('PasswordHasherService (Argon2id)', () => {
    it('deve gerar hash Argon2id válido e verificar a senha com sucesso', async () => {
      const plainPassword = 'StrongPassword123!';
      const hash = await passwordHasher.hash(plainPassword);

      assert.ok(hash.startsWith('$argon2id$'), 'O hash deve começar com o prefixo $argon2id$');

      const isValid = await passwordHasher.verify(hash, plainPassword);
      assert.strictEqual(isValid, true, 'Senha correta deve ser verificada como verdadeira');

      const isInvalid = await passwordHasher.verify(hash, 'WrongPassword');
      assert.strictEqual(isInvalid, false, 'Senha incorreta deve ser verificada como falsa');
    });

    it('deve rejeitar senhas com menos de 8 caracteres', async () => {
      await assert.rejects(async () => {
        await passwordHasher.hash('short');
      }, /no mínimo 8 caracteres/);
    });
  });

  describe('TokenService (JWT Access Token & Refresh Token)', () => {
    it('deve gerar access token e refresh token estruturados', () => {
      const payload = {
        sub: 'user-uuid-1234',
        tenantId: 'tenant-uuid-5678',
        role: 'CLINIC_OWNER',
        email: 'nutri@ygeia.app',
      };

      const tokens = tokenService.generateTokens(payload);

      assert.ok(tokens.accessToken, 'Access token deve existir');
      assert.ok(tokens.refreshToken, 'Refresh token deve existir');
      assert.strictEqual(tokens.refreshToken.length, 128, 'Refresh token hex deve ter 128 chars (64 bytes)');
      assert.strictEqual(tokens.expiresInSeconds, 900, 'Expiração deve ser de 900s (15 min)');

      // Validação do JWT
      const verified = tokenService.verifyAccessToken(tokens.accessToken);
      assert.strictEqual(verified.sub, payload.sub);
      assert.strictEqual(verified.tenantId, payload.tenantId);
      assert.strictEqual(verified.role, payload.role);
      assert.ok(verified.jti, 'Token deve conter jti único');
    });

    it('deve gerar hash determinístico para o refresh token', () => {
      const rawToken = 'abc123def456';
      const hash1 = tokenService.hashRefreshToken(rawToken);
      const hash2 = tokenService.hashRefreshToken(rawToken);

      assert.strictEqual(hash1, hash2, 'Hashes SHA-256 do mesmo token devem ser idênticos');
      assert.strictEqual(hash1.length, 64, 'Hash SHA-256 deve ter 64 caracteres');
    });
  });
});
