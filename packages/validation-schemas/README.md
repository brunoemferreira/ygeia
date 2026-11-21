# @ygeia/validation-schemas

> Esquemas de validação Zod compartilhados entre API (NestJS), Frontend Web (React) e Mobile (React Native).

Garanta que os contratos de DTOs de entrada e mutação sejam idênticos em todas as aplicações do ecossistema.

---

## 🛠️ Instalação e Compilação

```bash
# Na raiz do monorepo:
pnpm install

# Compilar para JavaScript/TypeScript definitions:
pnpm --filter @ygeia/validation-schemas build
```

---

## 📦 Esquemas Disponíveis
- `loginSchema`: Autenticação e 2FA TOTP.
- `createPatientSchema`: Cadastro inicial de paciente.

---

## 📜 Changelog do Pacote

Consulte o histórico detalhado em [CHANGELOG.md](./CHANGELOG.md).

### Versão Atual: `v0.1.0` (2026-11-21)
- Criação dos esquemas iniciais de autenticação e pacientes com Zod.
- Inferência tipada para TypeScript consumida por API, Web e Mobile.
