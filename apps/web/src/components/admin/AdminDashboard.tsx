import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertCircle,
  LogOut,
  ExternalLink,
  Save,
  Plus,
  ShieldAlert,
  Copy,
  Check,
  FileText,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:3333/api/v1';

export interface AdminDashboardProps {
  onBackToHome: () => void;
  activeItem?: string;
  hideHeader?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToHome,
  activeItem = 'config_perfil',
  hideHeader = false,
}) => {
  const { user, token, logout } = useAuth();

  // Internal tab state as fallback: focado 100% no Nutricionista
  const [activeTab, setActiveTab] = useState<'nutritionist' | 'branding' | 'team'>('nutritionist');

  // Sync activeTab with activeItem when it comes from the modular sidebar
  useEffect(() => {
    if (activeItem.startsWith('config_')) {
      if (activeItem === 'config_perfil') setActiveTab('nutritionist');
      else if (activeItem === 'config_whitelabel') setActiveTab('branding');
      else if (activeItem === 'config_equipe') setActiveTab('team');
    }
  }, [activeItem]);

  // Loading and Alert states
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Branding State (Marca do Nutricionista / Consultório)
  const [branding, setBranding] = useState({
    clinicName: user?.clinicName || 'Consultório de Nutrição',
    primaryColor: '#059669',
    secondaryColor: '#064e3b',
    accentColor: '#8b5cf6',
    logoUrl: '',
    darkLogoUrl: '',
    faviconUrl: '',
    fontFamily: 'Plus Jakarta Sans',
    letterheadTemplateUrl: '',
  });

  // 2. Nutritionist Profile State (CRN / CREF & Contatos)
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    professionalName: user?.fullName || '',
    crnNumber: '',
    crnRegion: 'CRN-3',
    specialties: [] as string[],
    bio: '',
    phone: '',
    whatsapp: '',
    isTechnicalManager: true,
  });
  const [newSpecialty, setNewSpecialty] = useState('');

  // Sincroniza dados com o usuário autenticado caso sejam carregados após render inicial
  useEffect(() => {
    if (user) {
      if (user.clinicName) {
        setBranding((prev) => ({
          ...prev,
          clinicName: prev.clinicName === 'Consultório de Nutrição' || prev.clinicName === 'Ygeía Clínica Modelo' ? user.clinicName! : prev.clinicName,
        }));
      }
      if (user.fullName) {
        setProfile((prev) => ({
          ...prev,
          fullName: prev.fullName || user.fullName,
          professionalName: prev.professionalName || user.fullName,
        }));
      }
    }
  }, [user]);

  // 4. Team State
  const [team, setTeam] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'NUTRITIONIST' | 'SECRETARY'>('NUTRITIONIST');
  const [inviteLinkGenerated, setInviteLinkGenerated] = useState<string | null>(null);

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

  // Fetch all tenant data on mount
  useEffect(() => {
    if (!token) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Branding
        const resBranding = await fetch(`${API_BASE}/tenants/branding`, { headers });
        if (resBranding.ok) {
          const bData = await resBranding.json();
          setBranding((prev) => ({
            ...prev,
            ...bData,
            clinicName: bData.clinicName || user?.clinicName || prev.clinicName,
          }));
        }

        // Fetch Profile
        const resProfile = await fetch(`${API_BASE}/tenants/profile`, { headers });
        if (resProfile.ok) {
          const pData = await resProfile.json();
          setProfile((prev) => ({
            ...prev,
            fullName: pData.fullName || user?.fullName || prev.fullName,
            professionalName: pData.professionalName || user?.fullName || prev.professionalName,
            crnNumber: pData.crnNumber || prev.crnNumber || '',
            crnRegion: pData.crnRegion || prev.crnRegion || 'CRN-3',
            specialties: pData.specialties || prev.specialties || [],
            bio: pData.bio ?? prev.bio,
            isTechnicalManager: pData.isTechnicalManager ?? prev.isTechnicalManager ?? true,
          }));
        }

        // Fetch Team
        const resTeam = await fetch(`${API_BASE}/tenants/team`, { headers });
        if (resTeam.ok) {
          const tData = await resTeam.json();
          setTeam(tData);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do tenant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token]);

  // Flash alert helper
  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const notifyError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage(null);
  };

  // Submit Branding
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tenants/branding`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branding),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Falha ao salvar marca White Label.');
      }

      notifySuccess('Identidade visual White Label atualizada com sucesso!');
    } catch (err: any) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Profile (CRN)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tenants/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Falha ao salvar perfil do nutricionista.');
      }

      notifySuccess('Perfil profissional e registro CRN salvos com sucesso!');
    } catch (err: any) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add Specialty Tag
  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !profile.specialties.includes(newSpecialty.trim())) {
      setProfile((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (spec: string) => {
    setProfile((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== spec),
    }));
  };

  // Invite Team Member
  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tenants/team/invite`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Falha ao convidar membro.');
      }

      const data = await res.json();
      setInviteLinkGenerated(`${window.location.origin}${data.inviteLink}`);
      setInviteEmail('');
      notifySuccess('Convite de equipe gerado com sucesso!');
    } catch (err: any) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
                background: branding.primaryColor || '#059669',
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
                  {branding.clinicName || 'Ygeía SaaS'}
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
              onClick={onBackToHome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.875rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <ExternalLink size={15} />
              <span>Ver Landing Page</span>
            </button>
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
        {/* Banner Alert Messages */}
        {successMessage && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #6ee7b7',
              color: '#065f46',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            }}
          >
            <CheckCircle size={20} color="#059669" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <AlertCircle size={20} color="#dc2626" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{errorMessage}</span>
          </div>
        )}

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
            VIEW: MÓDULO CONFIGURAÇÕES / WHITE LABEL STUDIO
           ======================================================== */}
        {activeTab === 'branding' && activeItem.startsWith('config_') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '2rem' }}>
            {/* Form */}
            <div
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                  🎨 White Label Studio
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Personalize a aparência do portal web, aplicativo mobile e receituários da sua clínica. Seus pacientes só veem sua marca.
                </p>
              </div>

              <form onSubmit={handleSaveBranding} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Nome Fantasia da Clínica
                  </label>
                  <input
                    type="text"
                    required
                    value={branding.clinicName}
                    onChange={(e) => setBranding({ ...branding, clinicName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9375rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Cor Primária
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                        style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        value={branding.primaryColor}
                        onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.8125rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Cor Secundária
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={branding.secondaryColor}
                        onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                        style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        value={branding.secondaryColor}
                        onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.8125rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Cor de Destaque
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={branding.accentColor}
                        onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                        style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        value={branding.accentColor}
                        onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.8125rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Tipografia da Marca
                  </label>
                  <select
                    value={branding.fontFamily}
                    onChange={(e) => setBranding({ ...branding, fontFamily: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      background: 'white',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Recomendado - Moderno & Clínico)</option>
                    <option value="Inter">Inter (Padrão Internacional)</option>
                    <option value="Roboto">Roboto (Google Material)</option>
                    <option value="Montserrat">Montserrat (Geométrico Elegante)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    URL do Logotipo (Fundo Claro)
                  </label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/logo-clinica.png"
                    value={branding.logoUrl || ''}
                    onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: branding.primaryColor || '#059669',
                    color: 'white',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '1rem',
                  }}
                >
                  <Save size={18} />
                  <span>{loading ? 'Salvando...' : 'Salvar Identidade White Label'}</span>
                </button>
              </form>
            </div>

            {/* Live Preview Pane */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <FileText size={18} color="#059669" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    Pré-visualização do Timbrado / Prescrição
                  </span>
                </div>

                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    background: '#ffffff',
                    fontFamily: branding.fontFamily,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: `2px solid ${branding.primaryColor}`,
                      paddingBottom: '1rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: branding.secondaryColor }}>
                        {branding.clinicName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {profile.professionalName || 'Dra. Sofia Alencar'} • {profile.crnNumber || 'CRN-3 48.912/P'} • Atendimento Nutricional
                      </div>
                    </div>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: branding.primaryColor,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                      }}
                    >
                      Υ
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, color: branding.primaryColor, marginBottom: '0.25rem' }}>
                      PLANO ALIMENTAR & PERIODIZAÇÃO
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.75rem' }}>
                      Paciente / Aluno: Gabriel Rodrigues • Data: 21/11/2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: CONFIGURAÇÕES / PERFIL DO NUTRICIONISTA
           ======================================================== */}
        {activeTab === 'nutritionist' && activeItem.startsWith('config_') && (
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              maxWidth: '850px',
              margin: '0 auto',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🩺 Perfil Profissional (CRN / CREF)
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                Registro compulsório perante o CFN (Resolução nº 600/2018) ou CONFEF para emissão de prescrições válidas.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Nome Profissional (nos Receituários)
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.professionalName}
                    onChange={(e) => setProfile({ ...profile, professionalName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Número do Registro (CRN ou CREF)
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.crnNumber}
                    onChange={(e) => setProfile({ ...profile, crnNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Região do Conselho
                  </label>
                  <select
                    value={profile.crnRegion}
                    onChange={(e) => setProfile({ ...profile, crnRegion: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: 'white', boxSizing: 'border-box' }}
                  >
                    <option value="CRN-3">CRN-3 (SP, MS)</option>
                    <option value="CRN-4">CRN-4 (RJ, ES)</option>
                    <option value="CRN-1">CRN-1 (DF, GO, MT, TO)</option>
                    <option value="CREF-SP">CREF-4 (São Paulo)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    WhatsApp do Nutricionista
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 98765-4321"
                    value={profile.whatsapp || ''}
                    onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Telefone de Atendimento / Consultório
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 3214-5500"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  Especialidades Clínicas & Foco de Atuação
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Adicionar especialidade (Ex: Nutrição Esportiva, Emagrecimento)"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSpecialty(); } }}
                    style={{ flex: 1, padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialty}
                    style={{
                      background: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.625rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Plus size={16} />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profile.specialties.map((spec) => (
                    <span
                      key={spec}
                      style={{
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#065f46',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                      }}
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(spec)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#065f46', padding: 0, fontSize: '0.875rem' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: '#059669',
                  color: 'white',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                <Save size={18} />
                <span>{loading ? 'Salvando...' : 'Salvar Perfil Profissional'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================
            VIEW: MÓDULO CONFIGURAÇÕES / EQUIPE & RBAC
           ======================================================== */}
        {activeTab === 'team' && activeItem.startsWith('config_') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                👥 Colaboradores & Papéis de Acesso (RBAC)
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>
                Cada perfil possui permissões estritas baseadas em segurança da informação médica e LGPD.
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Nome / E-mail</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Papel (Role)</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member) => (
                    <tr key={member.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{member.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{member.email}</div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: member.role === 'CLINIC_OWNER' ? '#ecfdf5' : member.role === 'NUTRITIONIST' ? '#eff6ff' : '#fef3c7',
                          color: member.role === 'CLINIC_OWNER' ? '#065f46' : member.role === 'NUTRITIONIST' ? '#1d4ed8' : '#92400e',
                        }}>
                          {member.role === 'CLINIC_OWNER' ? 'Proprietário' : member.role === 'NUTRITIONIST' ? 'Nutricionista' : member.role === 'ADMIN' ? 'Gerente' : 'Recepção / Secretária'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ color: member.isActive ? '#059669' : '#dc2626', fontWeight: 600, fontSize: '0.75rem' }}>
                          {member.isActive ? '● Ativo' : '○ Inativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', display: 'flex', gap: '0.75rem' }}>
                <ShieldAlert size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong>Regra de Sigilo LGPD/CFN:</strong> Usuários com papel <code>SECRETARY</code> têm acesso à agenda e contatos básicos, sem permissão para prontuários clínicos ou exames laboratoriais.
                </div>
              </div>
            </div>

            {/* Invite Form */}
            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
                Convidar Novo Membro
              </h3>
              <form onSubmit={handleInviteMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    E-mail do Colaborador
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="colega@clinica.com.br"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Papel de Acesso
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: 'white', boxSizing: 'border-box' }}
                  >
                    <option value="NUTRITIONIST">Nutricionista Associado</option>
                    <option value="ADMIN">Gerente da Clínica</option>
                    <option value="SECRETARY">Recepção / Secretária</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: '#0f172a',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {loading ? 'Gerando...' : 'Gerar Convite de Acesso'}
                </button>
              </form>

              {inviteLinkGenerated && (
                <div style={{ marginTop: '1.25rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '0.5rem', padding: '0.875rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', marginBottom: '0.25rem' }}>
                    Link de Ativação (48 horas):
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      readOnly
                      value={inviteLinkGenerated}
                      style={{ flex: 1, fontSize: '0.75rem', padding: '0.375rem', borderRadius: '0.25rem', border: '1px solid #6ee7b7' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(inviteLinkGenerated);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      style={{ background: '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', padding: '0.375rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
