import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { getStoredBranding, ClinicBranding } from './utils/branding';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhiteLabelStudioInteractive } from './components/WhiteLabelStudioInteractive';
import { EncryptedVaultShowcase } from './components/EncryptedVaultShowcase';
import { ScientificEngineInteractive } from './components/ScientificEngineInteractive';
import { MobileAppMockup } from './components/MobileAppMockup';
import { ComparisonTable } from './components/ComparisonTable';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { LoginPage, LoginRoleMode } from './components/auth/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppLayout } from './components/layout/AppLayout';
import { PatientPortal } from './components/patient/PatientPortal';
import { UserRoleMode } from './components/layout/Sidebar';

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');
  const [loginRole, setLoginRole] = useState<LoginRoleMode>('professional');
  const [appMode, setAppMode] = useState<UserRoleMode>('professional');

  // Ao carregar usuário autenticado, direciona para o modo correto conforme o perfil
  useEffect(() => {
    if (isAuthenticated && user?.role === 'PATIENT') {
      setAppMode('patient');
    } else if (isAuthenticated) {
      setAppMode('professional');
    }
  }, [isAuthenticated, user?.role]);

  const handleNavigateToLogin = (role?: LoginRoleMode) => {
    setLoginRole(role || 'professional');
    setCurrentView('login');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleAuthSuccess = (targetRole?: 'professional' | 'patient') => {
    const effectiveRole = targetRole || (user?.role === 'PATIENT' ? 'patient' : 'professional');
    setAppMode(effectiveRole);
    setCurrentView('landing');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
  };

  // Identidade do Nutricionista / Consultório para o Workspace
  const [storedBranding, setStoredBranding] = useState<ClinicBranding>(() => getStoredBranding());

  useEffect(() => {
    const handleBrandingUpdate = (e: any) => {
      setStoredBranding(e.detail || getStoredBranding());
    };
    window.addEventListener('ygeia_branding_updated', handleBrandingUpdate);
    return () => window.removeEventListener('ygeia_branding_updated', handleBrandingUpdate);
  }, []);

  const clinicBranding = {
    clinicName: user?.clinicName || storedBranding.clinicName,
    primaryColor: storedBranding.primaryColor,
    secondaryColor: storedBranding.secondaryColor,
  };

  return (
    <>
      {/* 
        ISOLAMENTO ESTRITO DE AMBIENTES:
        - Se o usuário estiver autenticado: opera EXCLUSIVAMENTE dentro do App (Nutricionista ou Paciente).
          Não há atalhos ou botões para voltar à Landing Page institucional. Para sair, clica em "Sair" (Logout).
        - Se não estiver autenticado: permanece na Landing Page pública até efetuar login.
      */}
      {isAuthenticated ? (
        <AppLayout
          initialMode={appMode}
          onLogout={handleLogout}
          clinicBranding={clinicBranding}
        >
          {({ mode, activeItem }) => {
            if (mode === 'patient') {
              return <PatientPortal />;
            }
            return (
              <AdminDashboard
                activeItem={activeItem}
                hideHeader={true}
              />
            );
          }}
        </AppLayout>
      ) : currentView === 'login' ? (
        <LoginPage
          initialRole={loginRole}
          onBackToLanding={handleBackToLanding}
          onSuccess={handleAuthSuccess}
        />
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            onNavigateToLogin={handleNavigateToLogin}
            onLogout={handleLogout}
          />
          <main style={{ flexGrow: 1 }}>
            <Hero />
            <WhiteLabelStudioInteractive />
            <EncryptedVaultShowcase />
            <ScientificEngineInteractive />
            <MobileAppMockup />
            <ComparisonTable />
            <FAQSection />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ToastProvider>
  );
};
