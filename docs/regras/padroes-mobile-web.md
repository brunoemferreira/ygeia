# 📱 Padrões Mobile-First Web & React Native — YGEÍA

O ecossistema cliente do YGEÍA é composto por duas frentes de alta performance:
1. **Frontend Web**: React 19 + TypeScript + Vite + Tailwind CSS, com arquitetura estritamente **Mobile-First**.
2. **Aplicativo Mobile**: React Native 0.74+ com Expo Bare Workflow, New Architecture e suporte **Offline-First**.

---

## 1. Regras Estritas de Frontend Web (React 19 Mobile-First)

### 1.1 Filosofia Mobile-First
- O design e o CSS são **obrigatoriamente pensados primeiro para a tela de um smartphone** (largura de 360px a 414px) e progressivamente enriquecidos para telas maiores:
  - Estilos base: mobile por padrão (ex: `flex flex-col w-full p-4`).
  - Breakpoints Tailwind: apenas expansões progressivas (`sm:`, `md:`, `lg:`, `xl:`).
  - É proibido criar interfaces desktop e tentar adaptá-las depois para mobile com regras regressivas (`max-w-*` hacks).

### 1.2 Ergonomia e Usabilidade Touch
- **Touch Targets Mínimos**: Todos os botões, links navegáveis e seletores devem ter área de clique mínima de **48x48px** (WCAG 2.2 AA).
- **Controles Inferiores (Thumb Zone)**:
  - Menus principais de navegação em mobile utilizam *Bottom Navigation Bar*.
  - Ações críticas de formulário (Salvar, Confirmar, Próximo) ficam afixadas no rodapé (*Sticky Bottom Action Bar*), dentro do alcance confortável do polegar.
  - Modais complexos em desktop convertem-se automaticamente em **Bottom Sheets** deslizantes no mobile.
- **Tipografia Escalar**:
  - Tamanho mínimo de fonte para formulários no mobile é `16px` para evitar o auto-zoom indesejado do iOS Safari ao focar em inputs.
- **Tabelas Responsivas**:
  - Dados antropométricos e planos alimentares que usam tabelas no desktop convertem-se em **Cards empilhados** ou carrosséis horizontais com scroll suave no mobile.

### 1.3 Injeção Dinâmica de Tema White Label
- As cores da clínica são carregadas no bootstrap da aplicação via endpoint `GET /api/v1/tenants/branding`.
- As variáveis CSS no `:root` são atualizadas dinamicamente:
  ```css
  :root {
    --primary: #0284c7;
    --primary-foreground: #ffffff;
    --secondary: #0ea5e9;
    --font-family: 'Inter', sans-serif;
  }
  ```
- O Tailwind consome estas CSS variables (`bg-primary`, `text-primary`, etc.), garantindo adaptação instantânea à marca de cada clínica.

---

## 2. Regras do Aplicativo Mobile (React Native + Expo)

### 2.1 Arquitetura & Stack Tecnológica
- **React Native 0.74+ com New Architecture (TurboModules e Fabric)**.
- **Expo CNG (Continuous Native Generation)**: Gerenciamento unificado de código nativo iOS/Android sem duplicação de configurações.
- **TypeScript 5.x**: Tipagem estrita de ponta a ponta (`noImplicitAny`, `strictNullChecks`).

### 2.2 Suporte Offline-First
- O aplicativo do paciente deve funcionar fluidamente mesmo em academias, elevadores ou locais sem sinal de internet:
  - **Armazenamento de Alta Velocidade**: **react-native-mmkv** para configurações de UI, dados de branding da clínica e cache imediato.
  - **Persistência de Dados Estruturados**: **SQLite / WatermelonDB** para armazenamento offline de planos alimentares, metas de hidratação e diário de refeições.
  - **Fila de Sincronização em Background**: Registros de ingestão de água e refeições offline são enfileirados localmente e sincronizados automaticamente assim que a conectividade for restaurada.

### 2.3 Biometria Nativa e Segurança Mobile
- **Armazenamento Seguro de Tokens**: Uso de `expo-secure-store` para guardar a credencial de acesso no iOS Keychain e no Android Keystore.
- **Autenticação Biométrica**:
  - Uso de `expo-local-authentication` para suporte nativo a **Face ID**, **Touch ID** ou biometria digital do Android.
  - Solicitação de confirmação biométrica para desbloqueio rápido do aplicativo sem necessidade de digitar senha repetidamente.
- **Privacy Screen**:
  - Quando o aplicativo é minimizado ou enviado para segundo plano, a tela é ofuscada para impedir captura de dados de saúde na visualização de apps abertos do sistema operacional.

### 2.4 Câmera e Registro Fotográfico de Refeições
- Integração nativa com a câmera do dispositivo via `expo-camera` / `expo-image-picker`.
- Compressão e redimensionamento local de imagens antes do upload para preservar franquia de dados móveis do paciente.
- Haptics nativos via `expo-haptics` para feedback tátil em interações do paciente (ex: registrar um copo de água).
