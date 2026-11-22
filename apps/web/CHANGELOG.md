# Changelog - @ygeia/web

Todas as alterações da aplicação Web React serão registradas aqui.
Este projeto segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [Unreleased] - 2026-11-22

### Modificado
- **Alinhamento de UX/UI para Abordagem Dual Adaptativa (Clínico Geral & Alta Performance)**:
  - Atualização dos padrões de design da aplicação web para atender tanto o público convencional (reeducação, emagrecimento saudável, dislipidemias, sem atrito ou jargões assustadores) quanto praticantes de exercícios e atletas de rendimento (g/kg/dia, nutrient timing e antropometria avançada).
  - Especificação do seletor de perfil e visualização adaptativa no prontuário do paciente.

### Adicionado
- **Acessibilidade a11y & Otimização de Performance Front-End Sênior (`AppInput.tsx`, `AppSelect.tsx`, `AppTextarea.tsx`, `vite.config.ts`)**:
  - Integração do hook `useId()` nos componentes `AppInput`, `AppSelect` e `AppTextarea` para conexão semântica estrita entre `<label htmlFor>` e elementos de formulário, melhorando toque em dispositivos móveis e suporte a tecnologias assistivas (WCAG 2.1 AA).
  - Adição de `aria-invalid`, `aria-required` e IDs de `aria-describedby` para exibição de erros e orientações.
  - Otimização do empacotamento Vite com divisão de chunks (`vendor-react`, `vendor-icons`), reduzindo o tamanho monolítico do bundle e acelerando o carregamento da aplicação.


### Adicionado
- **Componentes Padronizados `AppSelect` e `AppTextarea` (`apps/web/src/components/ui/`)**:
  - Implementação de `AppSelect.tsx` com altura rigorosa de 38px, borda de 0.5rem, tipografia de 13px, ícone chevron integrado e foco reativo conectado a `var(--primary)` e `var(--primary-light)`.
  - Implementação de `AppTextarea.tsx` para notas e evoluções clínicas com raio de borda e foco padronizados.
  - Exportação oficial de ambos no barrel `components/ui/index.ts`.

### Modificado
- **Harmonização Visual de Telas e Modais de Pacientes (`PatientProfileView.tsx`, `NewPatientModal.tsx`, `PatientDirectory.tsx`)**:
  - Substituição de inputs e selects nativos avulsos pelos novos componentes `AppInput`, `AppSelect` e `AppTextarea` nos modais de **Recordatório Alimentar**, **Prontuário** e **Restrições Alimentares**.
  - Padronização da barra de busca e dos filtros de motivo e situação com altura de 38px e anel de foco suave na cor primária.
  - Harmonização de seletores nos formulários de cadastro de paciente e painel administrativo.
- **Fidelidade da Marca Registrada SVG (`YgeiaLogo.tsx`, `public/ygeia-logo.svg`)**:
  - Atualização da linha de pulso cardíaco (ECG) para o tom verde menta `#7eedd6` / `var(--primary-light)`, correspondendo com exatidão à imagem de marca do Ygeía.


### Modificado
- **Otimização de Espaçamento e Tipografia no Menu Lateral do Paciente (`PatientProfileView.tsx`)**:
  - Redução da altura/padding entre categorias e subitens no menu lateral clínico do prontuário.
  - Diminuição proporcional do tamanho da fonte dos itens para `0.75rem` e `0.71875rem`, proporcionando visualização mais compacta e eficiente.

### Adicionado
- **Módulos de Avaliação Nutricional: Anamnese, Recordatório, Prontuário e Restrições Alimentares (`PatientProfileView.tsx`)**:
  - Ajuste no menu lateral renomeando *"Anamnese e transcrição"* para exclusivamente *"Anamnese"*.
  - Integração do padrão `ClinicalDataGrid` para a seção de **Recordatório Alimentar**, permitindo múltiplos inquéritos por paciente com persistência em `localStorage` e modal de inserção/edição.
  - Integração do padrão `ClinicalDataGrid` para a seção de **Prontuário**, viabilizando múltiplos registros de evolução clínica, anotações de conduta e retornos.
  - Implementação da **Grade de Restrições Alimentares**:
    - Colunas: Alimento ou Substância, Tipo / Motivo, Situação, Origem, Observação e Ações Rápidas.
    - Badges coloridos por motivo (*Alergia* em vermelho, *Intolerância* em laranja, *Não Gosta* em roxo, *Outra restrição* em cinza).
    - Modal de cadastro com validação obrigatória dos campos *Alimento* e *Motivo*, além do texto orientativo *"Se a restrição depende do preparo, inclua essa informação no nome"*.
    - Persistência reativa no `localStorage` por paciente (`ygeia_restrictions_${patientId}`).

### Modificado
- **Simplificação e Otimização da Grade de Anamneses (`ClinicalDataGrid.tsx`, `PatientProfileView.tsx`)**:
  - Remoção da coluna de texto *"Principais Queixas & Objetivos"* e das *"Tags Clínicas"*, conforme diretriz de usabilidade.
  - Grade centralizada na coluna *"Data da Consulta"* (com ícone temático, título do encontro, selo de modelo/template e intervalo relativo) e na coluna de *"Ações Rápidas"* (visualizar/editar no editor Word, download de PDF, comparar evolução e exclusão com diálogo protetivo).
  - Limpeza dos dados no perfil do paciente para carregamento instantâneo.

### Adicionado
- **Logotipo Vetorial SVG e Marca Registrada Oficial Ygeía (`YgeiaLogo.tsx`, `Sidebar.tsx`, `Navbar.tsx`, `LoginPage.tsx`)**:
  - Vetorização pura em SVG da marca oficial: composição com folhas botânicas (nutrição), escudo anatômico (segurança clínica) e linha de pulso vital / cardiograma (saúde/longevidade).
  - Totalmente customizável em cores via props (`color`, `secondaryColor`, `pulseColor`, `inverted`) e integrado às variáveis CSS dinâmicas (`var(--primary)`, `var(--primary-hover)`).
  - Três modos de exibição: `icon` (apenas o símbolo), `badge` (botão com container e sombra) e `full` (lockup completo com o nome "YGEÍA").
  - Substituição de marcadores genéricos na barra lateral (`Sidebar.tsx`), no cabeçalho institucional (`Navbar.tsx`), na tela de login (`LoginPage.tsx`) e definição como favicon oficial em `index.html` e `public/ygeia-logo.svg`.

### Adicionado
- **Padrão de Grade Clínica de Dados e Redesign UX da Grade de Anamneses (`ClinicalDataGrid.tsx`, `PatientProfileView.tsx`)**:
  - Implementação do componente de alto nível `ClinicalDataGrid`, estabelecendo o novo padrão de UX/UI para visualização longitudinal de dados de prontuário (projetado para ser reutilizado em antropometria, exames e recordatórios).
  - **KPI Cards Strip**: Faixa de resumo clínico no topo calculando automaticamente total de consultas, primeira consulta, data e intervalo relativo do último retorno e frequência média de acompanhamento.
  - **Controles de Busca e Filtro**: Busca instantânea textual, filtro por modelo/template de anamnese e ordenação cronológica (mais recentes / mais antigas).
  - **Visualização Dual (Tabela vs. Linha do Tempo)**:
    - Modo Tabela (`Tabela Lista`): Visão densa com scanner rápido, tags clínicas coloridas e coluna de ações fixada à direita (`sticky`) com sombra para máxima usabilidade.
    - Modo Linha do Tempo (`Cards Cronológicos`): Apresentação em timeline vertical com conectores visuais, extrato da queixa principal e badges de tópicos de saúde.
  - **Ações e Modal de Confirmação**: Ações rápidas para editar (abre o editor estilo Word), gerar PDF individual, comparar evolução clínica com consultas anteriores e exclusão com modal de confirmação defensivo.
  - **Paginação Completa**: Integração com `DataTablePagination` para controle ágil do volume de prontuários.
  - Mapeamento reativo em `PatientProfileView` enriquecendo cada anamnese com prévia e tags inteligentes de saúde (*Bristol*, *Sono*, *Hidratação*, *Treino*, etc.).
  - Exportação oficial do componente em `components/ui/index.ts`.

### Adicionado
- **Editor de Anamnese Padrão Microsoft Word / Google Docs (`AnamneseEditor.tsx`)**:
  - Transformação completa do editor de anamnese para uma experiência de processador de texto Word-Class.
  - Visual em folha de documento A4 com proporção realista (`820px`), padding de página de 3.5rem x 4rem, cantos refinados e sombra de papel sobre mesa de trabalho cinza.
  - Cabeçalho timbrado de prontuário com dados do paciente, idade, data e identificador do prontuário.
  - Barra de ferramentas Ribbon completa: Undo/Redo, Limpeza de formatação, Seletor de fontes (Inter, Arial, Calibri, Times New Roman, Georgia, Roboto, Courier New), Tamanhos (10pt a 32pt), Estilos H1/H2/H3/P/Quote, Negrito, Itálico, Sublinhado, Tachado, Subscrito, Sobrescrito, Cores de texto e Realce com paleta do Word, Alinhamento (Esquerda, Centro, Direita, Justificado), Listas com marcadores/numeradas, Indentação, Espaçamento de linhas (1.0 a 2.0), Tabela formatada, Linha horizontal, Inserção de data/hora e Escalas clínicas (Bristol, Sono, EVA).
  - Barra de status inferior no rodapé com contadores em tempo real de palavras e caracteres, indicador de sincronização e seletor de Zoom (70% a 150%).
  - Modo tela cheia / foco e impressão nativa com suporte a exportação para PDF (`window.print()`).

### Corrigido
- **Persistência e Correção no Salvamento de Edições de Paciente (`AdminDashboard.tsx`, `NewPatientView.tsx`, `PatientDirectory.tsx`)**:
  - Resolução do problema em que salvar alterações no cadastro de paciente não gravava os campos editados.
  - Correção no mapeamento de propriedades em `onPatientUpdated`: o campo `goal` estava incorretamente vinculado a `updatedP.protocolNotes`, sendo ajustado para `updatedP.goal || updatedP.objective || p.goal`.
  - Normalização e sincronização bidirecional de `name`/`fullName`, `gender`/`sex`, além de preservação do objeto aninhado `address`.
  - Criação de armazenamento persistente com `localStorage.getItem('ygeia_patients_list')` e função utilitária `savePatients()`, garantindo que inserções, alterações e exclusões de pacientes persistam após recarregamento de página (F5) ou troca de rotas.
  - Sincronização em tempo real de `selectedPatientForView` para atualizar o prontuário (`PatientProfileView`) imediatamente quando a edição for iniciada a partir do perfil do paciente.
  - Adição de `key` dinâmica no `<NewPatientView>` e hook reativo `useEffect` para forçar remontagem e reinicialização completa dos campos do formulário ao alternar entre pacientes.
  - Inclusão de botão primário de *"Salvar alterações"* / *"Cadastrar paciente"* no cabeçalho superior do wizard, permitindo salvar os dados a qualquer momento de qualquer etapa, bem como botões de salvamento em todas as etapas intermediárias (Etapas 2 a 7).
  - Sincronização em segundo plano com a API (`POST /api/v1/patients`, `PUT /api/v1/patients/:id` e `DELETE /api/v1/patients/:id`) com suporte a token JWT.

### Adicionado
- **Matriz de Segurança Web e Mitigações Anti-Invasão (`SECURITY.md`, `README.md`)**:
  - Formalização dos requisitos de Content-Security-Policy (CSP), `frame-ancestors: 'none'`, sanitização de HTML clínico no editor contra Stored XSS e isolamento de credenciais com HttpOnly Cookies no `SECURITY.md`.

### Modificado
- **Aprimoramentos de Layout e Navegação no Menu Principal (`Sidebar.tsx`, `Header.tsx`)**:
  - Trava rígida de proporção no container do logotipo (`34px x 34px`, `aspectRatio: 1 / 1`, `flexShrink: 0`) para eliminar qualquer esmagamento ou distorção visual durante transições de largura.
  - Correção na orientação da seta retrátil horizontal: apontando à esquerda (`ChevronLeft`, "Recolher Menu") quando aberto e virando para a direita (`ChevronRight`, "Expandir Menu") quando fechado.
  - Redução do tamanho da fonte do título do logotipo para `0.8125rem` (13px).
  - Exibição de ícones dedicados para todos os subitens de menu em *Cadastros*, *Nutrição* e *Treinamento*, mantendo-os totalmente clicáveis e com tooltips explicativos mesmo quando o menu estiver recolhido.

### Modificado
- **Editor Unificado de Anamnese em Documento Contínuo (`AnamneseEditor.tsx`)**:
  - Conversão do formulário de múltiplas caixas de texto em um editor de texto clínico contínuo e fluído (`contentEditable`), onde os tópicos clínicos (*Queixa principal e objetivo*, *História clínica e medicamentos*, *Hábito intestinal*, *Hidratação*, *Rotina alimentar* e *Sono e atividade física*) são carregados diretamente como títulos para digitação livre logo abaixo pelo profissional.
  - Remoção da aba de transcrição de voz e microfone da tela de anamneses.
  - Sincronização inteligente dos dados ao salvar, mantendo tanto o HTML integral quanto o mapeamento das seções para total retrocompatibilidade e exportações em PDF.
- **Remoção do Botão de Inteligência Artificial no Grid de Anamnese (`PatientProfileView.tsx`)**:
  - Remoção do botão de análise com IA (`Wand2`) nas ações do histórico de anamneses do paciente.

### Corrigido
- **Eliminação de Exceção e Tela Branca ao Criar Anamnese (`PatientProfileView.tsx`, `AnamneseEditor.tsx`)**:
  - Correção da ordem dos React Hooks no `PatientProfileView`: o `if (isEditingAnamnese)` retornava antes da declaração de `filteredMenuGroups = useMemo(...)`, violando as Regras dos Hooks do React (`Rendered fewer hooks than expected`) e causando o desmonte da tela ao clicar em "+ Adicionar anamnese" ou em itens do grid.
  - Reorganização de todas as chamadas de hooks para serem executadas incondicionalmente no topo do componente antes de qualquer saída de renderização.
  - Adição de fallbacks e encadeamento nulo seguro (`(sections?.campo || '').length` e `sections?.campo || ''`) nas 6 seções clínicas do `AnamneseEditor`.

### Modificado
- **Botão Único "+ Adicionar anamnese" (`PatientProfileView.tsx`)**:
  - Conversão do botão dividido com dropdown para um botão de ação única e direta, removendo o seletor com chevron e as opções internas conforme solicitado.
  - Ao clicar, o sistema abre imediatamente o formulário de anamnese estruturado pronto para preenchimento.

### Corrigido
- **Formatação de Telefones no Grid e na Exibição de Pacientes (`PatientDirectory.tsx`, `countryDialCodes.tsx`, `AdminDashboard.tsx`)**:
  - Implementação da função utilitária `formatPhoneDisplay` para garantir que telefones salvos no banco de dados (sejam eles gravados com código DDI internacional `+55`, com máscara ou em dígitos brutos como `19992922054`) sejam sempre exibidos formatados no grid de pacientes (`(19) 99292-2054` ou `+55 (19) 99292-2054`).
  - Atualização do filtro de busca no diretório de pacientes para permitir busca tanto por dígitos numéricos quanto por telefone formatado.

### Corrigido
- **Tela em Branco e Carregamento no Grid e Editor de Anamneses (`AnamneseEditor.tsx`, `PatientProfileView.tsx`)**:
  - Eliminação da falha que causava visualização em branco ao clicar nas linhas do grid de anamneses ou no botão de adicionar nova anamnese.
  - Implementação de cards bem definidos com bordas sutis (`#e2e8f0`), foco em `var(--primary)`, contagem de caracteres e áreas de digitação confortáveis para as 6 seções clínicas (*Queixa principal e objetivo*, *História clínica e medicamentos*, *Hábito intestinal*, *Hidratação*, *Rotina alimentar* e *Sono e atividade física*).
  - Garantia de que novas anamneses com o modelo *Seções padrão* sejam pré-preenchidas com dados clínicos recomendados, e que anamneses anteriores de formatos legados sejam migradas e exibidas sem perda ou campos vazios.
  - Inclusão do `AnamneseErrorBoundary` para blindar o editor contra erros de renderização em tempo de execução.
  - Toda a extensão da linha no grid agora é clicável para abrir a edição, com destaque no hover e separação estrita de eventos (`stopPropagation`) para os botões de ações rápidas.

### Removido
- **Itens e Módulos do Menu Principal (`Sidebar.tsx`, `AdminDashboard.tsx`)**:
  - Remoção dos módulos diretos: *Clube de Vantagens*, *Minha Conta Admin* e *Gestão de Contas*.
  - Remoção dos grupos verticais: *Atendimento* (Formulário pré-consulta e pós-consulta) e *Rotina* (Agenda, Daily, Acompanhamentos, Chat com pacientes, Tarefas).
  - Remoção dos subitens de *Cadastros*: *Alimentos (TACO)*, *Suplementos & Doses*, *Modelos de Prescrição* e *Locais de Atendimento*.
  - O menu principal agora fica focado e enxuto com: *Dashboard de Pacientes*, *Cadastros (Pacientes)*, *Nutrição*, *Treinamento* e *Configurações*.

### Corrigido
- **Carregamento, Sincronização e Persistência de Anamneses (`AnamneseEditor.tsx`, `PatientProfileView.tsx`, `AdminDashboard.tsx`)**:
  - Correção no carregamento dos dados da anamnese no editor: agora o `AnamneseEditor` sincroniza reativamente via `useEffect` sempre que uma anamnese for aberta para edição ou quando uma nova for iniciada.
  - Implementação de persistência local por paciente no `localStorage` (`ygeia_anamneses_${patientId}`), assegurando que anamneses criadas, modificadas ou removidas não se percam ao navegar ou recarregar a tela.
  - Suporte a templates clínicos adicionais no seletor de modelos (*Anamnese Infantil*, *Saúde Gastrointestinal*, *Anamnese Esportiva*, *Seções padrão* e *Anamnese em Branco*).
  - Tratamento completo de null-safety para nomes, iniciais, telefones e cálculo da chave de identificação do paciente (`patientKey`).
  - Adição de dropdown de modelos ao botão `+ Adicionar anamnese ⌄` no cabeçalho do módulo.
  - Adição de `key={selectedPatientForView.id}` na renderização de `PatientProfileView` no `AdminDashboard` para prevenir retenção de estado entre pacientes distintos.
  - Adição do botão de visualização com olho (`Eye`) nas linhas de pacientes no card da tela inicial `dashboard_pacientes`.

### Adicionado
- **Grid de Anamneses Múltiplas com 6 Ações por Linha (`PatientProfileView.tsx`)**:
  - Implementação das linhas de anamneses preenchidas idênticas à imagem de referência:
    - Linha com texto *Anamnese criada em [Data]* e divisória sutil.
    - Conjunto de 6 botões de ação: Assistente IA (roxo), Calendário, Download PDF, Comparar evolução, Editar e Excluir.
- **Tela de Preenchimento de Anamnese & Gestão de Múltiplas Anamneses (`AnamneseEditor.tsx`, `PatientProfileView.tsx`)**:
  - Implementação da tela de preenchimento exibida ao clicar em "+ Adicionar anamnese", idêntica à imagem de referência:
    - Top bar com dados do paciente, toggle switch de "Sugestões", botão "Ver tutorial" e botão "Salvar dados" com tema dinâmico.
    - Alternador de abas "Anamnese" e "Transcrição" (com gravação por voz) e dropdown de modelos ("Seções padrão").
    - Barra de ferramentas rica com pill "H3 Título 3", botões de formatação e menu dropdown de "Escalas" clínicas.
    - Seções padrão do canvas clínico: Queixa principal e objetivo, História clínica e medicamentos, Hábito intestinal, Hidratação, Rotina alimentar e Sono e atividade física.
    - Suporte a múltiplas anamneses por paciente com visualização, edição, exclusão e resumo dos dados.

### Removido
- **Itens de Menu na Ficha do Paciente (`PatientProfileView.tsx`)**:
  - Remoção dos menus e páginas *"Perfil nutricional integrado"* e *"Teia de interconexões"*, tornando o menu de avaliação nutricional mais conciso e focado nas rotinas práticas de consulta.

### Modificado
- **Aplicação Completa do Tema Dinâmico em Telas Novas e Existentes (`PatientProfileView.tsx`, `NewPatientModal.tsx`, `NewPatientView.tsx`, `SettingsModule.tsx`)**:
  - Auditoria e remoção de todas as cores de marca estáticas (`#10b981`, `#059669`, `#ecfdf5`, etc.), substituindo por tokens do tema dinâmico (`var(--primary)`, `var(--primary-hover)`, `var(--primary-light)`, `var(--primary-border)`, `var(--primary-glow)`).
  - A nova tela de visualização clínica do paciente (`PatientProfileView.tsx`) e os formulários de cadastro e configurações agora respondem dinamicamente e com precisão a qualquer personalização de cores do White Label da clínica.
- **Layout Clínico 1:1 DietSystem ao Visualizar Paciente (`PatientProfileView.tsx`)**:
  - Implementação da tela exatamente conforme a imagem de referência do DietSystem:
    - Top bar com dados do paciente (nome, idade em anos e meses, chave com cópia, status `• ATIVO`, botões `Financeiro`, `Linha do tempo` e menu `...`).
    - Menu lateral esquerdo completo com busca de seções e 9 módulos clínicos colapsáveis (Avaliação nutricional, Antropometria, Prescrição dietética, Avaliação bioquímica, Pós-consulta, Arquivos do paciente, etc.) com botões `+` e badges `Novidade`.
    - Painel direito de `Anamneses e transcrições` com botões `PDF unificado` e `+ Adicionar anamnese ⌄`, e empty state com ícone de pasta minimalista cinza.
- **Ícone de Visualização no Grid de Pacientes (`PatientDirectory.tsx`)**:
  - Inclusão do botão de ação com ícone de olho (`Eye` do Lucide), posicionado imediatamente antes do botão de editar (lápis) na coluna de ações da tabela.
  - Estilização em cartão suave (`#ffffff`, borda `#e2e8f0`, raio de curvatura `0.375rem`), com feedback de foco e hover.
- **Tela Completa de Visualização do Paciente — Padrão DietSystem (`PatientProfileView.tsx`, `AdminDashboard.tsx`)**:
  - Implementação da tela completa de visualização e gestão clínica de paciente construída conforme a arquitetura da plataforma DietSystem (`https://my.dietsystem.com.br/patients/1000001851`):
    - **Hero Card**: Foto/iniciais, nome, status, idade, sexo biológico, convênio, objetivo nutricional em destaque, tags e patologias.
    - **Atalhos Diretos**: Abertura direta do WhatsApp do paciente (`wa.me`), botão "Iniciar Consulta", "Editar Cadastro" e exclusão com modal de confirmação.
    - **Cards de Métricas Clínicas**: Peso atual, evolução, IMC, % de gordura corporal e meta calórica diária.
    - **Abas de Conteúdo**:
      - `Prontuário & Linha do Tempo`: Histórico cronológico e adição rápida de evolução clínica com persistência no prontuário.
      - `Dados Cadastrais & Contato`: Identificação, contato com bandeiras e máscaras internacionais, responsável legal (se menor de idade), endereço e convênio.
      - `Plano Alimentar & Prescrição`: Macronutrientes diários (gramas e porcentagens), detalhamento de refeições com horários e itens, e compartilhamento via WhatsApp e PDF.
      - `Avaliação Antropométrica`: Medidas, índices calculados e dobras cutâneas (Pollock 7 dobras).
      - `Anamnese & Hábitos`: Queixa principal, histórico patológico familiar, rotina e hábitos de vida.
      - `Exames & Documentos`: Tabela com biomarcadores de exames de sangue e faixas de referência ideais.
- **Formatação Dinâmica de Telefone por País / DDI (`countryDialCodes.tsx`, `NewPatientView.tsx`, `NewPatientModal.tsx`)**:
  - Regras de formatação, placeholders e limites de dígitos específicos para cada um dos 37 países suportados (ex: EUA, Portugal, Espanha, Reino Unido, França, etc.).
  - Ao selecionar ou trocar de país, o placeholder e a máscara se adaptam imediatamente, reformatando qualquer número já digitado.

### Adicionado / Corrigido
- **Bandeiras Gráficas para Todos os Prefixos Internacionais (`countryDialCodes.tsx`, `NewPatientView.tsx`, `NewPatientModal.tsx`)**:
  - Implementação de renderização gráfica nítida de bandeiras para **todos os prefixos/países** cadastrados (não apenas Brasil), funcionando perfeitamente em Windows e navegadores modernos.
  - Seletor de DDI com busca instantânea e bandeiras de alta resolução integrado ao modal e à tela completa de cadastro de pacientes.

### Modificado
- **Design Unificado do Campo de Telefone (`NewPatientView.tsx`, `NewPatientModal.tsx`)**:
  - Implementação do design unificado `[ 🇧🇷 +55 ⌄ | (00) 00000-0000 ]`:
    - Container único com borda suave, foco integrado e cantos arredondados.
    - Botão de DDI à esquerda com bandeira vetorial nítida e divisor vertical.
    - Input de telefone transparente com placeholder `(00) 00000-0000`.

### Removido
- **Links e Textos de Apoio no Rodapé (`NewPatientView.tsx`, `NewPatientModal.tsx`)**:
  - Remoção de *"Vindo de outro software? Clique aqui para importar"* e *"Se precisar de ajuda, clique aqui 💬"*, proporcionando um encerramento mais limpo e desobstruído no cadastro de pacientes.

### Corrigido
- **Ajuste Pixel-Perfect na Tela de Configurações (`SettingsModule.tsx`, `styles.css`)**:
  - Correção no breakpoint responsivo de `.ygeia-settings-layout`, mantendo a visualização em 2 colunas lado a lado a partir de `768px`.
  - Remoção de badge verde em `CONFIGURAÇÃO`, aplicando o formato original em texto simples caixa alta com tracking.
  - Ícone de `Idioma` atualizado para `Languages` (`文A`).
  - Alinhamento de cores e tipografia dos botões e linhas de `IDENTIFICAÇÃO` e `ENDEREÇO` para match 1:1 com a imagem de referência.

### Modificado
- **Opções Restritas em Sexo de Referência para Cálculos (`NewPatientView.tsx`)**:
  - Removida a opção genérica, mantendo estritamente as opções **Feminino** e **Masculino** necessárias para os cálculos metabólicos e faixas de referência clínica.

### Corrigido
- **Restauração Fiel do Layout da Tela de Configurações (`SettingsModule.tsx`, `styles.css`)**:
  - Correção da estrutura visual e de layout que havia encapsulado indevidamente a navegação dentro de um único container branco.
  - Implementação do layout idêntico à imagem de referência do Better Health:
    - Sidebar de navegação aberta com grupos `CONTA`, `ATENDIMENTO`, `DOCUMENTOS E ASSINATURA` e `APARÊNCIA`, além da busca de ajustes.
    - Card principal de conteúdo com design de dados pessoais estruturado: bloco de foto em container tracejado, seções em linhas `IDENTIFICAÇÃO` e `ENDEREÇO`.
    - Alternância suave entre modo leitura e edição via botão `Editar`.

### Adicionado
- **Melhorias Visuais e Funcionais no Cadastro de Pacientes (`NewPatientView.tsx`, `styles.css`)**:
  - **Telefone com Seletor de DDI e Bandeirinhas**: Seletor modal/popover com 37 países, bandeiras emoji, busca instantânea e fechamento ao clicar fora.
  - **Componentes Combobox Modernos (`.ygeia-select`)**: Substituição de selects nativos rígidos por comboboxes estilizados com seta SVG, transição suave e foco com `--primary-glow`.
  - **Aba de Tratamento e Protocolos Expandida**:
    - Combobox de Objetivo Principal com as opções: *Emagrecimento*, *Hipertrofia*, *Manutenção*, *Performance Esportiva*, *Reeducação Alimentar* e *Saúde Digestiva*.
    - Campo dinâmico de Tags com inclusão via botão ou tecla Enter e badges com botão `X` de exclusão.
    - Campo dinâmico de Patologias com inclusão via botão ou tecla Enter e badges clínicos com botão `X` de exclusão.
  - **Card de Responsável Legal**: Encapsulamento em cartão visual com título, campos de nome e CPF com máscara e aviso de emissão de recibo para menores.
  - **Validação e Textos de Apoio em Sexo de Referência**: Título obrigatório `Sexo de referência para cálculos *` e texto explicativo clínico abaixo do combo.
  - **Placeholders**: Data de nascimento em `DD/MM/YYYY` e CPF em `000.000.000-00`.

### Modificado
- **Tipografia Compacta e Densidade Visual Idêntica ao Better Health (`PatientDirectory.tsx`, `AppTable.tsx`, `DataTablePagination.tsx`)**:
  - Calibragem tipográfica milimétrica na tabela de pacientes para corresponder com o Better Health:
    - Cabeçalhos (`th`): `fontSize: 0.6875rem` (11px), `fontWeight: 600`, tracking `0.05em`, padding `0.75rem 1.25rem`.
    - Nome do paciente: `fontSize: 0.8125rem` (13px), `fontWeight: 600`.
    - Subtítulo de localização: `fontSize: 0.6875rem` (11px).
    - Avatar circular com iniciais: `36px` com tipografia em `0.75rem`.
    - Linhas de contato (e-mail e telefone) e CPF: `fontSize: 0.75rem` (12px) com ícones em `12px`.
    - Badges de Convênio e Acesso App: `fontSize: 0.6875rem` (11px) com padding compacto `0.2rem 0.55rem`.
    - Padding vertical das células da tabela (`td`): Reduzido de `1rem` para `0.625rem 1.25rem` (10px vertical), alinhando a densidade de linhas.
    - Botões de ações de edição e exclusão: Ícones em `14px`, padding `0.35rem` e coluna sticky ajustada para `90px`.
    - Cards de KPIs superiores: Números de destaque ajustados para `1.375rem` (22px) com padding `1rem 1.25rem`.
    - Paginação (`DataTablePagination.tsx`): Padding enxuto de `0.625rem 1.25rem`, botões de página em `24px` e ícones `14px`.
    - Grid genérico (`AppTable.tsx`): Sincronizado para manter a mesma harmonia visual em todas as tabelas do sistema.

### Corrigido
- **Responsividade e Fixação da Coluna de Ações na Tabela de Pacientes (`PatientDirectory.tsx`, `AppTable.tsx`)**:
  - Correção do corte e compressão da coluna de Ações em telas menores e dispositivos móveis.
  - Implementação de `minWidth: 850px` na tabela com contêiner `overflow-x: auto` e rolagem touch.
  - Coluna de Ações configurada com posição fixa *sticky right* (`position: sticky; right: 0`) com transição suave de cor no hover e largura dedicada de 110px.
  - Ajuste do espaçamento do contêiner em `AdminDashboard.tsx` para evitar compressão lateral de grids.

### Adicionado
- **Arquitetura Mobile First Obrigatória em Telas e Componentes**:
  - `styles.css`: Novas classes utilitárias responsivas (`touch-target` com altura mínima 44px, `.ygeia-mobile-backdrop`, `.ygeia-sidebar-drawer`, `.ygeia-wizard-container`, `.ygeia-wizard-stepper`, `.ygeia-settings-container`, `.ygeia-settings-nav`, `.ygeia-grid-1-2`, `.ygeia-grid-1-3`, `.ygeia-grid-metrics`).
  - `Header.tsx`: Botão hamburger de menu mobile e ajuste elástico de cabeçalho com breadcrumbs.
  - `AppLayout.tsx`: Orquestração do drawer mobile e camada de backdrop com bloqueio de clique externo.
  - `Sidebar.tsx`: Gaveta deslizante off-canvas no mobile (< 1024px) com fechamento automático no toque e botão `X`.
  - `NewPatientView.tsx`: Fita horizontal touch no stepper mobile e agrupamento elástico em colunas fluidas.
  - `PatientDirectory.tsx`: Grid métrico responsivo adaptado de 1 a 4 colunas e tabela com rolagem touch.
- **Novos Menus Principais e Workspaces Clínicos Conectados (`Sidebar.tsx`, `AdminDashboard.tsx`)**:
  - **Menu Cadastros**: Submenus e telas para `Pacientes`, `Alimentos (TACO)`, `Suplementos & Doses`, `Modelos de Prescrição` e `Locais de Atendimento`.
  - **Menu Nutrição**: Submenus e ferramentas para `Cálculo TMB / GET` (integrado com `MifflinStJeorStrategy` e `HarrisBenedictStrategy` de `@ygeia/domain-core`), `Planejador de Cardápios`, `Avaliação & Pregas` e `Exames Laboratoriais`.
  - **Menu Treinamento**: Submenus e fichas interativas para `Prescrição de Treinos`, `Exercícios & Bi-Sets`, `Divisão Semanal (ABCD)` e `Volume & Sobrecarga`.

### Modificado
- **Padronização Completa de Configurações (`SettingsModule.tsx`)**:
  - Migração de 100% dos formulários e cartões para os componentes de design system `AppCard`, `AppButton`, `AppInput` e `AppBadge`.
  - Eliminação de cores estáticas hardcoded, passando a responder dinamicamente às variáveis do tema customizado ativo (`var(--primary)`, `var(--primary-light)`, `var(--primary-border)`).
  - Navegação de categorias reformulada para rolagem horizontal em smartphones e coluna lateral no desktop.

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
