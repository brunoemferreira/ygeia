# Changelog - @ygeia/mobile

Todas as alterações do aplicativo móvel React Native serão registradas aqui.
Este projeto segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [Unreleased] - 2026-11-22

### Adicionado
- **Suporte a Expo Web para Visualização no Navegador (`package.json`, `@expo/metro-runtime`, `react-native-web`)**:
  - Adicionado suporte completo para execução direta no navegador via `expo start --web`, resolvendo o erro 500 retornado pelo Metro Bundler ao ser acessado via browser sem o adaptador web.
- **📱 Conclusão da Fase 4: Portal do Paciente & Atleta em React Native (`App.tsx`, `screens/`, `components/`)**:
  - **Abordagem Dual Adaptativa**: Alternância fluida entre o **🍏 Modo Clínico Geral** (emagrecimento saudável, hábitos e reeducação) e o **⚡ Modo Esportivo & Alta Performance** (recomposição corporal, g/kg/dia, nutrient timing e suplementação).
  - **Visualização das Refeições por Horários (`MealItemCard.tsx`, `TodayScreen.tsx`)**:
    - Listagem cronológica de café da manhã, almoço, lanches, pré-treino, pós-treino e ceia.
    - Checkbox tátil para confirmação de refeição realizada com recálculo instantâneo de calorias e macronutrientes consumidos.
    - Tags visuais para refeições peri-treino.
  - **Substituição de Alimentos em 1 Toque (`FoodSubstitutionModal.tsx`)**:
    - Modal interativo com equivalência de densidade calórica e macros calculados para permitir trocas práticas no dia a dia.
  - **Meta de Hidratação Interativa (`HydrationCard.tsx`)**:
    - Barra de progresso percentual com botões de atalho rápido (+200ml, +350ml e +500ml) e feedback visual de conquista.
  - **Banner de Periodização Peri-Treino (`PeriWorkoutBanner.tsx`)**:
    - Alternância entre Dia de Treino (ON) e Dia de Descanso (OFF) com modulação automática de carboidratos (-25% no descanso).
  - **Suplementação Estruturada Diária**:
    - Listagem de creatina, whey protein, ômega-3 e vitaminas com confirmação de tomada diária.
  - **Navegação por Abas Nativas (`BottomTabBar.tsx`)**:
    - Abas: *Hoje (Diário)*, *Plano Completo*, *Evolução Antropométrica* e *Nutricionista* (com botão direto para WhatsApp).
  - **Módulo de Lógica Pura & Testes Automatizados (`nutritionCalculations.ts`, `nutritionCalculations.spec.ts`)**:
    - 4 testes unitários automatizados cobrindo soma de macros consumidos, proporção de substitutos, limite de hidratação e modulação de carboidratos no descanso.

### Adicionado
- **Padrões de Segurança Móvel Anti-Invasão (`SECURITY.md`)**:
  - Especificação e diretrizes de Hardware-Backed Secure Storage (iOS Keychain e Android Keystore AES-256), SSL/TLS Certificate Pinning contra Man-in-the-Middle (MitM), detecção de Root/Jailbreak e bloqueio de print/gravação de tela em dados médicos sensíveis.

## [0.1.0] - 2026-11-21

### Adicionado
- Setup inicial da aplicação React Native com Expo (Continuous Native Generation).
- Configuração do `app.json` sincronizado com a versão central do Monorepo.
- `README.md` com instruções de execução em emuladores e dispositivos físicos.
