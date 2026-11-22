# Changelog Consolidado — YGEÍA (Υγεία)

Todas as mudanças notáveis deste projeto em todas as suas aplicações e pacotes estão consolidadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Unreleased] - 2026-11-22

### 🌍 Bandeiras Gráficas em Alta Resolução para Todos os Prefixos Telefônicos Internacionais
- **Frontend Web (`apps/web`)**:
  - `countryDialCodes.tsx`: Criação de componente dedicado `CountryFlag` que renderiza bandeiras oficiais e nítidas para **todos os 37 países e prefixos** suportados (Brasil, EUA, Portugal, Espanha, Argentina, Alemanha, França, Itália, Japão, etc.), eliminando problemas de fontes de emojis no Windows.
  - `NewPatientView.tsx` e `NewPatientModal.tsx`:
    - Integração de `<CountryFlag />` tanto no seletor de DDI ativo quanto no dropdown pesquisável de países.
    - Sincronização completa da seleção do DDI com o salvamento do telefone em ambas as telas de cadastro.

### 📱 Padronização Visual do Campo de Telefone (Design Unificado com Bandeira e DDI)
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx` e `NewPatientModal.tsx`:
    - Unificação do campo de telefone em um container único com borda arredondada (`rounded-lg`), fundo branco e divisor vertical suave.
    - Seletor de país integrado à esquerda com bandeira nítida em SVG (Brasil 🇧🇷 com cores oficiais precisas), código DDI (`+55`) e seta indicadora (`⌄`).
    - Campo de número à direita com placeholder padronizado `(00) 00000-0000`, sem bordas internas e máscara automática de formatação.

### 🧹 Limpeza nos Rodapés de Cadastro de Pacientes
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx` e `NewPatientModal.tsx`: Remoção completa dos textos e links de rodapé (*"Vindo de outro software? Clique aqui para importar"* e *"Se precisar de ajuda, clique aqui 💬"*), deixando os formulários mais concisos e com foco total nas etapas clínicas.

### 🧹 Limpeza nos Rodapés de Cadastro de Pacientes
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx` e `NewPatientModal.tsx`: Remoção completa dos textos e links de rodapé (*"Vindo de outro software? Clique aqui para importar"* e *"Se precisar de ajuda, clique aqui 💬"*), deixando os formulários mais concisos e com foco total nas etapas clínicas.

### 🛠️ Ajuste de Layout Pixel-Perfect da Tela de Configurações (Fidelidade Total à Imagem de Referência)
- **Frontend Web (`apps/web`)**:
  - `styles.css`:
    - Ajustado breakpoint do grid `.ygeia-settings-layout` para manter a estrutura em 2 colunas (`240px 1fr`) em telas a partir de `768px` (prevenindo quebra de layout prematura em resoluções intermediárias).
  - `SettingsModule.tsx`:
    - **Cabeçalho**: Removido badge com fundo verde de `CONFIGURAÇÃO`, adotando o texto superior sutil em cinza com tracking espaçado (`0.12em`), idêntico à imagem de referência.
    - **Sidebar**:
      - Substituição do ícone de `Idioma` pelo ícone `Languages` (`文A`).
      - Neutralização visual da cor de `Zona de perigo` para manter a sobriedade idêntica ao design de referência.
      - Ajuste da cor de destaque do item ativo para pílula suave `#f1f5f9` com texto escuro `#0f172a`.
    - **Card de Dados Pessoais**:
      - Botão `Editar` com cantos levemente arredondados (`rounded-md`) e verde esmeralda `#10b981`.
      - Seção `Foto`: Container tracejado com avatar do profissional Bruno Ferreira (`/bruno-profile.jpg`), subtítulo `PNG, JPEG ou WEBP — máx. 10MB` e botões de ação `Alterar` e `Remover`.
      - Seções `IDENTIFICAÇÃO` e `ENDEREÇO`: Alinhamento milimétrico das colunas (largura fixa de 220px para rótulos) com traço `—` para campos sem valor cadastrado.

### 🧬 Ajuste em Sexo de Referência para Cálculos
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx`: Restrição estrita das opções do campo `Sexo de referência para cálculos *` exclusivamente para **Feminino** e **Masculino**, alinhando com as diretrizes e fórmulas bioenergéticas e de pregas cutâneas do CFN/OMS.

### 🛠️ Ajuste de Layout Pixel-Perfect da Tela de Configurações (Fidelidade Total à Imagem de Referência)
- **Frontend Web (`apps/web`)**:
  - `styles.css`:
    - Ajustado breakpoint do grid `.ygeia-settings-layout` para manter a estrutura em 2 colunas (`240px 1fr`) em telas a partir de `768px` (prevenindo quebra de layout prematura em resoluções intermediárias).
  - `SettingsModule.tsx`:
    - **Cabeçalho**: Removido badge com fundo verde de `CONFIGURAÇÃO`, adotando o texto superior sutil em cinza com tracking espaçado (`0.12em`), idêntico à imagem de referência.
    - **Sidebar**:
      - Substituição do ícone de `Idioma` pelo ícone `Languages` (`文A`).
      - Neutralização visual da cor de `Zona de perigo` para manter a sobriedade idêntica ao design de referência.
      - Ajuste da cor de destaque do item ativo para pílula suave `#f1f5f9` com texto escuro `#0f172a`.
    - **Card de Dados Pessoais**:
      - Botão `Editar` com cantos levemente arredondados (`rounded-md`) e verde esmeralda `#10b981`.
      - Seção `Foto`: Container tracejado com avatar do profissional Bruno Ferreira (`/bruno-profile.jpg`), subtítulo `PNG, JPEG ou WEBP — máx. 10MB` e botões de ação `Alterar` e `Remover`.
      - Seções `IDENTIFICAÇÃO` e `ENDEREÇO`: Alinhamento milimétrico das colunas (largura fixa de 220px para rótulos) com traço `—` para campos sem valor cadastrado.

### 🧬 Ajuste em Sexo de Referência para Cálculos
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx`: Restrição estrita das opções do campo `Sexo de referência para cálculos *` exclusivamente para **Feminino** e **Masculino**, alinhando com as diretrizes e fórmulas bioenergéticas e de pregas cutâneas do CFN/OMS.

### 🎨 Restauração Fiel e Alinhamento da Tela de Configurações (Padrão Better Health)
- **Frontend Web (`apps/web`)**:
  - `SettingsModule.tsx`:
    - Reestruturação completa do layout para corresponder 1:1 ao design do Better Health:
      - **Cabeçalho**: Adicionada tag superior `CONFIGURAÇÃO` em caixa alta com fundo sutil, título `Configurações` em destaque (1.75rem, bold 800) e subtítulo institucional.
      - **Layout em 2 Colunas (`.ygeia-settings-layout`)**:
        - **Sidebar Esquerda Aberta (`.ygeia-settings-sidebar`)**: Caixa de busca `Procurar` no topo com ícone e borda limpa, seguida pelos quatro grupos estruturados com títulos em cinza (`CONTA`, `ATENDIMENTO`, `DOCUMENTOS E ASSINATURA`, `APARÊNCIA`) e botões com ícones dedicados e pílula ativa em cinza claro (`#f1f5f9`).
        - **Card Principal Branco (`.ygeia-settings-content`)**: Cartão limpo com bordas e sombra suave contendo o conteúdo da sub-aba ativa.
      - **Aba Dados Pessoais Fiel à Referência**:
        - Modo de visualização limpo com botão `Editar` no canto superior direito.
        - Seção **Foto**: Caixa tracejada com avatar do profissional (`/bruno-profile.jpg`), textos informativos e botões `Alterar` e `Remover`.
        - Seções **IDENTIFICAÇÃO** e **ENDEREÇO**: Listagem em linhas horizontais divididas por divisores suaves (`Nome completo`, `Email`, `Telefone`, `CRN`, `CPF / CNPJ`, `Especialidades`, `CEP`, `Logradouro`, `Cidade / UF`).
        - Modo de edição acessível via botão `Editar` permitindo atualizar os dados e persistir em tempo real.
  - `styles.css`: Substituição do encapsulamento anterior por regras limpas de grid responsivo `.ygeia-settings-layout`, `.ygeia-settings-sidebar` e `.ygeia-settings-content`.

### ✨ Melhorias Avançadas no Cadastro de Pacientes & Componentes de Formulário
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx`:
    - **Seletor de DDI Internacional com Bandeirinhas**: Implementado botão seletor de país no campo de telefone com bandeiras emoji (37 países cobertos: Brasil 🇧🇷 +55, EUA 🇺🇸 +1, Portugal 🇵🇹 +351, Espanha 🇪🇸 +34, etc.), dropdown inteligente com campo de pesquisa em tempo real e fechamento ao clicar fora.
    - **Comboboxes Modernos (`.ygeia-select`)**: Padronização visual de todos os selects do formulário com seta SVG personalizada, padding proporcional, foco suave com `--primary-glow` e bordas refinadas.
    - **Campo de Sexo de Referência**: Título atualizado para `Sexo de referência para cálculos *` com indicação de obrigatoriedade e texto explicativo abaixo: *"Usado nos cálculos e nas faixas de referência. Revise conforme a avaliação clínica."*.
    - **Placeholders Padronizados**: Data de nascimento ajustada para `DD/MM/YYYY` e CPFs para `000.000.000-00`.
    - **Card de Responsável Legal**: Agrupamento em card isolado (`Dados do Responsável Legal`) contendo nome, CPF do responsável com máscara e nota explicativa para menores de idade.
    - **Combo de Objetivo Principal na Aba de Tratamento**: Adicionado combobox com os objetivos: *Emagrecimento*, *Hipertrofia*, *Manutenção*, *Performance Esportiva*, *Reeducação Alimentar* e *Saúde Digestiva*.
    - **Campo Dinâmico de Tags**: Input com botão `Adicionar Tag` e suporte à tecla Enter, renderizando badges coloridos com botão `X` para remoção individual.
    - **Campo Dinâmico de Patologias**: Input com botão `Adicionar Patologia` e suporte à tecla Enter, renderizando badges clínicos com botão `X` para remoção individual.
  - `PatientDirectory.tsx` & `AdminDashboard.tsx`: Atualização da interface `PatientRecord` e dos manipuladores de criação e edição para persistir `objective`, `tags` e `pathologies`.
  - `styles.css`: Estilização utilitária de `.ygeia-select` e `.ygeia-country-dropdown`.

### 🔍 Tipografia Refinada e Densidade Compacta do Grid de Pacientes (Fiel ao Better Health)
- **Frontend Web (`apps/web`)**:
  - `PatientDirectory.tsx`:
    - Redução e calibragem precisa dos tamanhos de fontes e paddings para coincidir 1:1 com o padrão estético compacto do Better Health (`AdminRoutinePatientsSection.tsx`).
    - Cabeçalhos de coluna (`thead th`): Reduzidos para `fontSize: '0.6875rem'` (11px), `fontWeight: 600`, tracking `0.05em`, caixa alta e padding enxuto de `0.75rem 1.25rem`.
    - Nome do paciente: Reduzido de `0.875rem` / bold 700 para `fontSize: '0.8125rem'` (13px), `fontWeight: 600` e cor `#0f172a`.
    - Subtítulo de localização do atendimento: Ajustado para `fontSize: '0.6875rem'` (11px) com cor `#94a3b8`.
    - Avatar do paciente / iniciais: Dimensionamento refinado de `40px` para `36px` (`fontSize: 0.75rem`).
    - Informações de contato (e-mail e telefone) e CPF: Tipografia compacta em `fontSize: '0.75rem'` (12px) com ícones em `12px`.
    - Badges de Convênio e Acesso App: Tipografia reduzida para `fontSize: '0.6875rem'` (11px), `fontWeight: 500` e padding de `0.2rem 0.55rem`.
    - Células da tabela (`tbody td`): Padding vertical reduzido de `1rem` para `0.625rem 1.25rem` (10px vertical), proporcionando altura de linha elegante e compacta.
    - Botões de ações: Redução do padding para `0.35rem`, ícones em `14px` e largura da coluna sticky ajustada para `90px`.
    - Cards de métricas superiores: Ajuste do número de destaque de `1.625rem` para `1.375rem` (22px) com padding interno de `1rem 1.25rem`.
    - Barra de busca e filtro: Input em `fontSize: '0.8125rem'` (13px) e seletor em `0.75rem`.
  - `DataTablePagination.tsx`:
    - Altura e padding do rodapé de paginação ajustados para `0.625rem 1.25rem`.
    - Botões numéricos e de navegação compactados para `24px` de altura, com ícones em `14px` e tipografia `0.6875rem`.
  - `AppTable.tsx`:
    - Alinhamento de todos os grids genéricos do sistema para a mesma densidade visual enxuta (`fontSize: 0.6875rem` no cabeçalho e `0.75rem` nas células, padding `0.625rem 1.25rem`).

### 🛠️ Correção e Responsividade Avançada no Grid de Pacientes (Padrão Better Health)
- **Frontend Web (`apps/web`)**:
  - `PatientDirectory.tsx`:
    - Adicionada largura mínima explícita de `850px` na `<table>` com container `overflowX: 'auto'` e aceleração touch `-webkit-overflow-scrolling: touch`.
    - Implementada fixação estática lateral (*sticky column*) para a coluna **Ações** (`position: sticky; right: 0; zIndex: 1`), com sombra suave de sobreposição e fundo consistente no hover da linha, garantindo que os botões de edição e exclusão jamais sejam cortados ou comprimidos em qualquer largura de tela ou dispositivo móvel.
    - Prevenção de quebra de linha com `white-space: nowrap` e largura fixa de `110px` para a coluna de ações.
  - `AppTable.tsx`: Aplicada a mesma padronização de `min-width: 850px` e coluna de ações *sticky right* para todos os grids genéricos do sistema.
  - `AdminDashboard.tsx`: Ajuste no padding do contêiner da visualização para evitar margens duplas e compressão prematura da tabela.

### ⚙️ Resiliência da API Backend em Desenvolvimento Local
- **Backend API (`apps/api`)**:
  - `DatabaseService`: Tratamento gracioso de indisponibilidade temporária de conexão com o PostgreSQL em modo de desenvolvimento local, mantendo a API em execução contínua para rotas e serviços auxiliares enquanto o contêiner ou serviço de banco de dados é iniciado.

### 📱 Mobile First Integral, Padronização de Configurações & Menus Principais (Cadastros, Nutrição e Treinamento)
- **Frontend Web (`apps/web`)**:
  - **Arquitetura Mobile First em Todos os Componentes e Telas**:
    - `Sidebar.tsx`: Implementado menu lateral responsivo off-canvas drawer para telas `< 1024px`, com deslize suave via CSS transitions, backdrop escuro com `backdrop-filter: blur(4px)`, fechamento automático ao selecionar itens e botão de fechar (`X`). No desktop (`>= 1024px`), preservado o comportamento retrátil em 72px e 260px.
    - `Header.tsx`: Adicionado botão hamburger com padrão de acessibilidade táctil (`touch-target`, altura mínima 44px) visível exclusivamente no mobile para controle do drawer, além de layout elástico para breadcrumbs e títulos sem quebra ou overflow horizontal.
    - `AppLayout.tsx`: Orquestração reativa do estado do drawer mobile (`mobileSidebarOpen`) conectando o botão do Header com a Sidebar e o backdrop escurecido.
    - `NewPatientView.tsx`: Substituição do grid rígido de 12 colunas por layout fluido `ygeia-wizard-container`. No mobile, o stepper de 8 etapas agora atua como uma fita horizontal touch (`ygeia-wizard-stepper`) com scroll momentum sem barra visível. Inputs e seletores agrupados em `ygeia-grid-1-2` empilhando verticalmente em 1 coluna em telas `< 640px` e expandindo para 2 colunas em telas maiores.
    - `PatientDirectory.tsx`: Grid de métricas de topo reconfigurado com `ygeia-grid-metrics` (1 coluna em smartphones, 2 colunas em phablets/tablets, 4 colunas em desktops), barra de busca e filtro empilháveis no mobile e tabela com contêiner com rolagem touch horizontal `-webkit-overflow-scrolling: touch`.
  - **Refatoração Completa do Módulo de Configurações (`SettingsModule.tsx`)**:
    - Migração integral para o Design System Ygeía utilizando `AppCard`, `AppButton`, `AppInput` e `AppBadge`.
    - Eliminação completa de cores estáticas hardcoded (`#10b981`, `#ecfdf5`, `#059669`), adotando variáveis CSS reativas de tema (`var(--primary)`, `var(--primary-light)`, `var(--primary-border)`, `var(--primary-hover)`).
    - Layout mobile-first responsivo (`ygeia-settings-container` e `ygeia-settings-nav`), onde as categorias de navegação tornam-se pílulas horizontais touch no mobile e sidebar lateral no desktop.
    - Padronização de todas as sub-abas: Dados pessoais, Senha e Segurança, Secretárias & Equipe, Papel Timbrado, Sincronização Google Calendar e Estúdio White-Label.
  - **Novos Menus Principais no Menu Lateral & Workspaces Clínicos Conectados**:
    - **`Cadastros`**:
      - `cadastros_pacientes`: Acesso direto à carteira e wizard de pacientes idênticos ao padrão Better Health.
      - `cadastros_alimentos`: Tabela TACO (UNICAMP) pesquisável por nome e categoria com detalhamento de macronutrientes (Kcal, Proteínas, Carboidratos, Lipídios, Fibras).
      - `cadastros_suplementos`: Catálogo de suplementos clínicos e fitoterápicos com dosagens e posologias recomendadas (Creatina, Whey, Ômega-3, Vitamina D3+K2, Magnésio, CoQ10).
      - `cadastros_modelos`: Modelos de prescrição pré-configurados (Hipertrofia Limpa, Emagrecimento, Low FODMAPs, Mediterrânea).
      - `cadastros_locais`: Gestão de salas físicas e atendimento por telemedicina segura.
    - **`Nutrição`**:
      - `nutricao_tmb`: Calculadora bioenergética interativa em tempo real com as estratégias científicas `MifflinStJeorStrategy` e `HarrisBenedictStrategy` de `@ygeia/domain-core`, fator de atividade física, metas calóricas (-500 kcal déficit, +350 kcal superávit) e distribuição de macronutrientes recomendada pelo CFN.
      - `nutricao_cardapio`: Planejador de cardápios com fracionamento em refeições (Café da Manhã, Almoço, Lanche, Jantar) e cálculo calórico por refeição.
      - `nutricao_antropometria`: Avaliação de composição corporal (% gordura Pollock 7 e 3 dobras, Faulkner, circunferências e Relação Cintura-Quadril).
      - `nutricao_exames`: Painel de biomarcadores laboratoriais com faixas de referência clínica (Glicemia, HbA1c, Perfil lipídico, Vitamina D, Ferritina).
    - **`Treinamento`**:
      - Prescrição de treinos com divisão semanal ABCD, banco de exercícios com bi-sets, cadência, sobrecarga progressiva e tempo de descanso.

## [Unreleased] - 2026-11-21

### 💎 Aplicação Global de Tema Customizado White-Label & Migração Completa do Design Better Health
- **Frontend Web (`apps/web`)**:
  - **Motor de Tema Dinâmico Global (`branding.ts` & `styles.css`)**:
    - Implementação de `applyClinicTheme`: Injeta e sincroniza instantaneamente no elemento raiz `:root` do DOM (`document.documentElement.style`) as variáveis CSS essenciais (`--primary`, `--primary-rgb`, `--primary-hover`, `--primary-light`, `--primary-soft`, `--primary-border`, `--primary-glow`, `--secondary`, `--accent`, `--bh-primary`, `--bh-primary-hover`, `--bh-primary-soft`, `--bh-primary-border`, `--bh-shadow-focus`, `--font-sans`).
    - Ponte de estilos CSS no `styles.css` mapeando classes Tailwind (`.bg-emerald-50`, `.bg-emerald-500`, `.text-emerald-600`, `.border-emerald-500`, anéis de foco) diretamente para os tokens do tema personalizado, eliminando o problema de telas com estilos mesclados ou verdes hardcoded.
    - Higienização e substituição de cores fixas no `Header.tsx`, `Sidebar.tsx`, `AdminDashboard.tsx`, `SettingsModule.tsx` e componentes de UI para consumirem as variáveis de tema.
    - Remoção do bloqueio em `branding.ts` que forçava paletas azuis de volta para verde esmeralda.
  - **Recriação Fiel das Telas de Paciente a Partir do Projeto Better Health**:
    - `PatientDirectory.tsx`: Recriado com fidelidade milimétrica a partir de `AdminRoutinePatientsSection.tsx` do Better Health:
      - Cabeçalho com tag `ROTINA CLÍNICA`, título `Pacientes`, botão `+ Novo paciente` com `UserPlus`.
      - 4 cards de métricas de topo (Total Pacientes, App Conectado, Com Convênio, Particulares).
      - Barra de busca e filtro de convênio (*Todos os Pacientes*, *Apenas com Convênio*, *Apenas Particulares*).
      - Tabela de dados com avatar/iniciais, localização do atendimento, contatos com ícones de e-mail e telefone, CPF, badge de convênio, indicador de acesso ao app (`App Ativo` / `Pendente`) e ações de edição e exclusão.
      - Modal de confirmação de exclusão com backdrop blur.
    - `NewPatientView.tsx`: Wizard completo das 8 etapas adaptado fielmente de `AdminNewPatientWizard.tsx`:
      - Stepper vertical responsivo com 8 etapas (*Dados pessoais*, *Tratamento e protocolos*, *Convênio*, *Local de atendimento*, *Foto do paciente*, *Endereço completo*, *Observação importante*, *Atestado e recibo*).
      - Busca automática de CEP via ViaCEP com autopreenchimento de logradouro, bairro, cidade e estado.
      - Formatação e máscaras reativas de CPF, telefone brasileiro (+55) e data de nascimento.
      - Seleção de 10 protocolos e metas clínicas com pílulas interativas.
      - Toggles reativos para notificação de boas-vindas por e-mail e WhatsApp.
      - Suporte integral a criação (`mode="create"`) e edição (`mode="edit"`) de pacientes.
    - `DataTablePagination.tsx`: Componente de paginação idêntico ao do Better Health integrado ao design system.


### 🎨 Padronização de Design System, White-Label Studio & Módulos Clínicos Evolva
- **Frontend Web (`apps/web`)**:
  - **Biblioteca Unificada de Componentes UI (`src/components/ui/`)**:
    - `AppButton`: Padronização de botões do sistema com variantes (`primary`, `secondary`, `outline`, `danger`, `ghost`), tamanhos (`sm`, `md`, `lg`), estado de carregamento e suporte a ícones.
    - `AppInput`: Input unificado com suporte a rótulo, ícone frontal, sufixo de unidade médica (`kg`, `ml`, `mg`, `UI`), anel de foco e mensagens de validação.
    - `AppCard`: Contêiner com variantes padronizadas (`default`, `metric`, `highlight`, `flat`) com bordas suaves e elevação consistente.
    - `AppBadge`: Pílulas de status semânticas (`success`, `warning`, `danger`, `info`, `neutral`).
    - `AppModal`: Diálogo modal acessível com desfoque de fundo (backdrop blur), suporte a tecla Escape e rodapé padronizado.
    - `AppTable`: Grid paginado genérico `<T>` com busca integrada, dropdown de filtros rápidos, cabeçalhos em caixa alta, hover interativo, clique para edição e barra completa de paginação.
  - **White-Label & Color Studio Sênior (`WhiteLabelStudio.tsx`)**:
    - Substituição completa de seletores nativos básicos por experiência de estúdio profissional:
      - 6 paletas médicas curadas (Esmeralda, Azul Clínico, Ametista, Sálvia, Coral, Titanium).
      - Motor de harmonização automática calculando cores secundárias e de destaque matematicamente a partir da cor primária.
      - Validador em tempo real de contraste e conformidade WCAG 2.2 AA (relação mínima 4.5:1).
      - Simulador multi-telas em tela dividida com visualização em tempo real do *Dashboard*, da *Tela de Login* e do *App Mobile do Paciente*.
  - **Módulos Clínicos Portados do Projeto Evolva (`src/components/patient/`)**:
    - `BodyMapSVG`: Silhueta anatômica vetorial interativa com os 6 sítios subcutâneos de aplicação GLP-1, rotação automática, pulso no sítio recomendado e destaque do último aplicado.
    - `HydrationWidget`: Marcador radial circular SVG de hidratação, cálculo de $35\text{ ml/kg}$, contador de volume restante e botões rápidos (+250ml, +500ml, -250ml).
    - `NutritionCard`: Proteção de massa magra a $1.4\text{ g/kg}$, balanço calórico diário e colunas detalhadas dos 4 macronutrientes (Proteínas em destaque coral, Carboidratos, Gorduras e Fibras).
    - `WeightCard`: Evolução ponderal com peso inicial, atual e meta, contador de quilos eliminados e barra percentual de progresso.
    - `ActiveMedicationCard`: Monitoramento de caneta/ampola ativa de incretina (Tirzepatida/Semaglutida), conversão de cliques, dosagem em seringa U-100 e contagem regressiva de 30 dias de estabilidade microbiológica.
    - `DayStripSelector`: Carrossel horizontal de dias da semana com marcadores visuais de dose e hidratação diária.
    - `PatientPortal`: Portal do paciente completo integrando todos os componentes clínicos em layout responsivo de 2 colunas.
  - **Refatoração da Gestão de Pacientes (`PatientDirectory.tsx`)**:
    - Adotou `AppTable`, `AppButton`, `AppBadge` e `AppCard` mantendo 100% de fidelidade ao layout do mockup aprovado.

### 📑 Tela de Seleção de Pacientes (100% Fiel à Referência) & Suporte a Edição
- **Frontend Web (`apps/web`)**:
  - **Tela de Seleção de Pacientes (`PatientDirectory.tsx`)**:
    - Tipografia, espaçamentos e hierarquia visual correspondendo estritamente ao mockup fornecido:
      - Fonte oficial **Plus Jakarta Sans** com pesos e tamanhos milimetricamente alinhados (`11px` para badges e rótulos secundários, `28px` no título `Pacientes`, `13px` no subtítulo, `12px` nos títulos de cards e `26px` nos valores métricos).
      - Tag superior `ROTINA CLÍNICA` em cápsula com fundo menta (`#ecfdf5`) e texto verde esmeralda (`#059669`).
      - Botão `+ Novo paciente` com ícone `UserPlus`, cantos arredondados (`0.5rem`) e sombra suave esmeralda.
      - **4 Cards Resumo KPI**:
        - `Total Pacientes` com ícone de usuários em verde menta.
        - `App Conectado` com ícone de smartphone em azul céu.
        - `Com Convênio` com ícone de escudo em lilás/roxo.
        - `Particulares` com ícone de cartão/recibo em âmbar.
      - **Barra de Pesquisa & Filtros**:
        - Card branco independente com ícone `Search` e placeholder *"Buscar paciente por nome, CPF, e-mail ou telefone..."*.
        - Filtro dropdown *"Filtrar: Todos os Pacientes ▾"* (com opções de Ativos, Convênios, Particulares e App Ativo).
      - **Tabela de Dados**:
        - Colunas: `PACIENTE`, `CONTATO`, `CPF`, `CONVÊNIO`, `ACESSO APP`, `AÇÕES`.
        - Linha com avatar em círculo com iniciais, nome em destaque, consultório, contatos com ícones de e-mail e telefone, badge de convênio e badge `🟢 App Ativo`.
        - Coluna de Ações com botão de Lápis (edição) e Lixeira (remoção).
        - **Abertura para Edição**: Clicar na linha do paciente ou no ícone de lápis carrega diretamente a tela de edição do paciente com todos os dados preenchidos.
      - **Rodapé de Paginação**:
        - Exibição de registros *"Exibindo 1-1 de 1 registros"*, seletor de *"Itens por página: 10 ▾"*, e controles de navegação `<<`, `<`, `1`, `>`, `>>`.
  - **Suporte a Edição de Paciente (`NewPatientView.tsx`)**:
    - Suporte aos modos `create` e `edit` com preenchimento reativo de todos os campos a partir do paciente selecionado (`initialPatient`).
    - Campos de sexo de referência para cálculos com nota clínica, sexo atribuído ao nascimento e identidade de gênero opcional.
    - Botão de ação alternando entre `Cadastrar` e `Salvar alterações`.
    - Integração de persistência no backend via `PUT /api/v1/patients/:id` e atualização em tempo real no dashboard.
  - **Higienização de Marca & Identidade Visual**:
    - Remoção absoluta de referências legadas para a marca oficial **Ygeía (Υγεία)** no cabeçalho, sidebar e fluxos de navegação.
- **Frontend Web (`apps/web`)**:
  - **Grid Paginado de Pacientes (`PatientDirectory.tsx`)**:
    - Tela principal do menu `Rotina -> Pacientes` contendo cabeçalho com contagem, busca por nome, CPF e e-mail, filtros de status (*Todos*, *Ativo*, *Inativo*) e exportação.
    - Tabela completa com seleção de linha, avatar com iniciais, CPF, telefone formatado, objetivo clínico, badge de status e ação de acesso direto ao prontuário.
    - Controles de paginação completos (*Anterior*, *Próxima*, seleção de itens por página de 8/15/30 e numeração de páginas).
  - **Tela Integrada de Cadastro de Paciente (`NewPatientView.tsx`)**:
    - Renderizada diretamente na área de trabalho da aplicação com Sidebar e Header preservados, correspondendo com precisão ao layout de `media_1795311187219_22060d3a.jpg`.
    - Badge `PACIENTES`, título, subtítulo, botão `Fechar` no canto superior direito para retorno imediato ao grid.
    - Formulário em 2 colunas com stepper vertical e botões de ação `Cancelar`, `Continuar` e `Cadastrar`.
  - **Conexão Dinâmica no Dashboard (`AdminDashboard.tsx`)**:
    - Transição entre Card 1, Grid Paginado e Formulário de Cadastro via botões `Ver todos os pacientes →` e `+ Cadastrar paciente`.

### 👥 Módulo de Cadastro de Pacientes & Stepper Clínico
- **Frontend Web (`apps/web`)**:
  - **Componente Modal `NewPatientModal.tsx`**:
    - Implementação de fidelidade estrita ao design do mockup `Novo paciente`:
      - **Navegação Lateral por Etapas**: Stepper vertical com 8 etapas: *Dados pessoais* (com indicador visual verde esmeralda e fundo mint), *Tratamento e protocolos*, *Convênio*, *Local de atendimento*, *Foto do paciente*, *Endereço completo*, *Observação importante* e *Atestado e recibo*.
      - **Etapa de Dados Pessoais**:
        - Campo obrigatório de nome completo.
        - Data de nascimento e seleção de sexo de referência para cálculos (com nota orientativa clínica).
        - Seleção de sexo atribuído ao nascimento e identidade de gênero opcional.
        - E-mail e telefone com seletor de DDI (`🇧🇷 +55`) e formatação em tempo real.
        - CPF do paciente, nome e CPF do responsável para menores de idade.
        - Seção de mensagens de boas-vindas com switches interativos para envio automático por e-mail e WhatsApp.
      - **Ações e Atalhos**: Botões `Cancelar` e `Cadastrar`, links de rodapé para importação de prontuários externos e suporte via WhatsApp.
  - **Integração no Painel Administrativo (`AdminDashboard.tsx`)**:
    - Acionamento direto do modal ao clicar no botão `+ Cadastrar paciente` do card principal ou através do menu `Rotina -> Pacientes`.
    - Atualização reativa da lista de pacientes em tela após a confirmação do cadastro.
- **Backend API (`apps/api`) & Banco de Dados**:
  - **Migração SQL `0003_patients_schema.sql`**:
    - Criação da tabela `patients` com suporte completo a dados pessoais, identificação civil, sexo biológico, identidade de gênero, contatos, dados de responsáveis e preferências de notificação.
    - Isolamento multi-tenant obrigatório via PostgreSQL Row-Level Security (`FORCE ROW LEVEL SECURITY`) com a política `tenant_isolation_patients`.
    - Índices otimizados por `tenant_id` com `full_name`, `email` e `cpf`.
  - **Módulo NestJS de Pacientes (`PatientsModule`, `PatientsService`, `PatientsController`)**:
    - Endpoints: `POST /api/v1/patients` para inserção transacional e `GET /api/v1/patients` para busca e listagem filtrada por tenant.

### 🌿 Identidade Visual Oficial Ygeía na Tela de Login & Sistema
- **Frontend Web (`apps/web`)**:
  - **Customização do Nome e Paleta Oficial**:
    - Substituição do nome e textos herdados de mockups externos pelo nome oficial do produto: **Ygeía (Υγεία)** e slogan *"Nutrição Clínica & Governança Metabólica"*.
    - Transição da paleta azul royal para a identidade verde esmeralda / floresta médica do Ygeía:
      - Cor Primária: `#059669` (Verde Esmeralda).
      - Cor Secundária: `#064e3b` (Verde Floresta Profundo).
      - Cor de Destaque: `#10b981` (Menta Vibrante).
    - Gradiente imersivo do painel Hero adaptado para o tom floresta/esmeralda com reflexos em menta.
  - **Aprimoramento de Textos e Placeholders**:
    - Texto explicativo atualizado para o contexto real de Nutricionista, Administrador e Paciente.
    - Placeholder do campo de e-mail atualizado para `admin@ygeia.com.br`.
    - Sanitização e migração transparente de valores legados em `localStorage` para a nova paleta e nome sem requerer limpeza manual de cache.

### 🔌 Reconfiguração e Isolamento das Portas de Desenvolvimento
- **Monorepo & Infraestrutura (`docker-compose.yml`, `apps/api`, `apps/web`, `apps/mobile`)**:
  - **Prevenção de Colisões**: Migração completa das portas padrão para faixas exclusivas e desimpedidas, evitando conflitos com outros projetos locais:
    - **Frontend Web**: Migrado de `5173` para `5190` (`http://localhost:5190`).
    - **Backend API**: Migrado de `3333` para `4333` (`http://localhost:4333`).
    - **Mobile App Metro**: Migrado de `8082` para `8095` (`http://localhost:8095`).
    - **PostgreSQL 16 (Docker)**: Porta externa mapeada de `5434` para `5440` (`localhost:5440`).
    - **Redis 7 (Docker)**: Porta externa mapeada de `6379` para `6385` (`localhost:6385`).
  - **Sincronização de Variáveis de Ambiente & Configurações**:
    - Atualização dos arquivos `.env` e `.env.example` da API e da Web.
    - Criação de `vite.config.ts` com tipagem de variáveis de ambiente em `src/vite-env.d.ts` para conexão com a nova porta da API.

### 🏥 Redesenho Executivo do Painel Administrativo & Menu Lateral Bidirecional
- **Frontend Web (`apps/web`)**:
  - **Novo Menu Lateral Executivo (`Sidebar.tsx`)**:
    - **Expansão e Colapso Bidirecional**:
      - **Horizontal**: Alternância suave entre modo expandido (260px) com labels, subtítulos e badges, e modo compacto (72px) em ícones com tooltips flutuantes instantâneos.
      - **Vertical (Acordeão)**: Menus aninhados para as categorias *Rotina* (Agenda, Pacientes, Daily, Acompanhamentos, Chat, Tarefas) e *Atendimento* (Formulário pré-consulta, Formulário pós-consulta) com setas indicativas de expansão e animação suave.
    - **Identidade Visual e Navegação**: Ícone de squircle com a marca clínica, busca inline (`Buscar no menu...`), seção `GOVERNANÇA & CLÍNICA`, itens diretos (*Gestão de Contas*, *Clube de Vantagens*, *Módulo de Treino*, *Configurações*, *Minha Conta Admin*), indicador de versão (`🟢 Versão v0.58.0`) e card inferior com avatar e botão de logout.
  - **Novo Top Header Executivo (`Header.tsx`)**:
    - Breadcrumb hierárquico com ícone Home, título bold, subtítulo contextual descritivo e badge em pílula translúcida verde *"🛡️ Acesso Administrativo Exclusivo"*.
  - **Dashboard de Pacientes em 2 Cards (`AdminDashboard.tsx`)**:
    - **Card Esquerdo**: Barra de busca de pacientes por nome/chave, listagem de pacientes cadastrados com avatar de iniciais, status ativo, rodapé com contagem total, link *"Ver todos os pacientes →"* e botão primário com ícone *"Cadastrar paciente"*.
    - **Card Direito**: Calendário horizontal da semana com seletor de dias interativo (`D 15`, `S 16`, ..., `S 21`) com botão de novo agendamento rápido `+`, e card de agendamento detalhado com status de confirmação e horário.
    - Respeito integral à cor primária e tipografia configurada no sistema.

### 🎨 Nova Tela de Login Split-Screen com Branding White Label Dinâmico
- **Frontend Web (`apps/web`)**:
  - **Redesenho Completo de `LoginPage.tsx` (Layout 50/50 em 2 Colunas)**:
    - **Coluna Esquerda (Hero Institucional)**: Fundo em gradiente imersivo que consome dinamicamente a paleta de cores (primária, secundária e destaque) configurada no painel de Configurações, badge translúcida *"🛡️ Acesso Seguro"*, headline de controle metabólico de precisão, card de destaque translúcido *"Curva histórica do Peso Inicial até o Peso Atual"* e identificação de software seguro.
    - **Coluna Direita (Formulário Limpo)**: Fundo branco, link de retorno à landing page, campos de entrada com ícones (`Mail` e `Key`), alternador de visibilidade de senha (olho), link *"Esqueci minha senha"* e botão *"Continuar para o Portal"* estilizados com a cor primária configurada.
  - **Módulo de Sincronização de Branding (`branding.ts`)**:
    - Centralização e sincronização reativa entre `SettingsModule`, `AppLayout`, `Sidebar` e `LoginPage` via storage e eventos globais (`ygeia_branding_updated`).
    - Substituição da cor azul estática por renderização adaptativa que respeita as preferências White Label selecionadas pelo nutricionista.

### 🔔 Sistema de Notificações Toast & Tratamento Padronizado de Erros da API
- **Frontend Web (`apps/web`)**:
  - **Motor de Tratamento e Normalização de Erros (`api-error-handler.ts`)**:
    - Parser universal capaz de processar `Response`, `Error`, payloads NestJS `{ statusCode, message, error }` e strings simples.
    - Dicionário semântico com mapeamento completo de status HTTP (400, 401, 403, 404, 409, 422, 429, 500, 502, 503) e tradução de mensagens técnicas para linguagem amigável em português.
    - Suporte a extração de listas detalhadas de validação Zod e detecção de falhas de conexão/rede (`Failed to fetch`).
  - **Sistema de Notificações Toast Reativo (`ToastContext`, `ToastContainer`, `ToastItem`)**:
    - Hook `useToast()` com métodos utilitários `toast.success()`, `toast.error()`, `toast.warning()` e `toast.info()`.
    - Barra de progresso animada com auto-dismiss configurável, pausa ao passar o cursor (`pauseOnHover`), fechamento manual e suporte a subdetalhes expansíveis para múltiplos erros de validação.
    - Contêiner fixo com empilhamento máximo de 4 notificações simultâneas.
    - Integração no `LoginPage` e `SettingsModule`, eliminando `alert()` nativo e banners estáticos fragmentados.

### 🧹 Limpeza Profunda: Eliminação Completa do Modo Demo & Refatorações de UX
- **Backend API (`apps/api`) & Banco de Dados**:
  - Remoção definitiva do seeder automático de dados de demonstração (`seedDefaultData`) que gerava a clínica fictícia `demo-clinica` e os usuários `admin@ygeia.com` e `paciente@ygeia.com`.
  - Remoção do fallback hardcoded para `demo-clinica` no endpoint `GET /api/v1/tenants/branding`, passando a retornar objeto de identidade padrão do sistema com tipagem estrita.
  - Expurgados do banco de dados PostgreSQL (`ygeia_db`) todos os registros da clínica demo e seus usuários atrelados.
- **Frontend Web (`apps/web`)**:
  - **Eliminação de Atalhos e Botões Demo**: Remoção total dos botões de login rápido em 1-clique com credenciais de teste (`handleQuickBrunoDemo`, `handleQuickAdminDemo`, `handleQuickPatientDemo`), divisores visuais e rótulos de demonstração em `LoginPage.tsx`.
  - **Limpeza do Cabeçalho (`Header.tsx`)**: Remoção dos controles de simulação de licenças ativas ("Licenças: Nutri ✓ Treino ✓"), deixando a barra superior limpa e focada exclusivamente no contexto de sessão e perfil do profissional.
  - **Ajuste de Parâmetros**: Atualização de placeholders e textos para consultório real sem referências à clínica demo.

### 🛠️ Configurações, Reformulação de Autenticação & Limpeza de UX
- **Frontend Web (`apps/web`)**:
  - **Módulo Unificado de Configurações (`SettingsModule`)**:
    - Layout em 2 colunas com navegação categorizada e busca em tempo real (`Procurar`).
    - Categorias estruturadas: `CONTA` (Dados pessoais, Senha, 2FA, Idioma, Zona de perigo), `ATENDIMENTO` (Locais, Tratamentos/tags, Google Calendar, Meus links, Secretárias), `DOCUMENTOS E ASSINATURA` (Papel timbrado, Imagem da assinatura, ICP-Brasil, Cartão CNPJ) e `APARÊNCIA` (Personalização White Label, PDF, App do Paciente, Meu menu).
    - Tela de Dados Pessoais com preview da foto do perfil, botão de edição/cancelamento e dados cadastrais do nutricionista (Nome, Email, Telefone, CRN, CPF/CNPJ, Especialidades e Endereço).
  - **Página de Login Dedicada & Fim dos Modais (`LoginPage`)**:
    - Substituição do modal de login flutuante por tela inteira exclusiva para autenticação profissional e de pacientes.
    - Seletor de perfil em abas (`🩺 Área do Nutricionista` e `🍎 Portal do Paciente`) com botões de 1-clique para teste rápido de credenciais.
    - Combo dropdown na Navbar para navegação direta ao login desejado.
  - **Eliminação de Recursos de Teste ("Experimentar" / 14 dias grátis)**:
    - Remoção de formulários de registro público de clínica (modelo privado SaaS B2B) e CTAs de teste gratuito na Navbar, Footer e telas de login.
    - Isolamento de sessão: login obrigatório para acesso aos painéis de admin e paciente, eliminando navegação de retorno à landing page sem logout formal.
  - **Aprimoramentos de Sidebar & Header**:
    - Remoção do prefixo "Módulo" dos menus laterais.
    - Controle retrátil da Sidebar (264px expandido / 72px recolhido) com preservação e restauração visual das descrições.
    - Remoção do seletor manual de papel no Header, mantendo apenas indicador contextual da sessão ativa.

## [0.1.0] - 2026-11-21

### 🏥 Fase 2 (Configuração da Clínica, Perfil do Nutricionista CRN, White Label Studio & Equipe RBAC)
- **Backend API (`apps/api`)**:
  - Migração de banco de dados `0002_tenant_setup_and_team.sql`:
    - Tabela `tenant_settings` para dados cadastrais e fiscais (CNPJ/CPF, razão social, WhatsApp, endereço completo).
    - Tabela `nutritionist_profiles` com validação de registro legal obrigatório perante o CFN (CFN Res. 600/2018), especialidades e flag de Responsável Técnico.
    - Evolução da tabela `tenant_branding` com `dark_logo_url`, `accent_color` e `letterhead_template_url`.
    - Tabela `team_invitations` com tokens criptográficos (SHA-256) de 48h de validade.
    - Imposição e habilitação forçada de **Row-Level Security (RLS)** em todas as novas tabelas com grant para `ygeia_app`.
  - Novos endpoints REST em `TenantsController`:
    - `GET /api/v1/tenants/settings` e `PUT /api/v1/tenants/settings` (dados cadastrais)
    - `GET /api/v1/tenants/profile` e `PUT /api/v1/tenants/profile` (perfil profissional & CRN)
    - `PUT /api/v1/tenants/branding` (atualização de cores, tipografia e logos White Label)
    - `GET /api/v1/tenants/team` e `POST /api/v1/tenants/team/invite` (gestão e convites de equipe)
  - Seeder de demonstração automático na inicialização: clínica `Ygeía Clínica Modelo` (`demo-clinica`) e usuária `admin@ygeia.com` / `senha123456` (`CLINIC_OWNER`).
- **Frontend Web (`apps/web`)**:
  - **Painel Administrativo da Clínica (`AdminDashboard`)**:
    - **White Label Studio**: personalização em tempo real de cores (primária, secundária, destaque), tipografias e logotipos, com pré-visualização ao vivo do timbrado de prescrição e do topo do aplicativo mobile do paciente.
    - **Dados Cadastrais da Clínica**: formulário completo de dados jurídicos (Razão Social, Nome Fantasia, CNPJ, WhatsApp comercial, endereço completo).
    - **Perfil Profissional & CRN**: dados do nutricionista, número do CRN (Res. CFN 600/2018), seleção de região do conselho (CRN-1 a CRN-11), especialidades em tags interativas e mini-bio.
    - **Gestão de Equipe & RBAC**: listagem de colaboradores com seus papéis (`CLINIC_OWNER`, `ADMIN`, `NUTRITIONIST`, `SECRETARY`), aviso de sigilo médico LGPD/CFN (bloqueio de prontuários para secretárias) e gerador de convites com link de ativação copiável.
  - **Modal de Autenticação (`AuthModal`)**:
    - Botão de acesso rápido em 1-clique para teste da clínica modelo (`Dra. Sofia Alencar`).
    - Abas para login e cadastro de nova clínica SaaS.
  - **Simulador Científico Interativo (`@ygeia/domain-core`) Totalmente Reformulado**:
    - **Cálculo de IMC & Classificação OMS**: Avaliação antropométrica instantânea com badge de estado nutricional (Eutrofia, Sobrepeso, Obesidade).
    - **Gasto Energético Total (GET / TDEE)**: Incorporação de fator de atividade física FAO/OMS (1.2 a 1.9).
    - **Objetivo Clínico Prescritivo**: Ajuste de meta calórica para Emagrecimento (-400 kcal), Manutenção ou Hipertrofia (+350 kcal).
    - **Presets Clínicos em 1-Clique**: Botões rápidos para *Hipertrofia* (2.2 g/kg), *Cutting* (2.0 g/kg), *Low Carb* e *Equilibrada*.
    - **Entrada Numérica Direta e Sliders Híbridos**: Permite tanto arrastar controles quanto digitar gramas ou medidas exatas.
    - **Balanço Calórico e Ajuste Automático**: Comparação visual entre VET dos macronutrientes e a Meta Calórica Alvo com botão de ajuste automático em carboidratos.
  - **Arquitetura de Navegação Modular & AppLayout**:
    - `AppLayout`: Layout base com Menu Lateral Esquerdo Retrátil Inteligente (264px expandido / 72px recolhido) e cabeçalho responsivo.
    - `Sidebar` Modular em 4 blocos de governança estrita:
      1. **Cadastros Gerais** (Universal/Sempre Ativo): Pacientes & Alunos CRM, Agenda, Avaliação Física e Cofre de Exames AES-256.
      2. **Nutrição** (Condicionado à Licença): Prescritor Nutricional, Tabela TACO, Biblioteca de Receitas e Suplementação.
      3. **Treinamento** (Condicionado à Licença): Prescritor de Treinos A/B/C/D, Banco de Exercícios, Periodização/1RM e Cardio.
      4. **Configurações** (Universal/Sempre Ativo): White Label Studio, Dados da Empresa, Perfil CRN/CREF e Equipe RBAC.
    - Seletor em tempo real no cabeçalho para alternar entre **Área do Nutricionista / Admin** e **Área do Paciente**, com simulador de licenças modulares (*Nutri*, *Treino* ou *Combo Completo*).
    - `PatientPortal`: Portal do paciente estilo *Apple Health* com anel interativo de hidratação (+250ml/+500ml), timeline de refeições com botões de substituição flexível de alimentos e painel de exames laboratoriais criptografados.
  - Conexão do botão "Entrar / Painel Admin" na Navbar com feedback de usuário logado.
- **Validação Compartilhada (`packages/validation-schemas`)**:
  - Zod schemas para `updateTenantSettingsSchema`, `updateNutritionistProfileSchema`, `updateTenantBrandingSchema`, `inviteTeamMemberSchema` e `registerClinicSchema`.

### 🌐 Plataforma & Monorepo Geral
- **Setup e Governança**:
  - Configuração do Monorepo com **Turborepo** e **pnpm workspaces**.
  - Versão única governada centralmente pelo `package.json` raiz (`"version": "0.1.0"`).
  - Script oficial de sincronização automatizada `scripts/sync-versions.ts` (`pnpm version:sync`).
  - Configuração de **Husky** com hooks `pre-commit` (`pnpm test` automatizado) e `commit-msg` (**Commitlint** com Conventional Commits v1.0.0).
  - Docker Compose local com **PostgreSQL 16** (porta 5434) e **Redis 7** (porta 6379).

### ⚙️ Backend API (`apps/api`)
- **Fase 1 (Multi-Tenancy, IAM, RLS e Autenticação)**:
  - Modelagem relacional e migrations das tabelas `tenants`, `tenant_domains`, `tenant_branding`, `users`, `refresh_tokens` e `audit_logs`.
  - Configuração de **Row-Level Security (RLS)** no PostgreSQL com `current_setting('app.current_tenant_id')`, isolando dados entre clínicas com usuário não-superuser `ygeia_app`.
  - Hashing de senhas com **Argon2id** (64MB memória, 3 iterações) e serviço de tokens JWT com expiração de 15 minutos.
  - Mecanismo de **Refresh Token com rotação automática e detecção de reuso** (revogação de toda a família de sessões em caso de sequestro).
  - Middleware de resolução de Tenant com `AsyncLocalStorage` via header `x-tenant-id` ou Host header (subdomínios e domínios próprios).
  - Endpoints `/api/v1/auth/register-clinic`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/me` e `/api/v1/tenants/branding`.
  - Bateria de testes unitários de segurança passando (Argon2id e JWT Token Service).

### 💻 Frontend Web (`apps/web`)
- **Landing Page Institucional Completa & Mobile-First**:
  - Destaque comercial e técnico das vantagens para clínicas e consultórios:
    - **Exames Laboratoriais Criptografados**: Criptografia de ponta a ponta (AES-256) e URLs pré-assinadas temporárias (15 min).
    - **SaaS 100% White Label**: Domínio próprio (`app.suaclinica.com.br`), cores, logo e PDFs personalizados.
    - **Prontuário CFN & LGPD**: Conformidade com resoluções CFN 306/2003 e 600/2018 com auditoria indelével.
    - **Motor Antropométrico & TMB**: Strategy Pattern ao vivo com Mifflin-St Jeor e Harris-Benedict.
    - **Tabela TACO Oficial & Cardápios**: Integração com TACO (Unicamp) e cálculo em tempo real.
    - **App Mobile React Native Offline-First**: Diário fotográfico, água e biometria nativa.
    - **Segurança de Nível Bancário**: PostgreSQL RLS, Argon2id e Cookies HttpOnly.
  - **Simulador Científico Interativo** embutido, executando cálculos ao vivo no navegador com `@ygeia/domain-core`.
  - Preview interativo do aplicativo móvel do paciente.
- Setup inicial da aplicação em **React 19** com **Vite** e TypeScript 5.x.
- Diretrizes estritas de **Mobile-First Responsive Design** e consumo dos design tokens White Label.
- Arquivo de configuração `.env.example`, `index.html`, `src/main.tsx` e `README.md` com instruções completas e changelog embutido.

### 📱 Aplicativo Mobile (`apps/mobile`)
- Setup inicial do app nativo em **React Native** com **Expo CNG** (Continuous Native Generation) e TypeScript.
- Configuração do `app.json` sincronizado com a versão central do Monorepo via script.
- Estrutura para `expo-secure-store`, `expo-local-authentication` (Face ID/Touch ID) e persistência offline com MMKV.
- Arquivo `README.md` com instruções de execução e changelog embutido.

### 🧠 Domínio Puro (`packages/domain-core`)
- Value Object `Macronutrients` com cálculo de VET e proporções calóricas (100% testado).
- Strategy Pattern para cálculo de Gasto Energético (TMB): `MifflinStJeorStrategy` e `HarrisBenedictStrategy` (100% testado).
- Zero acoplamento com frameworks ou banco de dados (Clean Architecture).

### 📐 Esquemas de Validação (`packages/validation-schemas`)
- Esquemas de validação Zod compartilhados: `loginSchema` e `createPatientSchema`.
- Inferência estrita de tipos TypeScript consumidos por Back, Web e Mobile.

### 📚 Documentação & Regras (`docs/`)
- **Evolução do Roadmap SaaS (Fase 2 Antecipada)**:
  - Inserção da **Fase 2: Configuração da Clínica, Perfil do Nutricionista (CRN), White Label Studio & Equipe (RBAC)** antes da gestão de pacientes.
  - Especificação das regras de negócio do onboarding SaaS: dados cadastrais (CNPJ/CPF, WhatsApp), exigência de CRN ativo (Res. CFN nº 600/2018), White Label Studio (contraste WCAG 2.2 AA) e matriz de permissões RBAC com sigilo médico para recepcionistas.
- Criação da central de documentação em `docs/`:
  - `docs/arquitetura/DOCS_ARQUITETURA_YGEIA.md` (Estudo arquitetural completo, DDD, Hexagonal, OWASP e Roadmap).
  - `docs/regras/fluxo-desenvolvimento.md` (Pipeline de 6 fases: Plano > Autorização > Desenvolvimento > Testes > Versionamento > Publicação).
  - `docs/regras/regras-negocio.md` (SaaS White Label, prontuário, resoluções CFN e conformidade LGPD).
  - `docs/regras/seguranca-apis.md` (Defense in depth, Postgres RLS, Argon2id, JWT rotation, Cookies HttpOnly).
  - `docs/regras/padroes-mobile-web.md` (Mobile-First 48px, thumb zone, offline-first e biometria).
  - `docs/regras/versionamento-governanca.md` (Governança SemVer, sync automatizado e regras de commit).
