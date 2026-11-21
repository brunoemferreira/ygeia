# Changelog - @ygeia/web

Todas as alterações da aplicação Web React serão registradas aqui.
Este projeto segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [Unreleased] - 2026-11-21

### Removido
- **Modo Demo & Entulhos de Simulação**:
  - Removidos todos os botões e handlers de login rápido com credenciais de demonstração na `LoginPage.tsx`.
  - Removido o seletor simulador de licenças ("Licenças: Nutri ✓ Treino ✓") no cabeçalho interno (`Header.tsx`).
  - Removidas referências a `demo-clinica` nos placeholders e textos de ajuda.
- **Recursos de Degustação / Experimentar**:
  - Removidos todos os formulários e CTAs de 14 dias de teste grátis / "Experimentar" na Navbar, Footer e tela de login.
  - Removido `AuthModal.tsx` legado.

### Adicionado
- **Módulo de Configurações (`SettingsModule`)**:
  - Layout em 2 colunas com busca de configurações e submenus (`CONTA`, `ATENDIMENTO`, `DOCUMENTOS E ASSINATURA`, `APARÊNCIA`).
  - Tela completa de Dados Pessoais com foto do profissional, edição inline de dados cadastrais e endereço.
  - Subtelas para troca de senha Argon2id, integração Google Calendar, upload de papel timbrado e equipe/secretárias.
- **Página de Login Dedicada (`LoginPage`)**:
  - Nova tela inteira de login substituindo o modal suspenso.
  - Abas segmentadas para Nutricionista e Portal do Paciente.
  - Botões de acesso rápido em 1-clique com credenciais de demonstração.

### Modificado
- **Navbar & Header**:
  - Inclusão de dropdown combo para seleção do perfil de login na Navbar.
  - Remoção do seletor de perfil no Header interno, substituído por badge de contexto de sessão ativa.
  - Remoção do termo "Módulo" dos menus da Sidebar e suporte a colapso/expansão suave com restauração de descrições.

### Removido
- **Recursos de Degustação / Experimentar**:
  - Removidos todos os formulários e CTAs de 14 dias de teste grátis / "Experimentar" na Navbar, Footer e tela de login.
  - Removido `AuthModal.tsx` legado.

## [0.1.0] - 2026-11-21

### Adicionado
- **Fase 2 (Painel Admin da Clínica, White Label Studio & Gestão de Equipe)**:
  - `AdminDashboard`: Painel com abas White Label Studio, Dados Cadastrais da Clínica, Perfil do Nutricionista & CRN (CFN Res. 600/2018) e Equipe com RBAC e aviso de sigilo médico LGPD.
  - Pré-visualização ao vivo do timbrado de prescrição e topo do aplicativo mobile.
  - `AuthModal`: Modal para autenticação e cadastro de clínicas com botão de acesso rápido com 1-clique (Demo Clínica Modelo).
  - `AuthContext`: Gerenciamento centralizado de sessão, token JWT e persistência local.
  - **Simulador Científico Nutricional Reformulado**:
    - Cálculo de IMC com classificação OMS em tempo real.
    - Fator de atividade física FAO/OMS e cálculo do Gasto Energético Total (GET).
    - Definição de Meta Calórica Alvo (Emagrecimento, Manutenção, Hipertrofia).
    - Presets clínicos rápidos em 1-clique (Hipertrofia, Cutting, Low Carb, Equilibrada).
    - Entradas numéricas diretas combinadas com sliders e botão de auto-alinhamento de carboidratos.
  - **Arquitetura de Layout Base (`AppLayout`) & Sidebar Modular**:
    - Sidebar retrátil esquerda com 4 blocos (Cadastros, Nutrição, Treinamento, Configurações).
    - Seletor rápido de modo (Nutricionista / Admin vs. Portal do Paciente) no topo.
    - Simulador de licenças ativas para validação do bloqueio/desbloqueio modular.
    - `PatientPortal`: portal do paciente estilo Apple Health com hidratação, cardápio interativo e substituições flexíveis.
  - Conexão do botão "Entrar / Painel Admin" na Navbar com status do usuário logado.
- **Landing Page Institucional Completa & Mobile-First**:
  - Seção Hero destacando **Exames Laboratoriais Criptografados**, White Label completo e conformidade CFN/LGPD.
  - Grade de vantagens com 8 diferenciais: Exames Criptografados com URLs pré-assinadas temporárias (15 min), Domínio Próprio White Label, Prontuário CFN & LGPD, Motor Antropométrico, Tabela TACO, App Mobile React Native Offline-First, PostgreSQL RLS e Ergonomia Mobile-First (touch targets 48px).
  - Seção de Segurança de Nível Bancário & Saúde (AES-256, Argon2id, RLS e Cookies HttpOnly).
  - **Simulador Científico Interativo** executando cálculos de TMB (Mifflin-St Jeor e Harris-Benedict) e proporções calóricas de macronutrientes ao vivo com o `@ygeia/domain-core`.
  - Preview interativo do aplicativo móvel nativo em React Native.
- Setup inicial da aplicação React com Vite e TypeScript estrito.
- Diretrizes de Mobile-First incorporadas e integração com pacotes do monorepo.
- `README.md` com instruções de execução e `.env.example`.
