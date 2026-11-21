import React, { useState, useEffect } from 'react';
import { Lock, Shield, Clock } from 'lucide-react';

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
    <section id="cofre" style={{ padding: '5rem 0', background: '#090d16', color: 'white' }}>
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
        <div className="grid-responsive-1-3" style={{ gap: '1.75rem', marginBottom: '3.5rem' }}>
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
          padding: '1.75rem',
          maxWidth: '960px',
          margin: '0 auto',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#94a3b8' }}>
                YGEÍA CRYPTOGRAPHIC VAULT INSPECTOR — ATIVO
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.8rem', fontWeight: 700 }}>
              <Lock size={14} /> TOKEN ASSINADO VÁLIDO: {formatTimer(secondsRemaining)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid #1f2937' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Arquivo Protegido</div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Exame_Bioquimico_Glicemia_Insulina.pdf
              </div>
            </div>

            <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid #1f2937' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Chave Criptográfica</div>
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.9rem', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                aes-256-gcm::sha256-hmac
              </div>
            </div>

            <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid #1f2937' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Status da Sessão</div>
              <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Assinatura Digital Verificada ✓
              </div>
            </div>
          </div>

          <div style={{
            background: '#090d16',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #1f2937',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: '#a7f3d0'
          }}>
            [AUDIT_LOG] 2026-11-21 17:38:09.124 UTC | ACTION: EXAM_ACCESSED | ACTOR: dr_rodrigo@apex.com | IP: 189.12.94.3 | RESOURCE: exam_93f82a | STATUS: 200 OK
          </div>
        </div>
      </div>
    </section>
  );
};
