import React, { useState } from 'react';
import {
  Search,
  User,
  Key,
  ShieldCheck,
  Languages,
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
import { AppCard, AppButton, AppInput, AppBadge } from '../ui';

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

  // Personal Identification State (Fiel à imagem de referência)
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

  // Team / Secretárias
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Juliana Paes', email: 'secretaria@consultorio.com', role: 'Secretária', status: 'Ativo' },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const triggerSuccess = (msg: string) => {
    toast.success(msg);
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingPersonal(false);
    triggerSuccess('Dados pessoais atualizados com sucesso!');
  };

  // Categorias estruturadas idênticas ao Better Health (imagem do usuário)
  const navCategories = [
    {
      id: 'conta',
      title: 'CONTA',
      items: [
        { id: 'personal', label: 'Dados pessoais', icon: User },
        { id: 'password', label: 'Senha', icon: Key },
        { id: 'two_factor', label: 'Verificação em duas etapas', icon: ShieldCheck },
        { id: 'language', label: 'Idioma', icon: Languages },
        { id: 'danger_zone', label: 'Zona de perigo', icon: AlertTriangle },
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

  // Filtro de subitens por busca
  const filteredCategories = navCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* 1. Header Idêntico ao Better Health (Imagem do usuário) */}
      <div style={{ paddingLeft: '0.25rem' }}>
        <div
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: '0.35rem',
          }}
        >
          CONFIGURAÇÃO
        </div>
        <h1
          style={{
            margin: '0 0 0.35rem 0',
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#0f172a',
            lineHeight: 1.2,
          }}
        >
          Configurações
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
          Gerencie suas preferências, dados pessoais e configurações do sistema.
        </p>
      </div>

      {/* 2. Layout em 2 Colunas (Sidebar Aberta à Esquerda + Card Principal à Direita) */}
      <div className="ygeia-settings-layout">
        {/* COLUNA ESQUERDA: NAVEGAÇÃO POR CATEGORIAS */}
        <aside className="ygeia-settings-sidebar">
          {/* Caixa de Busca com Ícone */}
          <div style={{ position: 'relative', width: '100%', marginBottom: '0.25rem' }}>
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
                padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                fontSize: '0.8125rem',
                boxSizing: 'border-box',
                outline: 'none',
                color: '#0f172a',
                transition: 'all 0.15s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Lista de Grupos */}
          {filteredCategories.map((cat, idx) => (
            <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', marginTop: idx === 0 ? '0.75rem' : '1.25rem' }}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '0 0.5rem',
                  marginBottom: '0.35rem',
                }}
              >
                {cat.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsEditingPersonal(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                        color: isActive ? '#0f172a' : '#475569',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        width: '100%',
                      }}
                      onMouseOver={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <Icon
                        size={16}
                        strokeWidth={isActive ? 2 : 1.75}
                        style={{
                          flexShrink: 0,
                          color: isActive ? '#0f172a' : '#64748b',
                        }}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* COLUNA DIREITA: CARD PRINCIPAL BRANCO */}
        <main className="ygeia-settings-content">
          {/* SUB-ABA 1: DADOS PESSOAIS (IDÊNTICO À IMAGEM) */}
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header do Card com Título e Botão Editar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}
              >
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Dados pessoais
                </h2>
                {!isEditingPersonal ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingPersonal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '0.375rem',
                      backgroundColor: 'var(--primary)',
                      padding: '0.45rem 1.15rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
                  >
                    Editar
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingPersonal(false)}
                      style={{
                        padding: '0.45rem 0.875rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePersonal}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
                      onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
                    >
                      Salvar
                    </button>
                  </div>
                )}
              </div>

              {!isEditingPersonal ? (
                /* MODO VISUALIZAÇÃO (IDÊNTICO À IMAGEM) */
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Bloco Foto */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Foto
                    </span>
                    <div
                      style={{
                        border: '1px dashed #cbd5e1',
                        borderRadius: '0.5rem',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem',
                      }}
                    >
                      <img
                        src={personalData.fotoUrl || '/bruno-profile.jpg'}
                        alt={personalData.nomeCompleto}
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '0.5rem',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/bruno-profile.jpg';
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                          Foto de perfil
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.2rem 0 0.65rem 0' }}>
                          PNG, JPEG ou WEBP — máx. 10MB
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => triggerSuccess('Selecione uma nova imagem para atualizar seu perfil.')}
                            style={{
                              padding: '0.3rem 0.75rem',
                              borderRadius: '0.375rem',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#334155',
                              cursor: 'pointer',
                            }}
                          >
                            Alterar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPersonalData((prev) => ({ ...prev, fotoUrl: '' }));
                              triggerSuccess('Foto removida.');
                            }}
                            style={{
                              padding: '0.3rem 0.5rem',
                              borderRadius: '0.375rem',
                              border: 'none',
                              backgroundColor: 'transparent',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              color: '#64748b',
                              cursor: 'pointer',
                            }}
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bloco IDENTIFICAÇÃO */}
                  <div style={{ marginTop: '2rem' }}>
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.35rem',
                      }}
                    >
                      IDENTIFICAÇÃO
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '0.75rem 0', fontSize: '0.8125rem' }}>
                        <span style={{ width: '220px', fontWeight: 500, color: '#0f172a', flexShrink: 0 }}>Nome completo</span>
                        <span style={{ color: '#334155' }}>{personalData.nomeCompleto}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '0.75rem 0', fontSize: '0.8125rem' }}>
                        <span style={{ width: '220px', fontWeight: 500, color: '#0f172a', flexShrink: 0 }}>Email</span>
                        <span style={{ color: '#334155' }}>{personalData.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '0.75rem 0', fontSize: '0.8125rem' }}>
                        <span style={{ width: '220px', fontWeight: 500, color: '#0f172a', flexShrink: 0 }}>Telefone</span>
                        <span style={{ color: '#334155' }}>{personalData.telefone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '0.75rem 0', fontSize: '0.8125rem' }}>
                        <span style={{ width: '220px', fontWeight: 500, color: '#0f172a', flexShrink: 0 }}>CRN</span>
                        <span style={{ color: '#94a3b8' }}>{personalData.crn || '—'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '0.75rem 0', fontSize: '0.8125rem' }}>
                        <span style={{ width: '220px', fontWeight: 500, color: '#0f172a', flexShrink: 0 }}>CPF / CNPJ</span>
                        <span style={{ color: '#334155' }}>{personalData.cpfCnpj}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '0.75rem 0', fontSize: '0.8125rem' }}>
                        <span style={{ width: '220px', fontWeight: 500, color: '#0f172a', flexShrink: 0 }}>Especialidades</span>
                        <span style={{ color: '#94a3b8' }}>{personalData.especialidades || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bloco ENDEREÇO */}
                  <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        ENDEREÇO
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Consultório ou residência</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '0.75rem 0', fontSize: '0.8125rem' }}>
                        <span style={{ width: '220px', fontWeight: 500, color: '#0f172a', flexShrink: 0 }}>CEP</span>
                        <span style={{ color: '#334155' }}>{personalData.cep}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '0.75rem 0', fontSize: '0.8125rem' }}>
                        <span style={{ width: '220px', fontWeight: 500, color: '#0f172a', flexShrink: 0 }}>Logradouro</span>
                        <span style={{ color: '#334155' }}>{personalData.logradouro}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '0.75rem 0', fontSize: '0.8125rem' }}>
                        <span style={{ width: '220px', fontWeight: 500, color: '#0f172a', flexShrink: 0 }}>Cidade / UF</span>
                        <span style={{ color: '#94a3b8' }}>{personalData.cidadeUf || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODO EDIÇÃO */
                <form onSubmit={handleSavePersonal} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="ygeia-grid-1-2">
                    <AppInput
                      label="Nome completo"
                      value={personalData.nomeCompleto}
                      onChange={(e) => setPersonalData({ ...personalData, nomeCompleto: e.target.value })}
                      required
                    />
                    <AppInput
                      label="E-mail"
                      type="email"
                      value={personalData.email}
                      onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                      required
                    />
                    <AppInput
                      label="Telefone / WhatsApp"
                      value={personalData.telefone}
                      onChange={(e) => setPersonalData({ ...personalData, telefone: e.target.value })}
                    />
                    <AppInput
                      label="Inscrição no CRN"
                      placeholder="Ex: CRN-3 / 48291"
                      value={personalData.crn}
                      onChange={(e) => setPersonalData({ ...personalData, crn: e.target.value })}
                    />
                    <AppInput
                      label="CPF / CNPJ"
                      value={personalData.cpfCnpj}
                      onChange={(e) => setPersonalData({ ...personalData, cpfCnpj: e.target.value })}
                    />
                    <AppInput
                      label="Especialidades Clínicas"
                      value={personalData.especialidades}
                      onChange={(e) => setPersonalData({ ...personalData, especialidades: e.target.value })}
                      placeholder="Ex: Nutrição Esportiva, Emagrecimento"
                    />
                  </div>

                  <div style={{ marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                      Endereço
                    </div>
                    <div className="ygeia-grid-1-3">
                      <AppInput
                        label="CEP"
                        value={personalData.cep}
                        onChange={(e) => setPersonalData({ ...personalData, cep: e.target.value })}
                      />
                      <div style={{ gridColumn: 'span 2' }}>
                        <AppInput
                          label="Logradouro"
                          value={personalData.logradouro}
                          onChange={(e) => setPersonalData({ ...personalData, logradouro: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      <AppInput
                        label="Cidade / UF"
                        value={personalData.cidadeUf}
                        placeholder="Ex: Campinas / SP"
                        onChange={(e) => setPersonalData({ ...personalData, cidadeUf: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingPersonal(false)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <Save size={15} />
                      <span>Salvar Alterações</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SUB-ABA: PERSONALIZAÇÃO / WHITE LABEL STUDIO */}
          {activeTab === 'personalizacao' && (
            <WhiteLabelStudio />
          )}

          {/* SUB-ABA: SECRETÁRIAS & EQUIPE */}
          {activeTab === 'secretarias' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  Secretárias & Equipe
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Cadastre secretárias ou assistentes para agendar consultas e recepcionar pacientes.
                </p>
              </div>

              {/* Convidar Secretária */}
              <AppCard variant="default">
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Adicionar Nova Secretária
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <AppInput
                      type="email"
                      placeholder="email.secretaria@consultorio.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </div>
                  <AppButton
                    type="button"
                    variant="primary"
                    icon={<Plus size={16} />}
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
                  >
                    Convidar
                  </AppButton>
                </div>
              </AppCard>

              {/* Tabela de Membros */}
              <AppCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
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
                            <AppBadge variant="success">
                              {member.status}
                            </AppBadge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AppCard>
            </div>
          )}

          {/* SUB-ABA: PAPEL TIMBRADO */}
          {activeTab === 'letterhead' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  Papel Timbrado & Prescrições
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Faça o upload do fundo timbrado ou cabeçalho oficial para planos alimentares e receitas.
                </p>
              </div>

              <div
                style={{
                  border: '2px dashed var(--primary-border)',
                  borderRadius: '1rem',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  background: 'var(--primary-light)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => triggerSuccess('Upload de modelo timbrado (PDF/PNG) concluído!')}
              >
                <FileText size={40} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                  Clique para selecionar seu modelo timbrado
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Arquivos suportados: PDF ou PNG em alta resolução (A4)
                </div>
              </div>
            </div>
          )}

          {/* SUB-ABA: GOOGLE CALENDAR */}
          {activeTab === 'calendar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  Sincronização Google Calendar
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Sincronize automaticamente os agendamentos de consultas com sua agenda pessoal.
                </p>
              </div>

              <AppCard variant="default">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Calendar size={28} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        Conectar com o Google Agenda
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Atualiza seus horários em tempo real no smartphone e computador
                      </div>
                    </div>
                  </div>
                  <AppButton
                    variant="primary"
                    onClick={() => triggerSuccess('Google Calendar conectado com sucesso!')}
                  >
                    Conectar Agenda
                  </AppButton>
                </div>
              </AppCard>
            </div>
          )}

          {/* SUB-ABA: SENHA E SEGURANÇA */}
          {activeTab === 'password' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  Alterar Senha de Acesso
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Suas credenciais são criptografadas com o algoritmo padrão da indústria Argon2id.
                </p>
              </div>

              <AppCard variant="default" style={{ maxWidth: '480px' }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    triggerSuccess('Senha alterada com sucesso!');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <AppInput
                    label="Senha Atual"
                    type="password"
                    required
                    placeholder="••••••••"
                  />
                  <AppInput
                    label="Nova Senha"
                    type="password"
                    required
                    placeholder="Mínimo 8 caracteres"
                    helperText="Recomendado combinar letras maiúsculas, números e símbolos."
                  />
                  <AppButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    style={{ marginTop: '0.5rem' }}
                  >
                    Atualizar Senha
                  </AppButton>
                </form>
              </AppCard>
            </div>
          )}

          {/* DEMAIS SUB-ABAS (FALLBACK LIMPO) */}
          {activeTab !== 'personal' &&
            activeTab !== 'personalizacao' &&
            activeTab !== 'secretarias' &&
            activeTab !== 'letterhead' &&
            activeTab !== 'calendar' &&
            activeTab !== 'password' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                    {navCategories.flatMap((c) => c.items).find((i) => i.id === activeTab)?.label || 'Configuração'}
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                    Painel de personalização e regras operacionais do consultório.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Parâmetro Ativo & Configurado
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                    Esta preferência está sincronizada com a política de governança, conformidade regulatória e isolamento multi-tenant do sistema.
                  </p>
                  <button
                    type="button"
                    onClick={() => triggerSuccess('Preferência salva com sucesso!')}
                    style={{
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      padding: '0.5rem 1.25rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Salvar Preferência
                  </button>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};
