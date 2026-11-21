import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#059669', fontSize: '1.75rem', margin: 0 }}>YGEÍA (Υγεία)</h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Plataforma SaaS White Label para Nutricionistas</p>
      </header>

      <main style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginTop: 0 }}>Frontend Web React (Mobile-First)</h2>
        <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: '1.5' }}>
          Ambiente base operacional. Suporte a theming White Label dinâmico e integração com o motor de regras nutricionais do domínio.
        </p>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#ecfdf5', borderRadius: '8px', color: '#065f46', fontSize: '0.9rem' }}>
          ✓ Touch targets 48px configurados
        </div>
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
