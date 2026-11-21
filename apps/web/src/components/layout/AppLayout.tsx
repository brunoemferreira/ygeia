import React, { useState } from 'react';
import { Sidebar, UserRoleMode } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: (props: {
    mode: UserRoleMode;
    activeItem: string;
    activeModules: { nutrition: boolean; training: boolean };
  }) => React.ReactNode;
  onLogout: () => void;
  clinicBranding: {
    clinicName: string;
    primaryColor: string;
    secondaryColor: string;
  };
  initialMode?: UserRoleMode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  onLogout,
  clinicBranding,
  initialMode = 'professional',
}) => {
  const [mode, setMode] = useState<UserRoleMode>(initialMode);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(
    initialMode === 'patient' ? 'patient_diet' : 'dashboard_pacientes',
  );

  // Sync mode if initialMode changes
  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      setActiveItem(initialMode === 'patient' ? 'patient_diet' : 'dashboard_pacientes');
    }
  }, [initialMode]);

  // Active licensed modules for workspace
  const [activeModules] = useState({
    nutrition: true,
    training: true,
  });

  // Breadcrumbs text mapper
  const getBreadcrumbs = () => {
    if (mode === 'patient') {
      switch (activeItem) {
        case 'patient_diet':
          return 'Meu Plano Alimentar de Hoje';
        case 'patient_habits':
          return 'Diário & Hidratação';
        case 'patient_supplements':
          return 'Minha Suplementação';
        case 'patient_evolution':
          return 'Minha Evolução & Gráficos';
        case 'patient_exams':
          return 'Meus Exames Criptografados';
        case 'patient_appointments':
          return 'Minhas Consultas';
        case 'patient_chat':
          return 'Canal Direto com Nutricionista';
        default:
          return 'Meu Painel';
      }
    }

    // Professional breadcrumbs
    switch (activeItem) {
      case 'dashboard_pacientes':
        return 'Governança Clínica / Dashboard de Pacientes';
      case 'rotina_agenda':
        return 'Rotina / Agenda';
      case 'rotina_pacientes':
        return 'Rotina / Pacientes';
      case 'rotina_daily':
        return 'Rotina / Daily';
      case 'rotina_acompanhamentos':
        return 'Rotina / Acompanhamentos';
      case 'rotina_chat':
        return 'Rotina / Chat com pacientes';
      case 'rotina_tarefas':
        return 'Rotina / Tarefas';
      case 'atendimento_pre':
        return 'Atendimento / Formulário pré-consulta';
      case 'atendimento_pos':
        return 'Atendimento / Formulário pós-consulta';
      case 'gestao_contas':
        return 'Governança / Gestão de Contas';
      case 'clube_vantagens':
        return 'Benefícios / Clube de Vantagens';
      case 'treino_modulo':
        return 'Treinamento / Módulo de Treino';
      case 'configuracoes':
      case 'config_perfil':
      case 'config_whitelabel':
      case 'config_equipe':
        return 'Configurações / Preferências';
      case 'minha_conta':
        return 'Administração / Minha Conta Admin';
      default:
        return 'Governança Clínica / Dashboard de Pacientes';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f8f7' }}>
      {/* Retractable Left Sidebar */}
      <Sidebar
        mode={mode}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeItem}
        onSelectItem={(item) => setActiveItem(item)}
        clinicBranding={clinicBranding}
        activeModules={activeModules}
      />

      {/* Main Workspace Frame */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        <Header
          mode={mode}
          onLogout={onLogout}
          breadcrumbs={getBreadcrumbs()}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main style={{ flex: 1 }}>
          {children({ mode, activeItem, activeModules })}
        </main>
      </div>
    </div>
  );
};
