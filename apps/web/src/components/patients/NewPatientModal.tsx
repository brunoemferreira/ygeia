import React, { useState } from 'react';
import {
  User,
  Activity,
  ShieldCheck,
  Building2,
  Camera,
  MapPin,
  FileText,
  Receipt,
  Bell,
  Check,
  X,
  Upload,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getStoredBranding } from '../../utils/branding';
import {
  COUNTRY_DIAL_CODES,
  CountryDialCode,
  CountryFlag,
  formatPhoneNumber,
} from './countryDialCodes';

export interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated?: (patient: any) => void;
}

type StepKey =
  | 'dados_pessoais'
  | 'tratamento'
  | 'convenio'
  | 'local'
  | 'foto'
  | 'endereco'
  | 'observacao'
  | 'atestado';

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onPatientCreated,
}) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  // Active step
  const [activeStep, setActiveStep] = useState<StepKey>('dados_pessoais');

  // Form State - Dados Pessoais
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [biologicalSex, setBiologicalSex] = useState<'FEMALE' | 'MALE' | ''>('');
  const [assignedSexAtBirth, setAssignedSexAtBirth] = useState('');
  const [genderIdentity, setGenderIdentity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryDialCode>(COUNTRY_DIAL_CODES[0]);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [cpf, setCpf] = useState('');

  const filteredCountries = countrySearch.trim()
    ? COUNTRY_DIAL_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.dialCode.includes(countrySearch) ||
          c.code.toLowerCase().includes(countrySearch.toLowerCase()),
      )
    : COUNTRY_DIAL_CODES;
  const [guardianName, setGuardianName] = useState('');
  const [guardianCpf, setGuardianCpf] = useState('');
  const [welcomeEmail, setWelcomeEmail] = useState(true);
  const [welcomeWhatsapp, setWelcomeWhatsapp] = useState(true);

  // Form State - Etapas Adicionais
  const [treatmentGoals, setTreatmentGoals] = useState('');
  const [insurancePlan, setInsurancePlan] = useState('');
  const [locationName, setLocationName] = useState('Consultório Principal');
  const [photoUrl, setPhotoUrl] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptCpfCnpj, setReceiptCpfCnpj] = useState('');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Formatadores de máscara simples
  const formatBirthDate = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const formatCpf = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Informe o nome completo do paciente.');
      return;
    }

    if (!birthDate.trim()) {
      toast.error('Informe a data de nascimento.');
      return;
    }

    if (!biologicalSex) {
      toast.error('Selecione o sexo de referência para cálculos.');
      return;
    }

    setLoading(true);

    try {
      const apiBase = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:4333') + '/api/v1';
      const res = await fetch(`${apiBase}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          birthDate: birthDate.includes('/')
            ? birthDate.split('/').reverse().join('-')
            : birthDate,
          biologicalSex,
          assignedSexAtBirth: assignedSexAtBirth || undefined,
          genderIdentity: genderIdentity || undefined,
          email: email.trim() || undefined,
          phone: phone.trim()
            ? phone.startsWith('+')
              ? phone.trim()
              : `${selectedCountry.dialCode} ${phone.trim()}`
            : undefined,
          cpf: cpf.trim() || undefined,
          guardianName: guardianName.trim() || undefined,
          guardianCpf: guardianCpf.trim() || undefined,
          welcomeEmail,
          welcomeWhatsapp,
          treatmentGoals: treatmentGoals.trim() || undefined,
          insurancePlan: insurancePlan.trim() || undefined,
          locationName: locationName.trim() || undefined,
          fullAddress: fullAddress.trim() || undefined,
          notes: notes.trim() || undefined,
          photoUrl: photoUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao cadastrar paciente.');
      }

      const newPatient = await res.json();
      toast.success(`Paciente ${fullName} cadastrado com sucesso!`);
      if (onPatientCreated) {
        onPatientCreated(newPatient);
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Falha ao salvar paciente.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'dados_pessoais', label: 'Dados pessoais', icon: User },
    { key: 'tratamento', label: 'Tratamento e protocolos', icon: Activity },
    { key: 'convenio', label: 'Convênio', icon: ShieldCheck },
    { key: 'local', label: 'Local de atendimento', icon: Building2 },
    { key: 'foto', label: 'Foto do paciente', icon: Camera },
    { key: 'endereco', label: 'Endereço completo', icon: MapPin },
    { key: 'observacao', label: 'Observação importante', icon: FileText },
    { key: 'atestado', label: 'Atestado e recibo', icon: Receipt },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafc',
          borderRadius: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Top Header do Modal */}
        <div
          style={{
            padding: '1.5rem 2rem 1.25rem 2rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: '0 0 0.25rem 0',
              }}
            >
              Novo paciente
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Preencha as etapas para cadastrar um novo paciente
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.4rem 0.6rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#0f172a';
              (e.currentTarget as HTMLElement).style.backgroundColor = '#e2e8f0';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#64748b';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            <span>Fechar</span>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body: 2 Colunas (Stepper + Form) */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '1.5rem',
            padding: '1.5rem 2rem 2rem 2rem',
            overflowY: 'auto',
          }}
        >
          {/* ====================================================
              COLUNA ESQUERDA: STEPPER DE ETAPAS
             ==================================================== */}
          <aside
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              padding: '1.25rem 0.75rem',
              height: 'fit-content',
            }}
          >
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: '#0f172a',
                padding: '0 0.75rem 0.75rem 0.75rem',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '0.5rem',
              }}
            >
              Novo paciente
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {steps.map((s) => {
                const IconComponent = s.icon;
                const isActive = activeStep === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setActiveStep(s.key as StepKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                      color: isActive ? '#059669' : '#64748b',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      borderLeft: isActive ? `3px solid #10b981` : '3px solid transparent',
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                        (e.currentTarget as HTMLElement).style.color = '#0f172a';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#64748b';
                      }
                    }}
                  >
                    <IconComponent size={16} color={isActive ? '#059669' : '#94a3b8'} />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ====================================================
              COLUNA DIREITA: FORMULÁRIO DO STEP ATIVO
             ==================================================== */}
          <main
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* ETAPA 1: DADOS PESSOAIS (CORRESPONDENTE AO MOCKUP) */}
              {activeStep === 'dados_pessoais' && (
                <>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                    Dados pessoais
                  </div>

                  {/* Nome completo */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Nome completo <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maria Silva"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                    />
                  </div>

                  {/* Data de nascimento & Sexo de referência para cálculos */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                        Data de nascimento <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="DD/MM/AAAA"
                        value={birthDate}
                        onChange={(e) => setBirthDate(formatBirthDate(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                        onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                        Sexo de referência para cálculos <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        required
                        value={biologicalSex}
                        onChange={(e) => setBiologicalSex(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          color: biologicalSex ? '#0f172a' : '#64748b',
                          backgroundColor: '#ffffff',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                        onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                      >
                        <option value="">Selecione</option>
                        <option value="FEMALE">Feminino</option>
                        <option value="MALE">Masculino</option>
                      </select>
                      <div style={{ fontSize: '0.71875rem', color: '#64748b', marginTop: '0.25rem', lineHeight: 1.3 }}>
                        Usado nos cálculos e nas faixas de referência. Revise conforme a avaliação clínica.
                      </div>
                    </div>
                  </div>

                  {/* Sexo atribuído ao nascimento & Identidade de gênero */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                        Sexo atribuído ao nascimento
                      </label>
                      <select
                        value={assignedSexAtBirth}
                        onChange={(e) => setAssignedSexAtBirth(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          color: assignedSexAtBirth ? '#0f172a' : '#64748b',
                          backgroundColor: '#ffffff',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                        onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                      >
                        <option value="">Selecione...</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Intersexo">Intersexo</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                        Identidade de gênero <span style={{ fontWeight: 400, color: '#64748b' }}>(opcional)</span>
                      </label>
                      <select
                        value={genderIdentity}
                        onChange={(e) => setGenderIdentity(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          color: genderIdentity ? '#0f172a' : '#64748b',
                          backgroundColor: '#ffffff',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                        onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                      >
                        <option value="">Selecione...</option>
                        <option value="Mulher cisgênero">Mulher cisgênero</option>
                        <option value="Homem cisgênero">Homem cisgênero</option>
                        <option value="Mulher transgênero">Mulher transgênero</option>
                        <option value="Homem transgênero">Homem transgênero</option>
                        <option value="Não-binário">Não-binário</option>
                        <option value="Outro">Outro</option>
                        <option value="Prefiro não informar">Prefiro não informar</option>
                      </select>
                    </div>
                  </div>

                  {/* E-mail & Telefone */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                        E-mail
                      </label>
                      <input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                        onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>
                        Telefone
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '0.5rem',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            height: '40px',
                            transition: 'all 0.15s ease',
                            overflow: 'visible',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setIsCountryPickerOpen((prev) => !prev)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRight: '1px solid #cbd5e1',
                              padding: '0 0.65rem',
                              height: '100%',
                              fontSize: '0.8125rem',
                              color: '#0f172a',
                              fontWeight: 500,
                              cursor: 'pointer',
                              outline: 'none',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                            title="Selecione o país do código de área telefônica"
                          >
                            <CountryFlag code={selectedCountry.code} flag={selectedCountry.flag} width={20} height={14} />
                            <span>{selectedCountry.dialCode}</span>
                            <ChevronDown size={12} color="#94a3b8" strokeWidth={1.75} />
                          </button>
                          <input
                            type="text"
                            placeholder={selectedCountry.placeholder}
                            maxLength={selectedCountry.maxLength}
                            value={phone}
                            onChange={(e) => setPhone(formatPhoneNumber(e.target.value, selectedCountry.code))}
                            style={{
                              flex: 1,
                              height: '100%',
                              border: 'none',
                              padding: '0 0.75rem',
                              fontSize: '0.8125rem',
                              color: '#0f172a',
                              outline: 'none',
                              backgroundColor: 'transparent',
                              boxSizing: 'border-box',
                              width: '100%',
                            }}
                            onFocus={(e) => {
                              const parent = e.target.parentElement;
                              if (parent) {
                                parent.style.borderColor = primaryColor;
                                parent.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.2)';
                              }
                            }}
                            onBlur={(e) => {
                              const parent = e.target.parentElement;
                              if (parent) {
                                parent.style.borderColor = '#cbd5e1';
                                parent.style.boxShadow = 'none';
                              }
                            }}
                          />
                        </div>

                        {/* Dropdown com Busca de Países e Bandeirinhas */}
                        {isCountryPickerOpen && (
                          <>
                            <div
                              style={{ position: 'fixed', inset: 0, zIndex: 45 }}
                              onClick={() => setIsCountryPickerOpen(false)}
                            />
                            <div className="ygeia-country-dropdown">
                              <div style={{ padding: '0.5rem', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 2 }}>
                                <input
                                  type="text"
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  placeholder="Pesquisar país ou DDI..."
                                  autoFocus
                                  style={{
                                    width: '100%',
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.8125rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                  }}
                                />
                              </div>
                              <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                                {filteredCountries.map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setIsCountryPickerOpen(false);
                                      setCountrySearch('');
                                      setPhone((prev) => formatPhoneNumber(prev, c.code));
                                    }}
                                    style={{
                                      width: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '0.5rem 0.75rem',
                                      border: 'none',
                                      background: selectedCountry.code === c.code ? 'var(--primary-light, #ecfdf5)' : 'transparent',
                                      color: selectedCountry.code === c.code ? primaryColor : '#1e293b',
                                      fontSize: '0.8125rem',
                                      fontWeight: selectedCountry.code === c.code ? 700 : 500,
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      transition: 'background 0.15s ease',
                                    }}
                                    onMouseOver={(e) => {
                                      if (selectedCountry.code !== c.code) {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                                      }
                                    }}
                                    onMouseOut={(e) => {
                                      if (selectedCountry.code !== c.code) {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                      }
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                      <CountryFlag code={c.code} flag={c.flag} width={20} height={14} />
                                      <span>{c.name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{c.dialCode}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CPF */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      CPF
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(formatCpf(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                    />
                  </div>

                  {/* Responsável (Para menores de idade) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                        Nome do responsável
                      </label>
                      <input
                        type="text"
                        placeholder="Nome completo do responsável"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                        onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                        CPF do responsável
                      </label>
                      <input
                        type="text"
                        placeholder="000.000.000-00"
                        value={guardianCpf}
                        onChange={(e) => setGuardianCpf(formatCpf(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                        onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.71875rem', color: '#64748b', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                    Para menores de idade — o recibo será emitido em nome do responsável.
                  </div>

                  {/* Seção: Mensagem de boas-vindas */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                      <Bell size={15} color="#059669" />
                      <span>Mensagem de boas-vindas</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      Escolha como deseja notificar o paciente após o cadastro
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {/* Card Email Boas-vindas */}
                      <div
                        style={{
                          padding: '0.875rem 1rem',
                          borderRadius: '0.75rem',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                            Enviar e-mail de boas-vindas
                          </div>
                          <div style={{ fontSize: '0.71875rem', color: '#64748b' }}>
                            Cadastre o e-mail acima para o envio acontecer
                          </div>
                        </div>

                        {/* Switch */}
                        <div
                          onClick={() => setWelcomeEmail(!welcomeEmail)}
                          style={{
                            width: '42px',
                            height: '24px',
                            backgroundColor: welcomeEmail ? '#10b981' : '#cbd5e1',
                            borderRadius: '9999px',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              backgroundColor: '#ffffff',
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '3px',
                              left: welcomeEmail ? '21px' : '3px',
                              transition: 'left 0.2s ease',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Card WhatsApp Boas-vindas */}
                      <div
                        style={{
                          padding: '0.875rem 1rem',
                          borderRadius: '0.75rem',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                            Enviar WhatsApp de boas-vindas
                          </div>
                          <div style={{ fontSize: '0.71875rem', color: '#64748b' }}>
                            Cadastre o telefone acima para o envio acontecer
                          </div>
                        </div>

                        {/* Switch */}
                        <div
                          onClick={() => setWelcomeWhatsapp(!welcomeWhatsapp)}
                          style={{
                            width: '42px',
                            height: '24px',
                            backgroundColor: welcomeWhatsapp ? '#10b981' : '#cbd5e1',
                            borderRadius: '9999px',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              backgroundColor: '#ffffff',
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '3px',
                              left: welcomeWhatsapp ? '21px' : '3px',
                              transition: 'left 0.2s ease',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ETAPA 2: TRATAMENTO E PROTOCOLOS */}
              {activeStep === 'tratamento' && (
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Tratamento e protocolos
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Defina o objetivo metabólico, protocolos de acompanhamento e tags clínicas para este paciente.
                  </p>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Objetivo metabólico principal
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Emagrecimento & Hipertrofia, Modulação de Lipídios, etc."
                      value={treatmentGoals}
                      onChange={(e) => setTreatmentGoals(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 3: CONVÊNIO */}
              {activeStep === 'convenio' && (
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Convênio / Plano de Saúde
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Informe se o paciente possui plano de saúde para geração de recibos de reembolso.
                  </p>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Operadora do Convênio
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Particular, Bradesco Saúde, Unimed, SulAmérica"
                      value={insurancePlan}
                      onChange={(e) => setInsurancePlan(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 4: LOCAL DE ATENDIMENTO */}
              {activeStep === 'local' && (
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Local de atendimento
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Selecione a unidade clínica ou modalidade de consulta deste paciente.
                  </p>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Unidade ou Modalidade
                    </label>
                    <select
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="Consultório Principal">Consultório Principal (Presencial)</option>
                      <option value="Teleconsulta Online">Teleconsulta Online (Ygeía Telemedicina)</option>
                      <option value="Atendimento Domiciliar">Atendimento Domiciliar / Home Care</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ETAPA 5: FOTO DO PACIENTE */}
              {activeStep === 'foto' && (
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Foto do paciente
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Adicione uma foto do paciente para facilitar o reconhecimento visual no prontuário.
                  </p>

                  <div
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '0.75rem',
                      padding: '2rem',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <Upload size={32} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Arraste ou selecione uma imagem
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
                      PNG, JPG ou WEBP de até 5MB
                    </div>
                    <input
                      type="url"
                      placeholder="Ou informe a URL da foto do paciente"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.8125rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 6: ENDEREÇO COMPLETO */}
              {activeStep === 'endereco' && (
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Endereço completo
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Endereço residencial do paciente para faturamento e prontuário legal.
                  </p>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Logradouro, número e bairro
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Av. Paulista, 1000, Apto 42, Bela Vista"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 7: OBSERVAÇÃO IMPORTANTE */}
              {activeStep === 'observacao' && (
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Observação importante
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Alergias graves, restrições alimentares severas ou notas de atenção prioritária.
                  </p>

                  <textarea
                    rows={4}
                    placeholder="Ex: Alergia severa a amendoim e crustáceos. Paciente bariátrico em acompanhamento."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              )}

              {/* ETAPA 8: ATESTADO E RECIBO */}
              {activeStep === 'atestado' && (
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Atestado e recibo
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Configurações fiscais para emissão automática de recibo e atestado de comparecimento.
                  </p>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      CPF ou CNPJ para emissão do recibo
                    </label>
                    <input
                      type="text"
                      placeholder="Deixe em branco para usar o CPF do paciente ou do responsável"
                      value={receiptCpfCnpj}
                      onChange={(e) => setReceiptCpfCnpj(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* BARRAS DE AÇÃO: CANCELAR E CADASTRAR */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    borderRadius: '0.5rem',
                    padding: '0.65rem 2rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                  onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.65rem 2.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                    opacity: loading ? 0.75 : 1,
                  }}
                >
                  {loading ? (
                    <span>Cadastrando...</span>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Cadastrar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};
