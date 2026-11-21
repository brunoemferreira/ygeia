import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhiteLabelStudioInteractive } from './components/WhiteLabelStudioInteractive';
import { EncryptedVaultShowcase } from './components/EncryptedVaultShowcase';
import { ScientificEngineInteractive } from './components/ScientificEngineInteractive';
import { MobileAppMockup } from './components/MobileAppMockup';
import { ComparisonTable } from './components/ComparisonTable';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
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
  );
};
