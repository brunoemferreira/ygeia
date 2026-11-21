# Changelog - @ygeia/validation-schemas

Todas as alterações nos esquemas Zod compartilhados serão documentadas aqui.
Este pacote adere ao [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [0.1.0] - 2026-11-21

### Adicionado
- **Fase 0 (Setup do Monorepo & Esquemas)**:
  - Esquema Zod `loginSchema` para autenticação com e-mail, senha e 2FA TOTP opcional.
  - Esquema Zod `createPatientSchema` com validações de nome, e-mail, telefone, data de nascimento e gênero.
  - Inferência e exportação de tipos TypeScript correspondentes (`LoginInput`, `CreatePatientInput`).
