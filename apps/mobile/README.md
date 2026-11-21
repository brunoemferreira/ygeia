# @ygeia/mobile — Aplicativo Móvel Nativo em React Native (Expo CNG)

Aplicativo móvel desenvolvido nativamente em **React Native** com **TypeScript**, concebido para o paciente acompanhar sua dieta, registrar diário alimentar fotográfico, controlar hidratação e acessar a identidade visual White Label de sua clínica nutricional.

---

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js >= 20 LTS
- Expo Go no smartphone ou emuladores configurados (Android Studio / Xcode no macOS)

### Comandos
```bash
# Na raiz do monorepo:
pnpm install

# Iniciar o servidor de desenvolvimento Expo:
pnpm --filter @ygeia/mobile start
```

---

## ⚙️ Variáveis de Ambiente (`.env`)

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3333 # Emulador Android
# ou EXPO_PUBLIC_API_URL=http://localhost:3333 # Simulador iOS
```

---

## 🔒 Recursos Nativos & Segurança
- **SecureStore**: Armazenamento no iOS Keychain e Android Keystore.
- **Biometria**: Face ID / Touch ID nativos via `expo-local-authentication`.
- **Offline-First**: Cache local de plano alimentar para consulta em supermercados ou locais sem internet.

---

## 📜 Changelog da Aplicação

Consulte o histórico detalhado em [CHANGELOG.md](./CHANGELOG.md).

### Versão Atual: `v0.1.0` (2026-11-21)
- Setup inicial da aplicação móvel em **React Native** com **Expo Bare Workflow (CNG)**.
- Configuração do `app.json` sincronizado com a versão central do Monorepo.
- Estrutura base de segurança com `expo-secure-store` e autenticação biométrica.
- Configuração de ambiente (`.env.example`) e execução multiplataforma (iOS e Android).
