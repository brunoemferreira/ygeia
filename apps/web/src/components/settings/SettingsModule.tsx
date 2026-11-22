import React, { useState } from 'react';
import {
  Search,
  User,
  Key,
  ShieldCheck,
  Globe,
  AlertTriangle,
  MapPin,
  Tag,
  Calendar,
  Link2,
  Users,
  FileText,
  PenTool,
  CreditCard,
  Palette,
  Smartphone,
  LayoutGrid,
  Save,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { WhiteLabelStudio } from './WhiteLabelStudio';

interface SettingsModuleProps {
  initialSubTab?: string;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ initialSubTab = 'personal' }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<string>(initialSubTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state for "Dados pessoais"
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  // 1. Personal Identification State (Defaults matching user screenshot)
  const [personalData, setPersonalData] = useState({
    nomeCompleto: user?.fullName || 'Bruno Ferreira',
    email: user?.email || 'brunoemf@gmail.com',
    telefone: '+55 199929220',
    crn: '',
    cpfCnpj: '218.980.718-29',
    especialidades: '',
    cep: '13060611',
    logradouro: 'Rua Doutor Jeber Juabre, nº 145, Jardim Márcia',
    cidadeUf: '',
    fotoUrl: '/bruno-profile.jpg',
  });

  // 2. Team / Secretárias
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Juliana Paes', email: 'secretaria@consultorio.com', role: 'Secretária', status: 'Ativo' },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Notification handler via Toast
  const triggerSuccess = (msg: string) => {
    toast.success(msg);
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingPersonal(false);
    triggerSuccess('Dados pessoais atualizados com sucesso!');
  };

  // Submenu structure matching user image exactly
  const navCategories = [
    {
      id: 'conta',
      title: 'CONTA',
      items: [
        { id: 'personal', label: 'Dados pessoais', icon: User },
        { id: 'password', label: 'Senha', icon: Key },
        { id: 'two_factor', label: 'Verificação em duas etapas', icon: ShieldCheck },
        { id: 'language', label: 'Idioma', icon: Globe },
        { id: 'danger_zone', label: 'Zona de perigo', icon: AlertTriangle, danger: true },
      ],
    },
    {
      id: 'atendimento',
      title: 'ATENDIMENTO',
      items: [
        { id: 'locations', label: 'Locais de Atendimento', icon: MapPin },
        { id: 'tags', label: 'Tratamentos e tags', icon: Tag },
        { id: 'calendar', label: 'Google Calendar', icon: Calendar },
        { id: 'links', label: 'Meus links', icon: Link2 },
        { id: 'secretarias', label: 'Secretárias', icon: Users },
      ],
    },
    {
      id: 'documentos',
      title: 'DOCUMENTOS E ASSINATURA',
      items: [
        { id: 'letterhead', label: 'Papel timbrado', icon: FileText },
        { id: 'signature', label: 'Imagem da assinatura', icon: PenTool },
        { id: 'digital_cert', label: 'Assinatura Digital ICP-Brasil', icon: ShieldCheck },
        { id: 'cnpj_card', label: 'Cartão CNPJ', icon: CreditCard },
      ],
    },
    {
      id: 'aparencia',
      title: 'APARÊNCIA',
      items: [
        { id: 'personalizacao', label: 'Personalização', icon: Palette },
        { id: 'pdf_custom', label: 'Personalizar PDF', icon: FileText },
        { id: 'patient_app', label: 'App do Paciente', icon: Smartphone },
        { id: 'menu_custom', label: 'Meu menu', icon: LayoutGrid },
      ],
    },
  ];

  // Filter items by search term
  const filteredCategories = navCategories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
          Configurações
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Gerencie suas preferências, dados pessoais e configurações do sistema.
        </p>
      </div>

      {/* Two-Column Card Container */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          minHeight: '680px',
          overflow: 'hidden',
        }}
      >
        {/* Left Submenu Navigation */}
        <div
          style={{
            borderRight: '1px solid #f1f5f9',
            padding: '1.25rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              placeholder="Procurar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                fontSize: '0.8125rem',
                boxSizing: 'border-box',
                outline: 'none',
                color: '#334155',
              }}
            />
          </div>

          {/* Nav Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredCategories.map((cat) => (
              <div key={cat.id}>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    color: '#64748b',
                    letterSpacing: '0.06em',
                    marginBottom: '0.5rem',
                    padding: '0 0.5rem',
                  }}
                >
                  {cat.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                  {cat.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: isActive ? '#f1f5f9' : 'transparent',
                          color: isActive
                            ? '#0f172a'
                            : item.danger
                            ? '#ef4444'
                            : '#475569',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease',
                          width: '100%',
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <Icon size={16} strokeWidth={isActive ? 2.2 : 1.75} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Details Content */}
        <div style={{ padding: '2rem 2.5rem', overflowY: 'auto' }}>
          {/* TAB: DADOS PESSOAIS (Exactly as in user image) */}
          {activeTab === 'personal' && (
            <div>
              {/* Header with Title and Green Edit Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.75rem',
                }}
              >
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Dados pessoais
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  style={{
                    background: isEditingPersonal ? '#0f172a' : '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.45rem 1.125rem',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isEditingPersonal ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              {/* Form container */}
              <form onSubmit={handleSavePersonal}>
                {/* Section Foto */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.875rem' }}>
                    Foto
                  </div>
                  <div
                    style={{
                      border: '1px dashed #cbd5e1',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      background: '#ffffff',
                    }}
                  >
                    {/* User profile picture box */}
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        background: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1.5rem',
                        flexShrink: 0,
                      }}
                    >
                      {personalData.fotoUrl ? (
                        <img
                          src={personalData.fotoUrl}
                          alt="Foto de perfil"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        'BF'
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        Foto de perfil
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        PNG, JPEG ou WEBP — máx. 10MB
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                        <button
                          type="button"
                          onClick={() => triggerSuccess('Selecione uma imagem do seu dispositivo.')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#0f172a',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Alterar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPersonalData({ ...personalData, fotoUrl: '' });
                            triggerSuccess('Foto removida.');
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section IDENTIFICAÇÃO */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#64748b',
                      letterSpacing: '0.06em',
                      marginBottom: '1rem',
                    }}
                  >
                    IDENTIFICAÇÃO
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Nome completo */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                        Nome completo
                      </span>
                      {isEditingPersonal ? (
                        <input
                          type="text"
                          value={personalData.nomeCompleto}
                          onChange={(e) => setPersonalData({ ...personalData, nomeCompleto: e.target.value })}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                          {personalData.nomeCompleto}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                        Email
                      </span>
                      {isEditingPersonal ? (
                        <input
                          type="email"
                          value={personalData.email}
                          onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                          {personalData.email}
                        </span>
                      )}
                    </div>

                    {/* Telefone */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                        Telefone
                      </span>
                      {isEditingPersonal ? (
                        <input
                          type="text"
                          value={personalData.telefone}
                          onChange={(e) => setPersonalData({ ...personalData, telefone: e.target.value })}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                          {personalData.telefone}
                        </span>
                      )}
                    </div>

                    {/* CRN */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                        CRN
                      </span>
                      {isEditingPersonal ? (
                        <input
                          type="text"
                          value={personalData.crn}
                          onChange={(e) => setPersonalData({ ...personalData, crn: e.target.value })}
                          placeholder="Ex: CRN-3 48.912/P"
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: personalData.crn ? '#475569' : '#94a3b8' }}>
                          {personalData.crn || '—'}
                        </span>
                      )}
                    </div>

                    {/* CPF / CNPJ */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                        CPF / CNPJ
                      </span>
                      {isEditingPersonal ? (
                        <input
                          type="text"
                          value={personalData.cpfCnpj}
                          onChange={(e) => setPersonalData({ ...personalData, cpfCnpj: e.target.value })}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                          {personalData.cpfCnpj}
                        </span>
                      )}
                    </div>

                    {/* Especialidades */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                        Especialidades
                      </span>
                      {isEditingPersonal ? (
                        <input
                          type="text"
                          value={personalData.especialidades}
                          onChange={(e) => setPersonalData({ ...personalData, especialidades: e.target.value })}
                          placeholder="Ex: Nutrição Esportiva, Emagrecimento"
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: personalData.especialidades ? '#475569' : '#94a3b8' }}>
                          {personalData.especialidades || '—'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section ENDEREÇO */}
                <div style={{ marginBottom: '2rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        color: '#64748b',
                        letterSpacing: '0.06em',
                      }}
                    >
                      ENDEREÇO
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Consultório ou residência
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* CEP */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                        CEP
                      </span>
                      {isEditingPersonal ? (
                        <input
                          type="text"
                          value={personalData.cep}
                          onChange={(e) => setPersonalData({ ...personalData, cep: e.target.value })}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                          {personalData.cep}
                        </span>
                      )}
                    </div>

                    {/* Logradouro */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                        Logradouro
                      </span>
                      {isEditingPersonal ? (
                        <input
                          type="text"
                          value={personalData.logradouro}
                          onChange={(e) => setPersonalData({ ...personalData, logradouro: e.target.value })}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                          {personalData.logradouro}
                        </span>
                      )}
                    </div>

                    {/* Cidade / UF */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        padding: '0.875rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                        Cidade / UF
                      </span>
                      {isEditingPersonal ? (
                        <input
                          type="text"
                          value={personalData.cidadeUf}
                          onChange={(e) => setPersonalData({ ...personalData, cidadeUf: e.target.value })}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: personalData.cidadeUf ? '#475569' : '#94a3b8' }}>
                          {personalData.cidadeUf || '—'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save button when in edit mode */}
                {isEditingPersonal && (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="submit"
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.625rem 1.5rem',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Save size={16} />
                      <span>Salvar Alterações</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPersonal(false)}
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.625rem 1.25rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB: PERSONALIZAÇÃO / WHITE LABEL STUDIO (SÊNIOR) */}
          {activeTab === 'personalizacao' && (
            <WhiteLabelStudio />
          )}

          {/* TAB: SECRETÁRIAS & EQUIPE */}
          {activeTab === 'secretarias' && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  👥 Secretárias & Acessos
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Cadastre secretárias ou assistentes para agendar consultas e recepcionar pacientes.
                </p>
              </div>

              {/* Convidar Secretária */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Adicionar Nova Secretária
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="email"
                    placeholder="email.secretaria@consultorio.com"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.625rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newMemberEmail.trim()) {
                        setTeamMembers([
                          ...teamMembers,
                          {
                            id: String(Date.now()),
                            name: newMemberEmail.split('@')[0],
                            email: newMemberEmail,
                            role: 'Secretária',
                            status: 'Convite Enviado',
                          },
                        ]);
                        setNewMemberEmail('');
                        triggerSuccess('Convite enviado com sucesso para a secretária!');
                      }
                    }}
                    style={{
                      background: '#0f172a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.625rem 1.25rem',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <Plus size={16} />
                    <span>Convidar</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Membros */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Nome / E-mail</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Cargo</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                          <div>{member.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>{member.email}</div>
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{member.role}</td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span
                            style={{
                              background: '#ecfdf5',
                              color: '#065f46',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                            }}
                          >
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PAPEL TIMBRADO */}
          {activeTab === 'letterhead' && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  📄 Papel Timbrado & Prescrições
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Faça o upload do fundo timbrado ou cabeçalho oficial para planos alimentares e receitas.
                </p>
              </div>

              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '1rem',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  background: '#f8fafc',
                  cursor: 'pointer',
                }}
                onClick={() => triggerSuccess('Upload de modelo timbrado (PDF/PNG) concluído!')}
              >
                <FileText size={40} color="#059669" style={{ margin: '0 auto 1rem auto' }} />
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                  Clique para selecionar seu modelo timbrado
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Arquivos suportados: PDF ou PNG em alta resolução (A4)
                </div>
              </div>
            </div>
          )}

          {/* TAB: GOOGLE CALENDAR */}
          {activeTab === 'calendar' && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  📅 Sincronização Google Calendar
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Sincronize automaticamente os agendamentos de consultas com sua agenda pessoal.
                </p>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Calendar size={28} color="#059669" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      Conectar com o Google Agenda
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Atualiza seus horários em tempo real no smartphone e computador
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerSuccess('Google Calendar conectado com sucesso!')}
                  style={{
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.55rem 1.25rem',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  Conectar Agenda
                </button>
              </div>
            </div>
          )}

          {/* TAB: SENHA E SEGURANÇA */}
          {activeTab === 'password' && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  🔑 Alterar Senha de Acesso
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Suas credenciais são criptografadas com o algoritmo padrão da indústria Argon2id.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  triggerSuccess('Senha alterada com sucesso!');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 8 caracteres"
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: '#0f172a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                  }}
                >
                  Atualizar Senha
                </button>
              </form>
            </div>
          )}

          {/* Fallback for other settings tabs */}
          {activeTab !== 'personal' &&
            activeTab !== 'personalizacao' &&
            activeTab !== 'secretarias' &&
            activeTab !== 'letterhead' &&
            activeTab !== 'calendar' &&
            activeTab !== 'password' && (
              <div>
                <div style={{ marginBottom: '1.75rem' }}>
                  <h2 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                    {navCategories.flatMap((c) => c.items).find((i) => i.id === activeTab)?.label || 'Configuração'}
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                    Painel de personalização e regras operacionais do consultório.
                  </p>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Parâmetro Ativo & Configurado
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
                    Esta preferência está sincronizada com a política de governança e isolamento de dados do sistema.
                  </p>
                  <button
                    type="button"
                    onClick={() => triggerSuccess('Preferência salva!')}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1.25rem',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    Salvar Preferência
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
