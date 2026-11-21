import React, { useState, useEffect } from 'react';
import { Lock, Shield, Clock, CheckCircle2 } from 'lucide-react';

export const EncryptedVaultShowcase: React.FC = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(892); // ~14m 52s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section id="cofre" style={{ padding: '5rem 0', background: '#090d16', color: 'white', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem auto' }}>
          <span className="pill-badge pill-danger" style={{ marginBottom: '1rem', background: 'rgba(220, 38, 38, 0.15)', color: '#f87171' }}>
            <Lock size={14} /> Cofre Criptográfico de Saúde (AES-256 GCM)
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'white', marginBottom: '1rem' }}>
            Seus Exames e Laudos Médicos Blindados de Verdade
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6' }}>
            A maioria dos softwares salva os exames de sangue e bioimpedâncias dos seus pacientes em links públicos desprotegidos. O Ygeía foi arquitetado com segurança em profundidade: armazenamento criptografado no repouso e URLs assinadas com validade efêmera.
          </p>
        </div>

        {/* 3 Pillars Row */}
        <div className="grid-responsive-1-3" style={{ gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div className="dark-glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Lock size={22} />
            </div>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Criptografia no Repouso (AES-256)
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Cada arquivo (PDF de hemograma, imagem de bioimpedância ou laudo) é criptografado com chave simétrica AES-256 em bucket isolado com permissão estrita.
            </p>
          </div>

          <div className="dark-glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Clock size={22} />
            </div>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              URLs Assinadas com Expiração
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Nenhum link público é gerado. Quando o nutricionista ou o paciente visualiza o exame, uma URL assinada temporária (15 min) é emitida e invalida-se logo após.
            </p>
          </div>

          <div className="dark-glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(2, 132, 199, 0.2)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Shield size={22} />
            </div>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Trilha de Auditoria Indelével LGPD
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Toda leitura ou download é gravado em log imutável contendo endereço IP, data/hora com microssegundos e identificador do usuário que realizou o acesso.
            </p>
          </div>
        </div>

        {/* Live Security Inspector Terminal */}
        <div style={{
          background: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '960px',
          margin: '0 auto',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
          overflow: 'hidden'
        }}>
          {/* Header with Graceful Wrapping */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1f2937',
            paddingBottom: '0.875rem',
            marginBottom: '1.25rem',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#94a3b8',
                fontWeight: 700,
                letterSpacing: '0.02em'
              }}>
                CRYPTOGRAPHIC VAULT INSPECTOR
              </span>
              <span className="pill-badge pill-emerald" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>
                ONLINE
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              flexShrink: 0
            }}>
              <Lock size={13} /> EXPIRA EM: {formatTimer(secondsRemaining)}
            </div>
          </div>

          {/* Cards Grid with Defensive Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.875rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{
              background: '#090d16',
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              border: '1px solid #1f2937',
              overflow: 'hidden'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Arquivo Protegido
              </div>
              <div
                title="Exame_Bioquimico_Glicemia_Insulina.pdf"
                style={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.85rem',
                  marginTop: '0.25rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                Exame_Bioquimico_Insulina.pdf
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                2.4 MB • SHA-256 Verificado
              </div>
            </div>

            <div style={{
              background: '#090d16',
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              border: '1px solid #1f2937',
              overflow: 'hidden'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Chave Criptográfica
              </div>
              <div style={{
                fontWeight: 700,
                color: '#34d399',
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                aes-256-gcm::authenticated
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Assinatura HMAC-SHA256
              </div>
            </div>

            <div style={{
              background: '#090d16',
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              border: '1px solid #1f2937',
              overflow: 'hidden'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Status da Sessão
              </div>
              <div style={{
                fontWeight: 700,
                color: '#38bdf8',
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <CheckCircle2 size={14} color="#38bdf8" /> Assinatura Ativa
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Acesso Restrito ao Paciente
              </div>
            </div>
          </div>

          {/* Audit Log Console: Responsive with Horizontal Scroll if needed */}
          <div style={{
            background: '#090d16',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #1f2937',
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: '#a7f3d0',
            lineHeight: '1.5'
          }}>
            <code>
              [AUDIT_LOG] 2026-11-21 17:45:00 UTC | ACTION: EXAM_VIEWED | ACTOR: dr_rodrigo@apex.com | IP: 189.12.94.3 | RESOURCE: exam_93f82a | STATUS: 200 OK
            </code>
          </div>
        </div>
      </div>
    </section>
  );
};
