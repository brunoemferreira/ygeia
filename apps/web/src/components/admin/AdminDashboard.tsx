import React, { useState } from 'react';
import {
  LogOut,
  Plus,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SettingsModule } from '../settings/SettingsModule';

export interface AdminDashboardProps {
  onBackToHome?: () => void;
  activeItem?: string;
  hideHeader?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeItem = 'configuracoes',
  hideHeader = false,
}) => {
  const { user, logout } = useAuth();

  // Search in Patients CRM
  const [patientSearch, setPatientSearch] = useState('');

  // Mock patient list
  const mockPatients = [
    {
      id: '1',
      name: 'Gabriel Rodrigues',
      email: 'gabriel.rodrigues@email.com',
      phone: '(11) 98765-1122',
      goal: 'Hipertrofia & Ganho de Massa',
      status: 'Ativo',
      lastConsult: '21/11/2026',
      tags: ['Nutrição', 'Treino', 'Bioimpedância'],
    },
    {
      id: '2',
      name: 'Mariana Costa Lima',
      email: 'mariana.costa@email.com',
      phone: '(11) 99887-3344',
      goal: 'Emagrecimento Saudável',
      status: 'Ativo',
      lastConsult: '18/11/2026',
      tags: ['Nutrição', 'Exames AES-256'],
    },
    {
      id: '3',
      name: 'Lucas Ferreira Silveira',
      email: 'lucas.silveira@email.com',
      phone: '(11) 97766-5544',
      goal: 'Performance Esportiva (Corrida)',
      status: 'Retorno Pendente',
      lastConsult: '04/11/2026',
      tags: ['Nutrição', 'Treino Cardio'],
    },
  ];

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* Standalone Header (only shown if not embedded inside AppLayout) */}
      {!hideHeader && (
        <header
          style={{
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.875rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#059669',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
              }}
            >
              Υ
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
                  {user?.clinicName || 'Consultório de Nutrição'}
                </h1>
                <span
                  style={{
                    background: '#ecfdf5',
                    color: '#065f46',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  RLS ATIVO
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                Painel do Proprietário • {user?.fullName || 'Nutricionista'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.875rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#be123c',
                cursor: 'pointer',
              }}
            >
              <LogOut size={15} />
              <span>Sair</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Container */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* ========================================================
            VIEW: MÓDULO CADASTROS / PACIENTES & ALUNOS
           ======================================================== */}
        {activeItem === 'cadastros_pacientes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  👥 Gestão de Pacientes & Alunos
                </h2>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                  Base unificada compartilhada entre os módulos de Nutrição e Treinamento.
                </p>
              </div>
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.625rem 1.125rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                <span>Novo Paciente / Aluno</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Buscar paciente por nome, CPF ou e-mail..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Patients CRM Table */}
            <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.875rem 1rem' }}>Paciente / Contato</th>
                    <th style={{ padding: '0.875rem 1rem' }}>Objetivo Clínico</th>
                    <th style={{ padding: '0.875rem 1rem' }}>Último Atendimento</th>
                    <th style={{ padding: '0.875rem 1rem' }}>Módulos Vinculados</th>
                    <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPatients.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.email} • {p.phone}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{p.goal}</span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                        {p.lastConsult}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                          {p.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                background: tag === 'Nutrição' ? '#ecfdf5' : tag === 'Treino' ? '#eff6ff' : '#f8fafc',
                                color: tag === 'Nutrição' ? '#065f46' : tag === 'Treino' ? '#1d4ed8' : '#475569',
                                border: '1px solid rgba(0,0,0,0.06)',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '4px',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '0.375rem',
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                        >
                          Ver Prontuário →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: MÓDULO NUTRIÇÃO / PRESCRITOR
           ======================================================== */}
        {(activeItem.startsWith('nutri_')) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  🥗 Prescritor Nutricional & Tabela TACO
                </h2>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                  Elaboração de cardápios personalizados com cálculo clínico de VET e macronutrientes.
                </p>
              </div>
              <span style={{ background: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '0.75rem', padding: '0.375rem 0.75rem', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                Módulo Nutrição Ativo
              </span>
            </div>

            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>
                    Paciente: Gabriel Rodrigues (29 anos • 76 kg • 178 cm)
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    Meta Calórica Alvo: <strong>2.450 kcal</strong> • Proteína: <strong>170g (2.2 g/kg)</strong>
                  </span>
                </div>
                <button
                  type="button"
                  style={{
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  Exportar PDF Timbrado
                </button>
              </div>

              {/* Sample Meal Builder Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <span>Refeição 1: Café da Manhã (07:30)</span>
                    <span style={{ color: '#059669' }}>480 kcal | 35g Prot</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
                    3 ovos mexidos + 40g de aveia em flocos finos + 1 banana prata + café sem açúcar.
                  </div>
                </div>

                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <span>Refeição 2: Almoço Principal (12:30)</span>
                    <span style={{ color: '#059669' }}>750 kcal | 52g Prot</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
                    150g Peito de frango grelhado (ou tilápia) + 140g arroz integral + 80g feijão + salada à vontade.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: MÓDULO TREINAMENTO / FICHAS
           ======================================================== */}
        {(activeItem.startsWith('treino_')) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  🏋️ Prescritor de Treinamento & Periodização
                </h2>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                  Fichas de musculação, controle de sobrecarga progressiva e prescrição aeróbia.
                </p>
              </div>
              <span style={{ background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: '0.75rem', padding: '0.375rem 0.75rem', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
                Módulo Treinamento Ativo
              </span>
            </div>

            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>
                    Aluno: Gabriel Rodrigues • Divisão Push / Pull / Legs (PPL)
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    Frequência: 5x/semana • Foco: Hipertrofia Miofibrilar • RIR 1-2
                  </span>
                </div>
                <button
                  type="button"
                  style={{
                    background: '#1d4ed8',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  + Adicionar Exercício
                </button>
              </div>

              {/* Sample Workout Sheet */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <div>
                    <strong>Supino Reto com Barra</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Peitoral Maior • Equipamento: Banco Olímpico</div>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                    4 séries × 8 a 10 reps (Carga: 80kg • RIR 1)
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <div>
                    <strong>Puxada Alta na Barra Aberta (Pulldown)</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Dorsal & Redondo Maior • Equipamento: Cabo</div>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                    4 séries × 10 a 12 reps (Carga: 65kg • Drop-set na última)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: CONFIGURAÇÕES (MÓDULO UNIFICADO COMPLETO)
           ======================================================== */}
        {(activeItem === 'configuracoes' || activeItem.startsWith('config')) && (
          <SettingsModule />
        )}
      </div>
    </div>
  );
};
