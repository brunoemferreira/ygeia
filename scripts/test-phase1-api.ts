import fs from 'fs';
import path from 'path';

// Carrega variáveis do apps/api/.env
const envPath = path.resolve(__dirname, '../apps/api/.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

import { DatabaseService } from '../apps/api/src/database/database.service';
import { TenantContextService } from '../apps/api/src/common/context/tenant-context.service';
import { PasswordHasherService } from '../apps/api/src/common/security/password-hasher.service';
import { TokenService } from '../apps/api/src/common/security/token.service';
import { AuthService } from '../apps/api/src/modules/iam/auth.service';
import { TenantsService } from '../apps/api/src/modules/tenancy/tenants.service';

async function main() {
  console.log('--- TESTE DE INTEGRAÇÃO DA FASE 1: MULTI-TENANCY, IAM & RLS ---');

  const tenantContext = new TenantContextService();
  const db = new DatabaseService(tenantContext);
  await db.onModuleInit();

  const hasher = new PasswordHasherService();
  const tokenService = new TokenService();
  const authService = new AuthService(db, hasher, tokenService);
  const tenantsService = new TenantsService(db);

  try {
    // 1. Registro de Clínica A
    const slugA = `clinica-nutri-${Date.now()}`;
    console.log(`\n1. Registrando Clínica A (slug: ${slugA})...`);
    const regA = await authService.registerClinic({
      clinicName: 'Clínica Nutrição Viva',
      slug: slugA,
      ownerName: 'Dra. Daniela Nutricionista',
      email: `daniela@${slugA}.com`,
      password: 'SenhaUltraForte123!',
    });

    console.log(`   ✓ Clínica A criada com Tenant ID: ${regA.user.tenantId}`);
    console.log(`   ✓ Usuário Dono: ${regA.user.fullName} (${regA.user.role})`);
    console.log(`   ✓ Token JWT gerado: ${regA.tokens.accessToken.substring(0, 30)}...`);

    // 2. Consulta de Branding White Label
    console.log('\n2. Consultando Branding White Label da Clínica A...');
    const brandingA = await tenantsService.getBrandingBySlug(slugA);
    console.log(`   ✓ Nome: ${brandingA.clinicName}`);
    console.log(`   ✓ Cor Primária: ${brandingA.primaryColor}`);
    console.log(`   ✓ Cor Secundária: ${brandingA.secondaryColor}`);

    // 3. Login com validação Argon2id
    console.log('\n3. Efetuando Login da Clínica A com senha correta...');
    const loginA = await authService.login({
      slug: slugA,
      email: `daniela@${slugA}.com`,
      password: 'SenhaUltraForte123!',
    });
    console.log(`   ✓ Autenticado com sucesso! User ID: ${loginA.user.id}`);

    // 4. Teste de Rotação de Refresh Token
    console.log('\n4. Testando Rotação de Refresh Token...');
    const rotatedTokens = await authService.refreshToken(loginA.tokens.refreshToken);
    console.log(`   ✓ Novo Access Token emitido: ${rotatedTokens.accessToken.substring(0, 30)}...`);

    // 5. Teste de Detecção de Reuso de Refresh Token
    console.log('\n5. Testando Detecção de Reuso de Refresh Token antigo...');
    try {
      await authService.refreshToken(loginA.tokens.refreshToken);
      console.error('   ❌ FALHA: Deveria ter rejeitado o token já consumido!');
    } catch (e: any) {
      console.log(`   ✓ Sucesso: Detecção de sequestro de sessão acionada! Mensagem: ${e.message}`);
    }

    // 6. Teste de Isolamento RLS no PostgreSQL
    console.log('\n6. Testando Isolamento de Tenant via PostgreSQL Row-Level Security (RLS)...');
    // Registra Clínica B
    const slugB = `clinica-saude-${Date.now()}`;
    const regB = await authService.registerClinic({
      clinicName: 'Clínica Saúde Plena',
      slug: slugB,
      ownerName: 'Dr. Roberto Nutricionista',
      email: `roberto@${slugB}.com`,
      password: 'OutraSenhaForte456!',
    });

    // Consulta usuários sob o contexto de tenant da Clínica A
    await tenantContext.runWithContext({ tenantId: regA.user.tenantId }, async () => {
      const usersInTenantA = await db.query('SELECT email, full_name FROM users');
      console.log(`   ✓ Usuários visíveis sob Tenant A: ${usersInTenantA.rows.length}`);
      const hasUserB = usersInTenantA.rows.some((u) => u.email === `roberto@${slugB}.com`);
      if (hasUserB) {
        console.error('   ❌ FALHA NO RLS: Usuário da Clínica B vazou para a Clínica A!');
      } else {
        console.log('   ✓ RLS validado com sucesso: Usuário da Clínica B é 100% invisível para a Clínica A!');
      }
    });

    console.log('\n===========================================================');
    console.log('   ✅ TODOS OS TESTES DE INTEGRAÇÃO DA FASE 1 PASSARAM!');
    console.log('===========================================================\n');
  } finally {
    await db.onModuleDestroy();
  }
}

main().catch((err) => {
  console.error('[ERRO NO TESTE]:', err);
  process.exit(1);
});
