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
    initialMode === 'patient' ? 'patient_diet' : 'config_perfil',
  );

  // Sync mode if initialMode changes
  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      setActiveItem(initialMode === 'patient' ? 'patient_diet' : 'config_perfil');
    }
  }, [initialMode]);

  // Modular SaaS Licenses simulation
  const [activeModules, setActiveModules] = useState({
    nutrition: true,
    training: true,
  });

  const handleToggleModule = (mod: 'nutrition' | 'training') => {
    setActiveModules((prev) => ({
      ...prev,
      [mod]: !prev[mod],
    }));
  };

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
      case 'cadastros_pacientes':
        return 'Cadastros / Pacientes & Alunos';
      case 'cadastros_agenda':
        return 'Cadastros / Agenda & Sessões';
      case 'cadastros_antropometria':
        return 'Cadastros / Avaliação Física';
      case 'cadastros_exames':
        return 'Cadastros / Cofre de Exames AES-256';
      case 'nutri_prescritor':
        return 'Nutrição / Prescritor Nutricional';
      case 'nutri_taco':
        return 'Nutrição / Tabela TACO & Alimentos';
      case 'nutri_receitas':
        return 'Nutrição / Biblioteca de Receitas';
      case 'nutri_suplementos':
        return 'Nutrição / Suplementação & Fitoterapia';
      case 'treino_prescritor':
        return 'Treinamento / Prescritor de Treinos';
      case 'treino_exercicios':
        return 'Treinamento / Banco de Exercícios';
      case 'treino_periodizacao':
        return 'Treinamento / Periodização & Cargas';
      case 'treino_cardio':
        return 'Treinamento / Cardio & Frequência Cardíaca';
      case 'config_perfil':
        return 'Configurações / Perfil do Nutricionista';
      case 'config_whitelabel':
        return 'Configurações / White Label Studio';
      case 'config_equipe':
        return 'Configurações / Equipe & Permissões';
      default:
        return 'Painel Administrativo';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
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
          onChangeMode={(newMode) => {
            setMode(newMode);
            setActiveItem(newMode === 'professional' ? 'config_perfil' : 'patient_diet');
          }}
          activeModules={activeModules}
          onToggleModule={handleToggleModule}
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
