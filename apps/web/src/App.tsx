import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhiteLabelStudioInteractive } from './components/WhiteLabelStudioInteractive';
import { EncryptedVaultShowcase } from './components/EncryptedVaultShowcase';
import { ScientificEngineInteractive } from './components/ScientificEngineInteractive';
import { MobileAppMockup } from './components/MobileAppMockup';
import { ComparisonTable } from './components/ComparisonTable';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppLayout } from './components/layout/AppLayout';
import { PatientPortal } from './components/patient/PatientPortal';
import { UserRoleMode } from './components/layout/Sidebar';

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<'professional' | 'patient'>('professional');
  const [appMode, setAppMode] = useState<UserRoleMode>('professional');

  // Ao carregar usuário autenticado, direciona para o modo correto conforme o perfil
  useEffect(() => {
    if (isAuthenticated && user?.role === 'PATIENT') {
      setAppMode('patient');
    } else if (isAuthenticated) {
      setAppMode('professional');
    }
  }, [isAuthenticated, user?.role]);

  const handleOpenAdmin = () => {
    if (!isAuthenticated) {
      setAuthInitialRole('professional');
      setAuthModalOpen(true);
      return;
    }
    setAppMode('professional');
  };

  const handleOpenPatient = () => {
    if (!isAuthenticated) {
      setAuthInitialRole('patient');
      setAuthModalOpen(true);
      return;
    }
    setAppMode('patient');
  };

  const handleOpenAuth = (role?: 'professional' | 'patient') => {
    setAuthInitialRole(role || 'professional');
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (targetRole?: 'professional' | 'patient') => {
    setAuthModalOpen(false);
    const effectiveRole = targetRole || (user?.role === 'PATIENT' ? 'patient' : 'professional');
    setAppMode(effectiveRole);
  };

  const handleLogout = () => {
    logout();
  };

  // Identidade do Nutricionista / Consultório para o Workspace
  const clinicBranding = {
    clinicName: user?.clinicName || 'Consultório de Nutrição',
    primaryColor: '#059669',
    secondaryColor: '#064e3b',
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
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            onOpenAuth={handleOpenAuth}
            onOpenAdmin={handleOpenAdmin}
            onOpenPatient={handleOpenPatient}
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

      <AuthModal
        isOpen={authModalOpen}
        initialRole={authInitialRole}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};
