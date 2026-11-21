# Changelog - @ygeia/validation-schemas

Todas as alterações nos esquemas Zod compartilhados serão documentadas aqui.
Este pacote adere ao [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [0.1.0] - 2026-11-21

### Adicionado
- **Fase 2 (Configuração da Clínica, Perfil CRN, White Label Studio & Equipe)**:
  - `updateTenantSettingsSchema` (dados cadastrais e fiscais da clínica).
  - `updateNutritionistProfileSchema` (registro profissional CRN conforme Res. CFN 600/2018).
  - `updateTenantBrandingSchema` (cores primária/secundária/destaque, logos e tipografia).
  - `inviteTeamMemberSchema` (convites com validação estrita de cargos RBAC).
  - `registerClinicSchema` (cadastro inicial de novas clínicas SaaS).
- **Fase 0 (Setup do Monorepo & Esquemas)**:
  - Esquema Zod `loginSchema` para autenticação com e-mail, senha e 2FA TOTP opcional.
  - Esquema Zod `createPatientSchema` com validações de nome, e-mail, telefone, data de nascimento e gênero.
  - Inferência e exportação de tipos TypeScript correspondentes (`LoginInput`, `CreatePatientInput`).
