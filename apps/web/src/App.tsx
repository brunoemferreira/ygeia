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
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<'professional' | 'patient'>('professional');
  const [appMode, setAppMode] = useState<UserRoleMode>('professional');

  // SEGURANÇA E REGRA DE NEGÓCIO: Área Admin e Paciente SÓ PODEM SER ACESSADAS POR LOGIN!
  // Se tentar acessar 'app' sem autenticação, bloqueia imediatamente e abre o modal de login
  useEffect(() => {
    if (currentView === 'app' && !isAuthenticated) {
      setCurrentView('landing');
      setAuthModalOpen(true);
    }
  }, [currentView, isAuthenticated]);

  const handleOpenAdmin = () => {
    if (!isAuthenticated) {
      setAuthInitialRole('professional');
      setAuthModalOpen(true);
      return;
    }
    setAppMode('professional');
    setCurrentView('app');
  };

  const handleOpenPatient = () => {
    if (!isAuthenticated) {
      setAuthInitialRole('patient');
      setAuthModalOpen(true);
      return;
    }
    setAppMode('patient');
    setCurrentView('app');
  };

  const handleOpenAuth = (role?: 'professional' | 'patient') => {
    setAuthInitialRole(role || 'professional');
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (targetRole?: 'professional' | 'patient') => {
    setAuthModalOpen(false);
    const effectiveRole = targetRole || (user?.role === 'PATIENT' ? 'patient' : 'professional');
    setAppMode(effectiveRole);
    setCurrentView('app');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
  };

  // Clinic branding state for layout (uses authenticated clinic info if present)
  const clinicBranding = {
    clinicName: user?.clinicName || 'Instituto Vitalis & Ygeía',
    primaryColor: '#059669',
    secondaryColor: '#064e3b',
  };

  return (
    <>
      {currentView === 'app' && isAuthenticated ? (
        <AppLayout
          initialMode={appMode}
          onBackToLanding={() => setCurrentView('landing')}
          onLogout={handleLogout}
          clinicBranding={clinicBranding}
        >
          {({ mode, activeItem }) => {
            if (mode === 'patient') {
              return <PatientPortal />;
            }
            return (
              <AdminDashboard
                onBackToHome={() => setCurrentView('landing')}
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
