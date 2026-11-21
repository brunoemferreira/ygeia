import React, { useState } from 'react';
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

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Clinic branding state for layout (uses authenticated clinic info if present)
  const clinicBranding = {
    clinicName: user?.clinicName || 'Instituto Vitalis & Ygeía',
    primaryColor: '#059669',
    secondaryColor: '#064e3b',
  };

  return (
    <>
      {currentView === 'app' ? (
        <AppLayout
          onBackToLanding={() => setCurrentView('landing')}
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
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenAdmin={() => setCurrentView('app')}
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
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          setCurrentView('app');
        }}
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
