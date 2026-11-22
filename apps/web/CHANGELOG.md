# Changelog - @ygeia/web

Todas as alterações da aplicação Web React serão registradas aqui.
Este projeto segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [Unreleased] - 2026-11-21

### Adicionado
- **Motor de Aplicação Global de Tema Customizado (`branding.ts`)**:
  - Função `applyClinicTheme`: Aplica e sincroniza automaticamente todas as variáveis CSS no elemento `:root` (`--primary`, `--primary-rgb`, `--primary-hover`, `--primary-light`, `--primary-soft`, `--primary-border`, `--primary-glow`, `--secondary`, `--accent`, `--bh-primary`, `--font-sans`).
  - Atualização reativa instantânea de todas as telas, botões, modais, headers, seletores e menus ao trocar de tema.
- **Telas de Pacientes Referenciadas Fielmente no Better Health (`AdminRoutinePatientsSection` & `AdminNewPatientWizard`)**:
  - `PatientDirectory.tsx`: Layout com 4 cards de KPI, busca, filtro por convênio, tabela de pacientes e modal de confirmação de exclusão.
  - `NewPatientView.tsx`: Formulário estruturado com stepper vertical de 8 etapas, busca ViaCEP para endereço, máscaras de CPF e telefone (+55), 10 protocolos clínicos selecionáveis e alternância de criação/edição.
  - `DataTablePagination.tsx`: Componente de paginação com seletor de itens por página e navegação dinâmica.

### Modificado
- **Ponte de Estilos e Limpeza de Cores Fixas (`styles.css`, `Header.tsx`, `Sidebar.tsx`, `AdminDashboard.tsx`)**:
  - Mapeadas classes de cores utilitárias para variáveis do tema ativo, eliminando inconsistências visuais e garantindo cobertura de 100% no white-label.


### Adicionado
- **Biblioteca Unificada de Componentes de Design System (`src/components/ui/`)**:
  - `AppButton`: Suporte a variantes (`primary`, `secondary`, `outline`, `danger`, `ghost`), tamanhos (`sm`, `md`, `lg`), estado de carregamento e slot de ícone.
  - `AppInput`: Componente de entrada padronizado com label, ícone frontal, sufixo de unidades clínicas (`kg`, `ml`, `mg`, `UI`), anel de foco e suporte a erro.
  - `AppCard`: Contêiner com variantes semânticas (`default`, `metric`, `highlight`, `flat`) e elevações suaves.
  - `AppBadge`: Pílulas de status (`success`, `warning`, `danger`, `info`, `neutral`).
  - `AppModal`: Diálogo modal acessível com backdrop blur e tecla Escape.
  - `AppTable`: Grid paginado genérico `<T>` com busca integrada, dropdown de filtro de categoria, hover em linhas, clique para edição e navegação por páginas.
  - `index.ts`: Barrel export para consumo em todo o ecossistema.
- **Estúdio Sênior de Personalização e White-Label (`WhiteLabelStudio.tsx`)**:
  - 6 paletas médicas curadas prontas para uso em 1 clique.
  - Motor de harmonização algorítmica de cores secundárias e de destaque.
  - Auditor de contraste WCAG 2.2 AA em tempo real com indicador numérico de taxa.
  - Simulador interativo split-screen com visualização simultânea do Dashboard, Login e App Mobile.
- **Módulos Clínicos Portados do Projeto Evolva (`src/components/patient/`)**:
  - `BodyMapSVG`: Silhueta anatômica SVG com rotação dos 6 sítios de injeção subcutânea e pulso visual.
  - `HydrationWidget`: Medidor radial circular com cálculo da meta metabólica de $35\text{ ml/kg}$ e atalhos rápidos.
  - `NutritionCard`: Card com proteção de massa magra a $1.4\text{ g/kg}$ e 4 macronutrientes.
  - `WeightCard`: Evolução do peso, perda total em kg e percentual concluído.
  - `ActiveMedicationCard`: Gestão de canetas/ampolas de GLP-1 com cliques, seringas U-100 e estabilidade de 30 dias.
  - `DayStripSelector`: Carrossel semanal com indicadores de dose e água.
  - `PatientPortal`: Portal do paciente completo com todos os módulos integrados.

### Modificado
- **Refatoração da Lista de Pacientes (`PatientDirectory.tsx`)**:
  - Migrado para utilizar a biblioteca padronizada de UI (`AppTable`, `AppButton`, `AppBadge`, `AppCard`), mantendo rigorosa paridade visual com os mockups aprovados.

### Adicionado
- **Tela de Seleção de Pacientes Idêntica ao Mockup (`PatientDirectory.tsx`)**:
  - Implementação literal do design: fonte **Plus Jakarta Sans**, tag `ROTINA CLÍNICA`, título `Pacientes`, botão `+ Novo paciente` com ícone `UserPlus`.
  - 4 Cards de métricas KPI: *Total Pacientes* (verde), *App Conectado* (azul), *Com Convênio* (roxo) e *Particulares* (âmbar).
  - Barra de pesquisa independente com dropdown de filtro (*Todos os Pacientes*, *Cadastros Ativos*, *Com Convênio*, *Particulares*, *App Ativo*).
  - Tabela com colunas `PACIENTE`, `CONTATO`, `CPF`, `CONVÊNIO`, `ACESSO APP`, `AÇÕES`.
  - Ao clicar na linha ou no ícone de lápis de edição, abre a tela de edição do paciente com dados preenchidos.
  - Paginação com seletor de itens por página e navegação `<<`, `<`, `1`, `>`, `>>`.
- **Formulário com Modo de Edição e Criação (`NewPatientView.tsx`)**:
  - Preenchimento reativo para edição a partir de `initialPatient` e submissão via `PUT /api/v1/patients/:id`.
  - Campos adicionais: *Sexo de referência para cálculos* com nota explicativa, *Sexo atribuído ao nascimento* e *Identidade de gênero (opcional)*.
  - Alternância de título (`Editar paciente` / `Novo paciente`) e botão (`Salvar alterações` / `Cadastrar`).

### Modificado
- **Grid Paginado de Pacientes (`PatientDirectory.tsx`)**:
  - Tabela paginada completa sob o menu `Rotina -> Pacientes` com busca por nome/CPF/e-mail, filtro por status (Todos/Ativo/Inativo), paginação customizável e seleção de prontuários.
- **Tela Integrada de Novo Paciente (`NewPatientView.tsx`)**:
  - Layout inline no workspace idêntico ao modelo visual com Sidebar e Header ativos.
  - Stepper de 8 etapas, badge de categoria `PACIENTES`, botão `Fechar`, e ações `Cancelar`, `Continuar` e `Cadastrar`.

### Adicionado
- **Modal de Cadastro de Novos Pacientes (`NewPatientModal.tsx`)**:
  - Layout modal split com stepper de 8 etapas (*Dados pessoais*, *Tratamento e protocolos*, *Convênio*, *Local de atendimento*, *Foto*, *Endereço*, *Observações*, *Atestados*).
  - Formulário completo de dados pessoais com máscaras de data, CPF e telefone, sexo biológico para cálculos e dados de responsáveis.
  - Toggles interativos para envio de mensagens automáticas de boas-vindas por e-mail e WhatsApp.
  - Integração com a API `POST /api/v1/patients` e atualização dinâmica da lista de pacientes.
- **Visualização da Carteira de Pacientes no Dashboard (`AdminDashboard.tsx`)**:
  - Grade de cards de pacientes sob o menu `Rotina -> Pacientes` com busca e botão de novo cadastro.

### Modificado
- **Identidade Visual e Nome do Sistema (`LoginPage.tsx`, `Sidebar.tsx`, `branding.ts`)**:
  - Substituído qualquer vestígio de nomes herdados de referências externas pela marca **Ygeía** e slogan *"Nutrição Clínica & Governança Metabólica"*.
  - Paleta padrão alterada do azul genérico para o Verde Esmeralda (`#059669`), Verde Floresta (`#064e3b`) e Menta (`#10b981`), em perfeita consonância com o ecossistema clínico.
  - Migração retrocompatível do `localStorage` para garantir aplicação imediata da identidade Ygeía no navegador.
  - Placeholder de autenticação atualizado para `admin@ygeia.com.br`.

### Modificado
- **Isolamento de Portas Locais**:
  - Servidor Vite configurado na porta `5190` via `vite.config.ts` e script `dev`.
  - Conexão do cliente com a API reconfigurada para a porta `4333` via `VITE_API_URL`.
  - Inclusão do arquivo de tipagens `vite-env.d.ts`.

### Adicionado
- **Novo Painel Administrativo Executivo (`AdminDashboard.tsx`)**:
  - Layout dividido em 2 cards principais 50/50:
    - **Card de Pacientes**: Busca instantânea, listagem de pacientes, status ativo e botão `+ Cadastrar paciente`.
    - **Card de Agenda Semanal**: Régua de navegação de dias da semana interativa (`D 15` a `S 21`) com atalho de agendamento `+` e card de consulta agendada com horário e tipo.
- **Menu Lateral Executivo com Colapso Bidirecional (`Sidebar.tsx`)**:
  - Colapso/expansão horizontal (260px / 72px) com tooltips em modo compacto.
  - Acordeão vertical para submenus de *Rotina* e *Atendimento*.
  - Campo de busca rápida no menu (`Buscar no menu...`).
  - Rodapé com selo de versão `v0.58.0`, avatar do usuário logado e botão de logout rápido.
- **Cabeçalho Executivo com Breadcrumbs (`Header.tsx`)**:
  - Trilha de navegação hierárquica, descrição dinâmica da tela ativa e selo de `Acesso Administrativo Exclusivo`.

### Adicionado
- **Nova Tela de Login Split-Screen (`LoginPage.tsx`)**:
  - Layout dividido em 2 colunas com Hero institucional no painel esquerdo e formulário limpo no painel direito.
  - Consumo dinâmico da paleta de cores primária e secundária configuradas nas Configurações (White Label).
  - Componente de sincronização reativa de branding (`branding.ts`).
- **Sistema de Notificações Toast Reativo (`ToastProvider`, `useToast`, `ToastContainer`, `ToastItem`)**:
  - Hook unificado para disparo de alertas (`toast.success`, `toast.error`, `toast.warning`, `toast.info`).
  - Barra de progresso visual com auto-dismiss (4s/6.5s), suporte a subdetalhes expansíveis de erros e pausa no hover.
- **Utilitário de Normalização de Erros da API (`api-error-handler.ts`)**:
  - Parser centralizado para mapear respostas NestJS/Fastify, status HTTP e exceções de rede em mensagens amigáveis em português.

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
