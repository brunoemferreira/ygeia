import React from 'react';
import { Lock, Database, Clock, KeyRound } from 'lucide-react';

export const SecurityComplianceSection: React.FC = () => {
  return (
    <section id="seguranca" style={{ padding: '4rem 0', background: 'var(--dark)', color: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-security" style={{ marginBottom: '0.75rem', background: 'rgba(220, 38, 38, 0.15)', color: '#f87171' }}>
            <Lock size={14} /> Segurança de Nível Bancário & Saúde
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'white', marginBottom: '1rem' }}>
            Blindagem Total de Dados Sensíveis de Saúde
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>
            Em conformidade estrita com o Conselho Federal de Nutricionistas (CFN) e a Lei Geral de Proteção de Dados (LGPD).
          </p>
        </div>

        <div className="grid grid-cols-3" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
          {/* Card 1 */}
          <div style={{
            background: 'var(--dark-surface)',
            border: '1px solid #334155',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Lock size={22} />
            </div>
            <h3 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
              Exames Laboratoriais Criptografados
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Laudos bioquímicos e exames de imagem são gravados com criptografia no repouso (AES-256) em buckets isolados. O acesso só ocorre por URLs temporárias com assinatura criptográfica válida por 15 minutos.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: 'var(--dark-surface)',
            border: '1px solid #334155',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: 'rgba(5, 150, 105, 0.2)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Database size={22} />
            </div>
            <h3 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
              PostgreSQL Row-Level Security (RLS)
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Isolamento de tenants forçado no motor do banco de dados com usuário não-superuser <code>ygeia_app</code>. Mesmo em eventuais bugs de aplicação, uma clínica jamais acessa dados de outra.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: 'var(--dark-surface)',
            border: '1px solid #334155',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: 'rgba(2, 132, 199, 0.2)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Clock size={22} />
            </div>
            <h3 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
              Trilha de Auditoria Indelével
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Todo acesso ou alteração em prontuários gera log imutável com usuário, ação, endereço IP e timestamp. Conformidade jurídica total para resguardar o profissional de saúde em caso de perícia.
            </p>
          </div>
        </div>

        {/* Banner de Criptografia de Credenciais */}
        <div style={{
          background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #334155',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <KeyRound size={24} color="#34d399" />
            <h4 style={{ color: 'white', fontSize: '1.1rem' }}>
              Proteção de Acesso: Argon2id + Rotação com Detecção de Reuso
            </h4>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Senhas protegidas pelo algoritmo campeão da Password Hashing Competition (64MB de memória e 3 iterações). Sessões gerenciadas por JWT de 15 minutos em cookies <strong>HttpOnly</strong> (à prova de XSS) e Refresh Tokens rotativos com invalidação automática de toda a família de sessões em caso de tentativa de reuso.
          </p>
        </div>
      </div>
    </section>
  );
};
