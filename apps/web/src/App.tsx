import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AdvantagesGrid } from './components/AdvantagesGrid';
import { InteractiveCalculator } from './components/InteractiveCalculator';
import { SecurityComplianceSection } from './components/SecurityComplianceSection';
import { MobilePreviewSection } from './components/MobilePreviewSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Hero />
        <AdvantagesGrid />
        <SecurityComplianceSection />
        <InteractiveCalculator />
        <MobilePreviewSection />
      </main>
      <Footer />
    </div>
  );
};
