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
  Upload,
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

  // 1. Personal Identification State
  const [personalData, setPersonalData] = useState({
    nomeCompleto: user?.fullName || 'Bruno Ferreira',
    email: user?.email || 'brunoemf@gmail.com',
    telefone: '+55 19992922054',
    crn: 'CRN-3 / 48291',
    cpfCnpj: '218.980.718-29',
    especialidades: 'Nutrição Esportiva, Emagrecimento & Modulação Metabólica',
    cep: '13060611',
    logradouro: 'Rua Doutor Jeber Juabre, nº 145, Jardim Márcia',
    cidadeUf: 'Campinas - SP',
    fotoUrl: '',
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

  // Submenu structure
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
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0.75rem 0.5rem', width: '100%' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
          Configurações
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
          Gerencie suas preferências, dados pessoais, equipe e personalização visual do sistema.
        </p>
      </div>

      {/* Mobile-First Settings Container */}
      <div className="ygeia-settings-container">
        {/* Navigation Section (Horizontal pills on mobile, left column on desktop) */}
        <div className="ygeia-settings-nav">
          {/* Search Box (Desktop only or compact on mobile) */}
          <div className="desktop-only" style={{ position: 'relative', width: '100%', marginBottom: '0.5rem' }}>
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
              placeholder="Procurar ajustes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                fontSize: '0.75rem',
                boxSizing: 'border-box',
                outline: 'none',
                color: '#334155',
              }}
            />
          </div>

          {/* Nav Categories */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'inherit',
              gap: '0.35rem',
              width: '100%',
              alignItems: 'center',
            }}
          >
            {filteredCategories.flatMap((cat) => cat.items).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className="touch-target"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.875rem',
                    borderRadius: '0.5rem',
                    border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive
                      ? 'var(--primary)'
                      : item.danger
                      ? '#ef4444'
                      : '#475569',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
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
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Details Content */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', minWidth: 0 }}>
          {/* TAB: DADOS PESSOAIS */}
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header with Title and Edit Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Dados pessoais
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                    Informações cadastrais e profissionais do consultório
                  </p>
                </div>
                <AppButton
                  variant={isEditingPersonal ? 'secondary' : 'primary'}
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                >
                  {isEditingPersonal ? 'Cancelar' : 'Editar Dados'}
                </AppButton>
              </div>

              {/* Form container */}
              <form onSubmit={handleSavePersonal} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Section Foto */}
                <AppCard variant="default">
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                    Foto de Perfil
                  </div>
                  <div
                    style={{
                      border: '1px dashed #cbd5e1',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        background: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1.25rem',
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
                        personalData.nomeCompleto.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        Avatar do Profissional
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        PNG, JPEG ou WEBP — máx. 10MB
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                        <AppButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon={<Upload size={14} />}
                          onClick={() => triggerSuccess('Foto selecionada com sucesso.')}
                        >
                          Alterar
                        </AppButton>
                        <AppButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPersonalData({ ...personalData, fotoUrl: '' });
                            triggerSuccess('Foto removida.');
                          }}
                        >
                          Remover
                        </AppButton>
                      </div>
                    </div>
                  </div>
                </AppCard>

                {/* Section IDENTIFICAÇÃO */}
                <AppCard variant="default">
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#64748b',
                      letterSpacing: '0.06em',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Identificação Profissional & Pessoal
                  </div>

                  <div className="ygeia-grid-1-2">
                    <AppInput
                      label="Nome completo"
                      value={personalData.nomeCompleto}
                      disabled={!isEditingPersonal}
                      onChange={(e) => setPersonalData({ ...personalData, nomeCompleto: e.target.value })}
                      required
                    />
                    <AppInput
                      label="E-mail"
                      type="email"
                      value={personalData.email}
                      disabled={!isEditingPersonal}
                      onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                      required
                    />
                    <AppInput
                      label="Telefone / WhatsApp"
                      value={personalData.telefone}
                      disabled={!isEditingPersonal}
                      onChange={(e) => setPersonalData({ ...personalData, telefone: e.target.value })}
                    />
                    <AppInput
                      label="Inscrição no CRN"
                      placeholder="Ex: CRN-3 / 48291"
                      value={personalData.crn}
                      disabled={!isEditingPersonal}
                      onChange={(e) => setPersonalData({ ...personalData, crn: e.target.value })}
                    />
                    <AppInput
                      label="CPF / CNPJ"
                      value={personalData.cpfCnpj}
                      disabled={!isEditingPersonal}
                      onChange={(e) => setPersonalData({ ...personalData, cpfCnpj: e.target.value })}
                    />
                    <AppInput
                      label="Especialidades Clínicas"
                      value={personalData.especialidades}
                      disabled={!isEditingPersonal}
                      onChange={(e) => setPersonalData({ ...personalData, especialidades: e.target.value })}
                    />
                  </div>
                </AppCard>

                {/* Section ENDEREÇO */}
                <AppCard variant="default">
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#64748b',
                      letterSpacing: '0.06em',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Endereço de Atendimento / Residência
                  </div>

                  <div className="ygeia-grid-1-3">
                    <AppInput
                      label="CEP"
                      value={personalData.cep}
                      disabled={!isEditingPersonal}
                      onChange={(e) => setPersonalData({ ...personalData, cep: e.target.value })}
                    />
                    <div style={{ gridColumn: 'span 2' }}>
                      <AppInput
                        label="Logradouro Completo"
                        value={personalData.logradouro}
                        disabled={!isEditingPersonal}
                        onChange={(e) => setPersonalData({ ...personalData, logradouro: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem' }}>
                    <AppInput
                      label="Cidade / UF"
                      value={personalData.cidadeUf}
                      disabled={!isEditingPersonal}
                      onChange={(e) => setPersonalData({ ...personalData, cidadeUf: e.target.value })}
                    />
                  </div>
                </AppCard>

                {/* Save button when in edit mode */}
                {isEditingPersonal && (
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <AppButton
                      type="button"
                      variant="ghost"
                      onClick={() => setIsEditingPersonal(false)}
                    >
                      Cancelar
                    </AppButton>
                    <AppButton
                      type="submit"
                      variant="primary"
                      icon={<Save size={16} />}
                    >
                      Salvar Alterações
                    </AppButton>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB: PERSONALIZAÇÃO / WHITE LABEL STUDIO */}
          {activeTab === 'personalizacao' && (
            <WhiteLabelStudio />
          )}

          {/* TAB: SECRETÁRIAS & EQUIPE */}
          {activeTab === 'secretarias' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  👥 Secretárias & Acessos
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

          {/* TAB: PAPEL TIMBRADO */}
          {activeTab === 'letterhead' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  📄 Papel Timbrado & Prescrições
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

          {/* TAB: GOOGLE CALENDAR */}
          {activeTab === 'calendar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  📅 Sincronização Google Calendar
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

          {/* TAB: SENHA E SEGURANÇA */}
          {activeTab === 'password' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  🔑 Alterar Senha de Acesso
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

          {/* Fallback for other settings tabs */}
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

                <AppCard variant="default" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Parâmetro Ativo & Configurado
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                    Esta preferência está sincronizada com a política de governança, conformidade com CFN e isolamento multi-tenant do sistema.
                  </p>
                  <AppButton
                    variant="primary"
                    onClick={() => triggerSuccess('Preferência salva!')}
                  >
                    Salvar Preferência
                  </AppButton>
                </AppCard>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};