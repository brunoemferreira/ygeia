# Changelog - @ygeia/web

Todas as alterações da aplicação Web React serão registradas aqui.
Este projeto segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

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
