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
