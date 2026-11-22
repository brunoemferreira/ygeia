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
  Upload,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getStoredBranding } from '../../utils/branding';
import { PatientRecord } from './PatientDirectory';

export interface NewPatientViewProps {
  initialPatient?: PatientRecord | null;
  mode?: 'create' | 'edit';
  onBackToGrid: () => void;
  onPatientCreated?: (patient: any) => void;
  onPatientUpdated?: (patient: any) => void;
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

export const NewPatientView: React.FC<NewPatientViewProps> = ({
  initialPatient,
  mode = 'create',
  onBackToGrid,
  onPatientCreated,
  onPatientUpdated,
}) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  const isEdit = mode === 'edit' || !!initialPatient;

  // Active step
  const [activeStep, setActiveStep] = useState<StepKey>('dados_pessoais');

  // Form State - Dados Pessoais (Preenchidos se for edição)
  const [fullName, setFullName] = useState(initialPatient?.name || '');
  const [birthDate, setBirthDate] = useState(initialPatient?.birthDate || '');
  const [sex, setSex] = useState<'Feminino' | 'Masculino' | ''>(
    initialPatient?.sex === 'Masculino' ? 'Masculino' : initialPatient?.sex === 'Feminino' ? 'Feminino' : 'Feminino'
  );
  const [assignedSexAtBirth, setAssignedSexAtBirth] = useState<string>(
    initialPatient?.assignedSexAtBirth || (initialPatient?.sex === 'Masculino' ? 'Masculino' : 'Feminino')
  );
  const [genderIdentity, setGenderIdentity] = useState<string>(
    initialPatient?.genderIdentity || ''
  );
  const [email, setEmail] = useState(initialPatient?.email || '');
  const [phone, setPhone] = useState(initialPatient?.phone || '');
  const [cpf, setCpf] = useState(initialPatient?.cpf || '');
  const [guardianName, setGuardianName] = useState(initialPatient?.guardianName || '');
  const [guardianCpf, setGuardianCpf] = useState(initialPatient?.guardianCpf || '');
  const [welcomeEmail, setWelcomeEmail] = useState(initialPatient?.welcomeEmail ?? true);
  const [welcomeWhatsapp, setWelcomeWhatsapp] = useState(initialPatient?.welcomeWhatsapp ?? false);

  // Form State - Etapas Adicionais
  const [treatmentGoals, setTreatmentGoals] = useState(initialPatient?.goal || '');
  const [insurancePlan, setInsurancePlan] = useState(initialPatient?.insurancePlan || 'Particular');
  const [locationName, setLocationName] = useState(initialPatient?.locationName || 'Meu consultório');
  const [photoUrl, setPhotoUrl] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptCpfCnpj, setReceiptCpfCnpj] = useState('');

  const [loading, setLoading] = useState(false);

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

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits ? `(${digits}` : '';
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const steps: { key: StepKey; label: string; icon: any }[] = [
    { key: 'dados_pessoais', label: 'Dados pessoais', icon: User },
    { key: 'tratamento', label: 'Tratamento e protocolos', icon: Activity },
    { key: 'convenio', label: 'Convênio', icon: ShieldCheck },
    { key: 'local', label: 'Local de atendimento', icon: Building2 },
    { key: 'foto', label: 'Foto do paciente', icon: Camera },
    { key: 'endereco', label: 'Endereço completo', icon: MapPin },
    { key: 'observacao', label: 'Observação importante', icon: FileText },
    { key: 'atestado', label: 'Atestado e recibo', icon: Receipt },
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Informe o nome completo do paciente.');
      setActiveStep('dados_pessoais');
      return;
    }

    if (!birthDate.trim()) {
      toast.error('Informe a data de nascimento.');
      setActiveStep('dados_pessoais');
      return;
    }

    if (!sex) {
      toast.error('Selecione o sexo de referência para cálculos.');
      setActiveStep('dados_pessoais');
      return;
    }

    setLoading(true);

    try {
      const apiBase = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:4333') + '/api/v1';
      const endpoint = isEdit && initialPatient?.id
        ? `${apiBase}/patients/${initialPatient.id}`
        : `${apiBase}/patients`;
      const method = isEdit && initialPatient?.id ? 'PUT' : 'POST';

      const payload = {
        fullName: fullName.trim(),
        birthDate: birthDate.includes('/')
          ? birthDate.split('/').reverse().join('-')
          : birthDate,
        biologicalSex: sex === 'Feminino' ? 'FEMALE' : 'MALE',
        assignedSexAtBirth: assignedSexAtBirth || (sex === 'Feminino' ? 'FEMALE' : 'MALE'),
        genderIdentity: genderIdentity || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
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
      };

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || (isEdit ? 'Erro ao atualizar paciente.' : 'Erro ao cadastrar paciente.'));
      }

      const result = await res.json();
      if (isEdit) {
        toast.success(`Paciente ${fullName} atualizado com sucesso!`);
        if (onPatientUpdated) {
          onPatientUpdated(result);
        }
      } else {
        toast.success(`Paciente ${fullName} cadastrado com sucesso!`);
        if (onPatientCreated) {
          onPatientCreated(result);
        }
      }
      onBackToGrid();
    } catch (err: any) {
      toast.error(err.message || 'Falha ao salvar paciente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Header da Tela (Conforme Mockup media_1795311187219_22060d3a.jpg) */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          {/* Badge cinza/azul PACIENTES */}
          <div
            style={{
              display: 'inline-block',
              fontSize: '0.6875rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#475569',
              backgroundColor: '#e2e8f0',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
            }}
          >
            PACIENTES
          </div>

          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 0.25rem 0',
            }}
          >
            {isEdit ? 'Editar paciente' : 'Novo paciente'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, fontWeight: 400 }}>
            {isEdit
              ? `Atualize as etapas e dados cadastrais de ${fullName || initialPatient?.name || 'paciente'}`
              : 'Preencha as etapas para cadastrar um novo paciente'}
          </p>
        </div>

        {/* Botão Fechar no canto superior direito */}
        <button
          type="button"
          onClick={onBackToGrid}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.35rem 0.65rem',
            borderRadius: '0.375rem',
            transition: 'color 0.15s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = '#0f172a')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
        >
          Fechar
        </button>
      </div>

      {/* Grid de 2 Colunas: Stepper à Esquerda + Form à Direita */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* ====================================================
            COLUNA ESQUERDA: CARD COM STEPPER
           ==================================================== */}
        <aside
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 0.875rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 800,
              color: '#0f172a',
              padding: '0 0.5rem 0.75rem 0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            {isEdit ? 'Editar paciente' : 'Novo paciente'}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {steps.map((s) => {
              const IconComponent = s.icon;
              const isActive = activeStep === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveStep(s.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    width: '100%',
                    padding: '0.65rem 0.75rem',
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
            padding: '2.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* ETAPA 1: DADOS PESSOAIS (100% FIEL AO MOCKUP media_1795311187219_22060d3a.jpg) */}
            {activeStep === 'dados_pessoais' && (
              <>
                <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                  Dados pessoais
                </div>

                {/* Nome completo * */}
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

                {/* Data de nascimento * & Sexo de referência para cálculos * */}
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
                      value={sex}
                      onChange={(e) => setSex(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        color: sex ? '#0f172a' : '#64748b',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                    >
                      <option value="">Selecione</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                    </select>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '0.3rem' }}>
                      Usado nos cálculos e nas faixas de referência. Revise conforme a avaliação clínica.
                    </div>
                  </div>
                </div>

                {/* Sexo atribuído ao nascimento & Identidade de gênero (opcional) */}
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
                      <option value="Não informado">Não informado</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Identidade de gênero (opcional)
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
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Telefone
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.5rem',
                          padding: '0 0.65rem',
                          fontSize: '0.8125rem',
                          color: '#334155',
                          flexShrink: 0,
                        }}
                      >
                        <span>🇧🇷 +55</span>
                      </div>
                      <input
                        type="text"
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
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
                <div style={{ fontSize: '0.71875rem', color: '#64748b', marginTop: '-0.5rem', marginBottom: '0.25rem' }}>
                  Para menores de idade — o recibo será emitido em nome do responsável.
                </div>

                {/* Seção: Mensagem de boas-vindas */}
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                    <Bell size={15} color="#eab308" />
                    <span>Mensagem de boas-vindas</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    Escolha como deseja notificar o paciente após o cadastro
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Card 1: Enviar e-mail de boas-vindas */}
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

                      {/* Switch Toggle */}
                      <div
                        onClick={() => setWelcomeEmail(!welcomeEmail)}
                        style={{
                          width: '42px',
                          height: '24px',
                          backgroundColor: welcomeEmail ? '#10b981' : '#e2e8f0',
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

                    {/* Card 2: Enviar WhatsApp de boas-vindas */}
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

                      {/* Switch Toggle */}
                      <div
                        onClick={() => setWelcomeWhatsapp(!welcomeWhatsapp)}
                        style={{
                          width: '42px',
                          height: '24px',
                          backgroundColor: welcomeWhatsapp ? '#10b981' : '#e2e8f0',
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
                <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
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
                      color: '#0f172a',
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
                <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Convênio e Faturamento
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Informe se o atendimento é particular ou vinculado a uma operadora credenciada.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    Plano de Saúde / Convênio
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Particular, Unimed, Bradesco Saúde, Amil"
                    value={insurancePlan}
                    onChange={(e) => setInsurancePlan(e.target.value)}
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
                  />
                </div>
              </div>
            )}

            {/* ETAPA 4: LOCAL DE ATENDIMENTO */}
            {activeStep === 'local' && (
              <div>
                <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Local de atendimento
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Selecione a unidade clínica, consultório parceiro ou modalidade teleconsulta.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    Unidade de atendimento
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Consultório Principal, Teleatendimento Ygeía"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
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
                  />
                </div>
              </div>
            )}

            {/* ETAPA 5: FOTO DO PACIENTE */}
            {activeStep === 'foto' && (
              <div>
                <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Foto do paciente
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Faça upload da imagem do paciente para exibição no prontuário e no aplicativo.
                </p>

                <div
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '0.75rem',
                    padding: '2.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f8fafc',
                  }}
                  onClick={() => toast.info('Selecione uma imagem JPG ou PNG de até 5MB.')}
                >
                  <Upload size={32} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    Arraste ou clique para anexar uma foto
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    PNG, JPG ou WEBP até 5MB
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    Ou insira a URL da foto
                  </label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
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
                  />
                </div>
              </div>
            )}

            {/* ETAPA 6: ENDEREÇO COMPLETO */}
            {activeStep === 'endereco' && (
              <div>
                <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Endereço completo
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Cadastre o endereço residencial ou profissional para fins fiscais e de faturamento.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    Logradouro, número, bairro e cidade
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Av. Paulista, 1000, Apto 52, Bela Vista, São Paulo - SP"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
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
                  />
                </div>
              </div>
            )}

            {/* ETAPA 7: OBSERVAÇÃO IMPORTANTE */}
            {activeStep === 'observacao' && (
              <div>
                <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Observação importante
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Alergias graves, restrições alimentares severas ou notas confidenciais que devem ficar em destaque.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    Notas clínicas prioritárias
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ex: Paciente com diagnóstico de doença celíaca severa e intolerância à lactose."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.875rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            )}

            {/* ETAPA 8: ATESTADO E RECIBO */}
            {activeStep === 'atestado' && (
              <div>
                <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Atestado e recibo
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Configurações de emissão de recibo para declaração do imposto de renda ou reembolso.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    CPF/CNPJ para emissão de comprovante fiscal
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={receiptCpfCnpj}
                    onChange={(e) => setReceiptCpfCnpj(formatCpf(e.target.value))}
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
                  />
                </div>
              </div>
            )}

            {/* ====================================================
                AÇÕES DO FORMULÁRIO (CANCELAR + SALVAR / CADASTRAR)
                (Conforme Mockup media_1795311187219_22060d3a.jpg)
               ==================================================== */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              {/* Botão Cancelar */}
              <button
                type="button"
                onClick={onBackToGrid}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  borderRadius: '0.5rem',
                  padding: '0.6rem 1.5rem',
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

              {/* Botão Cadastrar / Salvar alterações */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.6rem 1.85rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)',
                  opacity: loading ? 0.75 : 1,
                  transition: 'background-color 0.15s ease',
                }}
                onMouseOver={(e) => {
                  if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#047857';
                }}
                onMouseOut={(e) => {
                  if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#059669';
                }}
              >
                {loading ? (
                  <span>Salvando...</span>
                ) : (
                  <>
                    <Check size={16} />
                    <span>{isEdit ? 'Salvar alterações' : 'Cadastrar'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Links no rodapé inferior */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div>
                Vindo de outro software?{' '}
                <span
                  onClick={() => toast.info('Módulo de migração de prontuários em lote disponível nas Configurações.')}
                  style={{ color: '#059669', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clique aqui para importar
                </span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <span>Se precisar de ajuda,</span>
                <span
                  onClick={() => toast.info('Suporte Ygeía: WhatsApp de plantão para clínicas ativas.')}
                  style={{ color: '#0f172a', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <span>clique aqui</span>
                  <MessageCircle size={13} color="#059669" />
                </span>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
