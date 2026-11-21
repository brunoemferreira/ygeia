import React, { useState, useEffect } from 'react';
import {
  Palette,
  Building2,
  Stethoscope,
  Users,
  CheckCircle,
  AlertCircle,
  LogOut,
  ExternalLink,
  Save,
  Plus,
  ShieldAlert,
  UserPlus,
  Copy,
  Check,
  FileText,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:3333/api/v1';

export const AdminDashboard: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'branding' | 'settings' | 'nutritionist' | 'team'>('branding');

  // Loading and Alert states
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Branding State
  const [branding, setBranding] = useState({
    clinicName: 'Ygeía Clínica Modelo',
    primaryColor: '#059669',
    secondaryColor: '#064e3b',
    accentColor: '#8b5cf6',
    logoUrl: '',
    darkLogoUrl: '',
    faviconUrl: '',
    fontFamily: 'Plus Jakarta Sans',
    letterheadTemplateUrl: '',
  });

  // 2. Settings State (Dados da Empresa)
  const [settings, setSettings] = useState({
    legalName: '',
    tradeName: '',
    taxId: '',
    phone: '',
    whatsapp: '',
    email: '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: 'SP',
    addressZipCode: '',
  });

  // 3. Nutritionist Profile State (CRN)
  const [profile, setProfile] = useState({
    fullName: '',
    professionalName: '',
    crnNumber: '',
    crnRegion: 'CRN-3',
    specialties: [] as string[],
    bio: '',
    isTechnicalManager: true,
  });
  const [newSpecialty, setNewSpecialty] = useState('');

  // 4. Team State
  const [team, setTeam] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'NUTRITIONIST' | 'SECRETARY'>('NUTRITIONIST');
  const [inviteLinkGenerated, setInviteLinkGenerated] = useState<string | null>(null);

  // Fetch all tenant data on mount
  useEffect(() => {
    if (!token) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Branding
        const resBranding = await fetch(`${API_BASE}/tenants/branding`, { credentials: 'omit' });
        if (resBranding.ok) {
          const bData = await resBranding.json();
          setBranding((prev) => ({ ...prev, ...bData }));
        }

        // Fetch Settings
        const resSettings = await fetch(`${API_BASE}/tenants/settings`, { headers });
        if (resSettings.ok) {
          const sData = await resSettings.json();
          setSettings((prev) => ({ ...prev, ...sData }));
        }

        // Fetch Profile
        const resProfile = await fetch(`${API_BASE}/tenants/profile`, { headers });
        if (resProfile.ok) {
          const pData = await resProfile.json();
          setProfile({
            fullName: pData.fullName || '',
            professionalName: pData.professionalName || '',
            crnNumber: pData.crnNumber || '',
            crnRegion: pData.crnRegion || 'CRN-3',
            specialties: pData.specialties || [],
            bio: pData.bio || '',
            isTechnicalManager: pData.isTechnicalManager ?? true,
          });
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

  // Submit Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tenants/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Falha ao salvar dados da empresa.');
      }

      notifySuccess('Dados cadastrais da clínica salvos com sucesso!');
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* Top Navbar */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Brand info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
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
            }}>
              Υ
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
                  {branding.clinicName || 'Ygeía SaaS'}
                </h1>
                <span style={{
                  background: '#ecfdf5',
                  color: '#065f46',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1px solid #a7f3d0',
                }}>
                  RLS ATIVO
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                Painel do Proprietário • {user?.fullName || 'Nutricionista'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
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
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Banner Alert Messages */}
        {successMessage && (
          <div style={{
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
          }}>
            <CheckCircle size={20} color="#059669" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <AlertCircle size={20} color="#dc2626" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{errorMessage}</span>
          </div>
        )}

        {/* Tab Navigation Navigation Bar */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}>
          {[
            { id: 'branding', label: 'White Label Studio (Sua Marca)', icon: Palette },
            { id: 'settings', label: 'Dados da Empresa & Clínica', icon: Building2 },
            { id: 'nutritionist', label: 'Perfil do Nutricionista (CRN)', icon: Stethoscope },
            { id: 'team', label: 'Equipe & Permissões (RBAC)', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.25rem',
                  borderRadius: '0.625rem 0.625rem 0 0',
                  background: isActive ? 'white' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? '#e2e8f0 #e2e8f0 transparent #e2e8f0' : 'transparent',
                  color: isActive ? '#059669' : '#64748b',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  borderBottom: isActive ? '2px solid #059669' : 'none',
                  transition: 'all 0.15s ease-in-out',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: WHITE LABEL STUDIO */}
        {activeTab === 'branding' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '2rem' }}>
            {/* Form */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
            }}>
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
                  {/* Primary Color */}
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

                  {/* Secondary Color */}
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

                  {/* Accent Color */}
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
              {/* Prescription Letterhead Preview */}
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <FileText size={18} color="#059669" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    Pré-visualização do Timbrado / Prescrição
                  </span>
                </div>

                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  background: '#ffffff',
                  fontFamily: branding.fontFamily,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                }}>
                  {/* Letterhead Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `2px solid ${branding.primaryColor}`,
                    paddingBottom: '1rem',
                    marginBottom: '1.25rem',
                  }}>
                    <div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: branding.secondaryColor }}>
                        {branding.clinicName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {settings.addressStreet ? `${settings.addressStreet}, ${settings.addressNumber} • ${settings.addressCity}/${settings.addressState}` : 'Av. Paulista, 1000 • São Paulo/SP'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        WhatsApp: {settings.whatsapp || '(11) 98765-4321'}
                      </div>
                    </div>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: branding.primaryColor,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}>
                      Υ
                    </div>
                  </div>

                  {/* Body Sample */}
                  <div style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, color: branding.primaryColor, marginBottom: '0.25rem' }}>
                      PLANO ALIMENTAR HIPERTROFIA & PERFORMANCE
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.75rem' }}>
                      Paciente: Gabriel Rodrigues • Data: 21/11/2026
                    </p>
                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', borderLeft: `3px solid ${branding.accentColor}` }}>
                      <strong>Meta Metabólica Diária:</strong> 2.450 kcal | 170g Proteínas (2,1 g/kg)
                    </div>
                  </div>

                  {/* Signature */}
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1', textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0f172a' }}>
                      {profile.professionalName || 'Dra. Sofia Alencar'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Nutricionista Responsável Técnica • {profile.crnNumber || 'CRN-3 48.912/P'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App Header Preview */}
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Smartphone size={18} color="#059669" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    Topo do App Mobile do Paciente
                  </span>
                </div>

                <div style={{
                  background: branding.secondaryColor,
                  color: 'white',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  fontFamily: branding.fontFamily,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {branding.clinicName}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                        Olá, Gabriel!
                      </div>
                    </div>
                    <div style={{
                      background: branding.primaryColor,
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      Hoje • 85% meta
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DADOS DA EMPRESA */}
        {activeTab === 'settings' && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            maxWidth: '850px',
            margin: '0 auto',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🏢 Dados Cadastrais e Fiscais da Clínica
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                Informações jurídicas para emissão de recibos de consulta, contratos e cabeçalho de receitas.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Razão Social
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Vitalis Serviços Nutricionais Ltda"
                    value={settings.legalName || ''}
                    onChange={(e) => setSettings({ ...settings, legalName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Instituto Vitalis"
                    value={settings.tradeName || ''}
                    onChange={(e) => setSettings({ ...settings, tradeName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    CNPJ ou CPF do Profissional
                  </label>
                  <input
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={settings.taxId || ''}
                    onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    WhatsApp de Atendimento
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 98765-4321"
                    value={settings.whatsapp || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Telefone Comercial
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 3214-5500"
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  E-mail Institucional de Contato
                </label>
                <input
                  type="email"
                  placeholder="contato@vitalisnutri.com.br"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Endereço */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#1e293b' }}>
                  Endereço do Consultório / Clínica
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Logradouro (Rua, Avenida, Praça)
                    </label>
                    <input
                      type="text"
                      placeholder="Av. Paulista"
                      value={settings.addressStreet || ''}
                      onChange={(e) => setSettings({ ...settings, addressStreet: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Número
                    </label>
                    <input
                      type="text"
                      placeholder="1000"
                      value={settings.addressNumber || ''}
                      onChange={(e) => setSettings({ ...settings, addressNumber: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Complemento (Sala, Andar, Bloco)
                    </label>
                    <input
                      type="text"
                      placeholder="Conjunto 1402"
                      value={settings.addressComplement || ''}
                      onChange={(e) => setSettings({ ...settings, addressComplement: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Bairro
                    </label>
                    <input
                      type="text"
                      placeholder="Bela Vista"
                      value={settings.addressNeighborhood || ''}
                      onChange={(e) => setSettings({ ...settings, addressNeighborhood: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.5fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Cidade
                    </label>
                    <input
                      type="text"
                      placeholder="São Paulo"
                      value={settings.addressCity || ''}
                      onChange={(e) => setSettings({ ...settings, addressCity: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      UF
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="SP"
                      value={settings.addressState || 'SP'}
                      onChange={(e) => setSettings({ ...settings, addressState: e.target.value.toUpperCase() })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      CEP
                    </label>
                    <input
                      type="text"
                      placeholder="01310-100"
                      value={settings.addressZipCode || ''}
                      onChange={(e) => setSettings({ ...settings, addressZipCode: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                    />
                  </div>
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
                  background: '#0f172a',
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
                <span>{loading ? 'Salvando...' : 'Salvar Dados Cadastrais'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PERFIL DO NUTRICIONISTA (CRN) */}
        {activeTab === 'nutritionist' && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            maxWidth: '850px',
            margin: '0 auto',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  🩺 Perfil Profissional do Nutricionista & Registro CRN
                </h2>
                <span style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1px solid #bfdbfe',
                }}>
                  CFN Res. 600/2018
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                O registro no Conselho Regional de Nutricionistas (CRN) é obrigatório por lei federal para emissão de planos alimentares e receitas válidas.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Nome Completo (Civil)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sofia Alencar Silva"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Nome Profissional (Como aparecerá nos receituários)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Sofia Alencar"
                    value={profile.professionalName}
                    onChange={(e) => setProfile({ ...profile, professionalName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Número do Registro CRN (Obrigatório)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CRN-3 48.912/P"
                    value={profile.crnNumber}
                    onChange={(e) => setProfile({ ...profile, crnNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Região do Conselho (CRN)
                  </label>
                  <select
                    value={profile.crnRegion}
                    onChange={(e) => setProfile({ ...profile, crnRegion: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: 'white', boxSizing: 'border-box' }}
                  >
                    <option value="CRN-1">CRN-1 (DF, GO, MT, TO)</option>
                    <option value="CRN-2">CRN-2 (RS)</option>
                    <option value="CRN-3">CRN-3 (SP, MS)</option>
                    <option value="CRN-4">CRN-4 (RJ, ES)</option>
                    <option value="CRN-5">CRN-5 (BA, SE)</option>
                    <option value="CRN-6">CRN-6 (PE, AL, PB, RN)</option>
                    <option value="CRN-7">CRN-7 (PA, AM, AP, AC, RO, RR)</option>
                    <option value="CRN-8">CRN-8 (PR)</option>
                    <option value="CRN-9">CRN-9 (MG)</option>
                    <option value="CRN-10">CRN-10 (SC)</option>
                    <option value="CRN-11">CRN-11 (CE, MA, PI)</option>
                  </select>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  Especialidades Clínicas & Foco de Atuação
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Adicionar especialidade (Ex: Nutrição Esportiva, Emagrecimento, Obesidade)"
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  Mini-biografia Profissional
                </label>
                <textarea
                  rows={3}
                  placeholder="Apresente sua formação acadêmica, pós-graduações e abordagem clínica..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="techManager"
                  checked={profile.isTechnicalManager}
                  onChange={(e) => setProfile({ ...profile, isTechnicalManager: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="techManager" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
                  Profissional é o Responsável Técnico (RT) da Clínica perante o CFN/CRN
                </label>
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
                <span>{loading ? 'Salvando...' : 'Salvar Perfil Profissional & CRN'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: GESTÃO DE EQUIPE & RBAC */}
        {activeTab === 'team' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
            {/* Team List */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                  👥 Colaboradores & Papéis de Acesso (RBAC)
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Cada perfil possui permissões estritas baseadas em segurança da informação médica e LGPD.
                </p>
              </div>

              {/* Members Table */}
              <div style={{ overflowX: 'auto' }}>
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
              </div>

              {/* Strict Notice regarding LGPD & CFN */}
              <div style={{
                marginTop: '1.5rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                padding: '1rem',
                display: 'flex',
                gap: '0.75rem',
              }}>
                <ShieldAlert size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong>Regra Estrita de Sigilo Médico (LGPD & CFN):</strong>
                  <br />
                  Usuários com papel <code>SECRETARY</code> têm acesso apenas à agenda e cadastros básicos de contato. O prontuário clínico, medidas corporais e exames laboratoriais permanecem criptografados e acessíveis exclusivamente aos nutricionistas e ao próprio paciente.
                </div>
              </div>
            </div>

            {/* Invite Form */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              height: 'fit-content',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <UserPlus size={20} color="#059669" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>
                  Convidar Novo Membro
                </h3>
              </div>

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
                    Papel de Acesso (Cargo)
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: 'white', boxSizing: 'border-box' }}
                  >
                    <option value="NUTRITIONIST">Nutricionista Associado (Atende pacientes)</option>
                    <option value="ADMIN">Gerente / Administrador da Clínica</option>
                    <option value="SECRETARY">Recepção / Secretária (Apenas agendamento)</option>
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
                    marginTop: '0.5rem',
                  }}
                >
                  {loading ? 'Gerando convite...' : 'Gerar Convite de Acesso'}
                </button>
              </form>

              {inviteLinkGenerated && (
                <div style={{
                  marginTop: '1.25rem',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', marginBottom: '0.25rem' }}>
                    Link de Ativação (Válido por 48 horas):
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      readOnly
                      value={inviteLinkGenerated}
                      style={{
                        flex: 1,
                        fontSize: '0.75rem',
                        padding: '0.375rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #6ee7b7',
                        background: 'white',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(inviteLinkGenerated);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      style={{
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        padding: '0.375rem 0.625rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
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
