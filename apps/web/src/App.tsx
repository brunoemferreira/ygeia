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

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'admin'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      {currentView === 'admin' && isAuthenticated ? (
        <AdminDashboard onBackToHome={() => setCurrentView('landing')} />
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenAdmin={() => setCurrentView('admin')}
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
          setCurrentView('admin');
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
