import React, { useState, useMemo } from 'react';
import {
  User,
  Stethoscope,
  ShieldPlus,
  Building,
  Camera,
  MapPin,
  FileText,
  Receipt,
  ChevronLeft,
  ChevronDown,
  Check,
  AlertCircle,
  X,
  Plus,
  UserCheck,
  Tag,
  Activity,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { PatientRecord } from './PatientDirectory';

export interface CountryDialCode {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'Estados Unidos / Canadá' },
  { code: 'PT', dialCode: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Espanha' },
  { code: 'AR', dialCode: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'França' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Alemanha' },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Itália' },
  { code: 'UY', dialCode: '+598', flag: '🇺🇾', name: 'Uruguai' },
  { code: 'PY', dialCode: '+595', flag: '🇵🇾', name: 'Paraguai' },
  { code: 'CL', dialCode: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: 'CO', dialCode: '+57', flag: '🇨🇴', name: 'Colômbia' },
  { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: 'México' },
  { code: 'CH', dialCode: '+41', flag: '🇨🇭', name: 'Suíça' },
  { code: 'IE', dialCode: '+353', flag: '🇮🇪', name: 'Irlanda' },
  { code: 'AO', dialCode: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: 'MZ', dialCode: '+258', flag: '🇲🇿', name: 'Moçambique' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Austrália' },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japão' },
  { code: 'PE', dialCode: '+51', flag: '🇵🇪', name: 'Peru' },
  { code: 'BO', dialCode: '+591', flag: '🇧🇴', name: 'Bolívia' },
  { code: 'EC', dialCode: '+593', flag: '🇪🇨', name: 'Equador' },
  { code: 'VE', dialCode: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'NL', dialCode: '+31', flag: '🇳🇱', name: 'Holanda' },
  { code: 'BE', dialCode: '+32', flag: '🇧🇪', name: 'Bélgica' },
  { code: 'SE', dialCode: '+46', flag: '🇸🇪', name: 'Suécia' },
  { code: 'NO', dialCode: '+47', flag: '🇳🇴', name: 'Noruega' },
  { code: 'DK', dialCode: '+45', flag: '🇩🇰', name: 'Dinamarca' },
  { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'Emirados Árabes' },
  { code: 'ZA', dialCode: '+27', flag: '🇿🇦', name: 'África do Sul' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'Índia' },
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'KR', dialCode: '+82', flag: '🇰🇷', name: 'Coreia do Sul' },
  { code: 'NZ', dialCode: '+64', flag: '🇳🇿', name: 'Nova Zelândia' },
  { code: 'IL', dialCode: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: 'RU', dialCode: '+7', flag: '🇷🇺', name: 'Rússia' },
];

export const OBJECTIVE_OPTIONS = [
  'Emagrecimento',
  'Hipertrofia',
  'Manutenção',
  'Performance Esportiva',
  'Reeducação Alimentar',
  'Saúde Digestiva',
];

export interface NewPatientViewProps {
  initialPatient?: PatientRecord | null;
  mode?: 'create' | 'edit';
  onBackToGrid: () => void;
  onPatientCreated?: (patient: any) => void;
  onPatientUpdated?: (patient: any) => void;
}

type WizardStep =
  | 'personal'
  | 'treatment'
  | 'insurance'
  | 'location'
  | 'photo'
  | 'address'
  | 'notes'
  | 'receipt';

interface StepMenuItem {
  id: WizardStep;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
}

const STEPS: StepMenuItem[] = [
  { id: 'personal', label: 'Dados pessoais', icon: User },
  { id: 'treatment', label: 'Tratamento e protocolos', icon: Stethoscope },
  { id: 'insurance', label: 'Convênio', icon: ShieldPlus },
  { id: 'location', label: 'Local de atendimento', icon: Building },
  { id: 'photo', label: 'Foto do paciente', icon: Camera },
  { id: 'address', label: 'Endereço completo', icon: MapPin },
  { id: 'notes', label: 'Observação importante', icon: FileText },
  { id: 'receipt', label: 'Atestado e recibo', icon: Receipt },
];

const AVAILABLE_PROTOCOLS = [
  'Emagrecimento Saudável',
  'Hipertrofia Muscular',
  'Reeducação Alimentar',
  'Nutrição Esportiva',
  'Saúde Intestinal (Microbiota)',
  'Longevidade & Anti-inflamatório',
  'Controle de Diabetes / Resistência Insulínica',
  'Saúde da Mulher & Gestante',
  'Controle de Colesterol / Dislipidemia',
  'Vegetarianismo / Veganismo',
];

const INSURANCE_OPTIONS = [
  'Sem convênio',
  'Unimed',
  'Bradesco Saúde',
  'Amil',
  'SulAmérica Saúde',
  'Porto Seguro Saúde',
  'NotreDame Intermédica',
  'Allianz Saúde',
  'Outro convênio',
];

const LOCATION_OPTIONS = [
  'Consultório Principal (Matriz)',
  'Atendimento Online / Telemedicina',
  'Clínica Integrada Parceira',
  'Atendimento Domiciliar',
];

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function formatDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export const NewPatientView: React.FC<NewPatientViewProps> = ({
  initialPatient,
  mode = 'create',
  onBackToGrid,
  onPatientCreated,
  onPatientUpdated,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('personal');
  const isEditing = mode === 'edit' || Boolean(initialPatient);

  // Step 1: Personal
  const [fullName, setFullName] = useState(initialPatient?.name || '');
  const [birthDate, setBirthDate] = useState(initialPatient?.birthDate ? formatDate(initialPatient.birthDate) : '');
  const [gender, setGender] = useState(initialPatient?.gender || initialPatient?.sex || '');
  const [email, setEmail] = useState(initialPatient?.email || '');

  // Phone with Country Dial Code Picker
  const initialCountry = useMemo(() => {
    if (initialPatient?.phone) {
      const match = COUNTRY_DIAL_CODES.find((c) => initialPatient.phone?.startsWith(c.dialCode));
      if (match) return match;
    }
    return COUNTRY_DIAL_CODES[0]; // Brasil (+55)
  }, [initialPatient]);

  const [selectedCountry, setSelectedCountry] = useState<CountryDialCode>(initialCountry);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const [phone, setPhone] = useState(() => {
    if (!initialPatient?.phone) return '';
    let p = initialPatient.phone;
    if (p.startsWith(initialCountry.dialCode)) {
      p = p.replace(initialCountry.dialCode, '').trim();
    }
    return initialCountry.code === 'BR' ? formatPhone(p) : p;
  });

  const [cpf, setCpf] = useState(initialPatient?.cpf ? formatCpf(initialPatient.cpf) : '');
  const [guardianName, setGuardianName] = useState(initialPatient?.guardianName || '');
  const [guardianCpf, setGuardianCpf] = useState(
    initialPatient?.guardianCpf ? formatCpf(initialPatient.guardianCpf) : ''
  );
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(
    initialPatient?.sendWelcomeEmail !== undefined ? initialPatient.sendWelcomeEmail : true
  );
  const [sendWelcomeWhatsapp, setSendWelcomeWhatsapp] = useState(
    initialPatient?.sendWelcomeWhatsapp !== undefined ? initialPatient.sendWelcomeWhatsapp : true
  );

  // Step 2: Protocols, Objective, Tags and Pathologies
  const [objective, setObjective] = useState(
    initialPatient?.objective || initialPatient?.goal || 'Emagrecimento'
  );
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(
    initialPatient?.treatmentProtocols || ['Emagrecimento Saudável']
  );
  const [protocolNotes, setProtocolNotes] = useState(initialPatient?.protocolNotes || '');

  const [tags, setTags] = useState<string[]>(
    initialPatient?.tags || ['Atleta', 'Low Carb']
  );
  const [tagInput, setTagInput] = useState('');

  const [pathologies, setPathologies] = useState<string[]>(
    initialPatient?.pathologies || []
  );
  const [pathologyInput, setPathologyInput] = useState('');

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      toast.success(`Tag "${trimmed}" adicionada.`);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleAddPathology = () => {
    const trimmed = pathologyInput.trim();
    if (!trimmed) return;
    if (!pathologies.includes(trimmed)) {
      setPathologies((prev) => [...prev, trimmed]);
      toast.success(`Patologia "${trimmed}" registrada.`);
    }
    setPathologyInput('');
  };

  const handleRemovePathology = (pathologyToRemove: string) => {
    setPathologies((prev) => prev.filter((p) => p !== pathologyToRemove));
  };

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRY_DIAL_CODES;
    const q = countrySearch.toLowerCase().trim();
    return COUNTRY_DIAL_CODES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  // Step 3: Insurance
  const [insuranceName, setInsuranceName] = useState(
    initialPatient?.insurancePlan || 'Sem convênio'
  );
  const [insuranceCardNumber, setInsuranceCardNumber] = useState(
    initialPatient?.insuranceCardNumber || ''
  );
  const [insuranceRepassAmount, setInsuranceRepassAmount] = useState(
    initialPatient?.insuranceRepassAmount || ''
  );

  // Step 4: Location
  const [attendanceLocation, setAttendanceLocation] = useState(
    initialPatient?.attendanceLocation || 'Consultório Principal (Matriz)'
  );

  // Step 5: Photo
  const [photoUrl, setPhotoUrl] = useState(initialPatient?.photoUrl || '');

  // Step 6: Address
  const [cep, setCep] = useState(
    initialPatient?.address?.cep ? formatCep(initialPatient.address.cep) : ''
  );
  const [street, setStreet] = useState(initialPatient?.address?.street || '');
  const [number, setNumber] = useState(initialPatient?.address?.number || '');
  const [complement, setComplement] = useState(initialPatient?.address?.complement || '');
  const [neighborhood, setNeighborhood] = useState(initialPatient?.address?.neighborhood || '');
  const [city, setCity] = useState(initialPatient?.address?.city || '');
  const [state, setState] = useState(initialPatient?.address?.state || '');
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Step 7: Notes
  const [notes, setNotes] = useState(initialPatient?.notes || '');

  // Step 8: Receipt
  const [emitInGuardianName, setEmitInGuardianName] = useState(false);
  const [customReceiptPayerCpf, setCustomReceiptPayerCpf] = useState('');
  const [receiptNotes, setReceiptNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ViaCEP integration
  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
          toast.success('Endereço localizado com sucesso via CEP!');
        } else {
          toast.error('CEP não encontrado na base pública.');
        }
      } catch {
        toast.error('Falha ao consultar o CEP.');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const toggleProtocol = (proto: string) => {
    setSelectedProtocols((prev) =>
      prev.includes(proto) ? prev.filter((p) => p !== proto) : [...prev, proto]
    );
  };

  const handleNextStep = () => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]!.id);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]!.id);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!fullName.trim()) {
      toast.error('O nome completo do paciente é obrigatório.');
      setCurrentStep('personal');
      return;
    }

    if (!birthDate.trim()) {
      toast.error('A data de nascimento é obrigatória.');
      setCurrentStep('personal');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedPhoneValue = phone.trim()
        ? phone.startsWith('+')
          ? phone.trim()
          : `${selectedCountry.dialCode} ${phone.trim()}`
        : undefined;

      const payload = {
        id: initialPatient?.id || String(Date.now()),
        fullName: fullName.trim(),
        birthDate,
        gender: gender || 'Não informado',
        email: email.trim() || undefined,
        phone: formattedPhoneValue,
        cpf: cpf || undefined,
        guardianName: guardianName.trim() || undefined,
        guardianCpf: guardianCpf || undefined,
        sendWelcomeEmail,
        sendWelcomeWhatsapp,
        objective: objective || undefined,
        goal: objective || protocolNotes.trim() || undefined,
        tags,
        pathologies,
        treatmentProtocols: selectedProtocols,
        protocolNotes: protocolNotes.trim() || undefined,
        insurancePlan: insuranceName,
        insuranceCardNumber: insuranceCardNumber.trim() || undefined,
        insuranceRepassAmount: insuranceRepassAmount || undefined,
        attendanceLocation: attendanceLocation || 'Consultório Principal (Matriz)',
        photoUrl: photoUrl.trim() || undefined,
        address: {
          cep: cep.trim() || undefined,
          street: street.trim() || undefined,
          number: number.trim() || undefined,
          complement: complement.trim() || undefined,
          neighborhood: neighborhood.trim() || undefined,
          city: city.trim() || undefined,
          state: state.trim() || undefined,
        },
        notes: notes.trim() || undefined,
      };

      if (isEditing && onPatientUpdated) {
        onPatientUpdated(payload);
        toast.success(`Dados de ${fullName} atualizados com sucesso!`);
      } else if (onPatientCreated) {
        onPatientCreated(payload);
        toast.success(`Paciente ${fullName} cadastrado com sucesso!`);
      }

      onBackToGrid();
    } catch {
      toast.error('Falha ao salvar dados do paciente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 1. Top Header Idêntico ao Better Health */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '9999px',
              backgroundColor: '#e2e8f0',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#334155',
              textTransform: 'uppercase',
            }}
          >
            PACIENTES
          </span>
          <h1
            style={{
              marginTop: '0.5rem',
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              lineHeight: 1.2,
            }}
          >
            {isEditing ? 'Editar paciente' : 'Novo paciente'}
          </h1>
          <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#64748b' }}>
            Preencha as etapas para cadastrar um novo paciente
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToGrid}
          style={{
            borderRadius: '0.5rem',
            padding: '0.4rem 0.85rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#475569',
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#e2e8f0')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
        >
          Fechar
        </button>
      </div>

      {/* 2. Layout Responsivo Mobile First: Stepper + Form */}
      <div className="ygeia-wizard-container">
        {/* STEPPER: Carrossel Horizontal com Swipe no Mobile, Barra Lateral no Desktop */}
        <aside>
          <div className="ygeia-wizard-stepper">
            <h2
              className="desktop-only"
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#1e293b',
                padding: '0 0.75rem',
                marginBottom: '0.75rem',
              }}
            >
              Novo paciente
            </h2>
            <nav style={{ display: 'flex', flexDirection: 'inherit', gap: '0.25rem', width: '100%' }}>
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className="touch-target"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.55rem 0.875rem',
                      borderRadius: '0.5rem',
                      border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                      borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                      backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                      color: isActive ? 'var(--primary)' : '#475569',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* COLUNA DIREITA: CONTEÚDO DA ETAPA ATIVA */}
        <main style={{ minWidth: 0, width: '100%' }}>
          <div
            style={{
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* ETAPA 1: DADOS PESSOAIS */}
            {currentStep === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Dados pessoais
                </h3>

                {/* Nome Completo */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Nome completo <span style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Data de Nascimento e Sexo de referência para cálculos */}
                <div className="ygeia-grid-1-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Data de nascimento <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={birthDate}
                      onChange={(e) => setBirthDate(formatDate(e.target.value))}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      required
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                        e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Sexo de referência para cálculos <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="ygeia-select"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                    </select>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.4, margin: '0.35rem 0 0 0' }}>
                      Usado nos cálculos e nas faixas de referência. Revise conforme a avaliação clínica.
                    </p>
                  </div>
                </div>

                {/* E-mail e Telefone com Bandeirinhas dos Países */}
                <div className="ygeia-grid-1-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                        e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Telefone
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          display: 'flex',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          transition: 'all 0.15s ease',
                          overflow: 'visible',
                        }}
                      >
                        {/* Botão com Bandeira e DDI */}
                        <button
                          type="button"
                          onClick={() => setIsCountryPickerOpen((prev) => !prev)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            backgroundColor: '#f8fafc',
                            border: 'none',
                            borderRight: '1px solid #cbd5e1',
                            padding: '0 0.75rem',
                            fontSize: '0.875rem',
                            color: '#334155',
                            fontWeight: 600,
                            cursor: 'pointer',
                            borderTopLeftRadius: '0.5rem',
                            borderBottomLeftRadius: '0.5rem',
                            outline: 'none',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                          title="Selecione o país do código de área telefônica"
                        >
                          <span style={{ fontSize: '1.125rem', lineHeight: 1 }}>{selectedCountry.flag}</span>
                          <span>{selectedCountry.dialCode}</span>
                          <ChevronDown size={14} color="#64748b" />
                        </button>

                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(selectedCountry.code === 'BR' ? formatPhone(e.target.value) : e.target.value)}
                          placeholder={selectedCountry.code === 'BR' ? '(00) 00000-0000' : 'Número do telefone'}
                          maxLength={selectedCountry.code === 'BR' ? 15 : 20}
                          style={{
                            flex: 1,
                            border: 'none',
                            padding: '0.625rem 0.875rem',
                            fontSize: '0.875rem',
                            outline: 'none',
                            borderTopRightRadius: '0.5rem',
                            borderBottomRightRadius: '0.5rem',
                            boxSizing: 'border-box',
                            width: '100%',
                          }}
                          onFocus={(e) => {
                            const parent = (e.target.parentElement as HTMLElement);
                            if (parent) {
                              parent.style.borderColor = 'var(--primary)';
                              parent.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                            }
                          }}
                          onBlur={(e) => {
                            const parent = (e.target.parentElement as HTMLElement);
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
                                  }}
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.5rem 0.75rem',
                                    border: 'none',
                                    background: selectedCountry.code === c.code ? 'var(--primary-light)' : 'transparent',
                                    color: selectedCountry.code === c.code ? 'var(--primary)' : '#1e293b',
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
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.125rem' }}>{c.flag}</span>
                                    <span>{c.name}</span>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{c.dialCode}</span>
                                </button>
                              ))}
                              {filteredCountries.length === 0 && (
                                <div style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                                  Nenhum país encontrado
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* CPF */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    CPF
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Card do Responsável Legal (Para menores de idade) */}
                <div
                  style={{
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserCheck size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
                      Dados do Responsável Legal
                    </span>
                  </div>

                  <div className="ygeia-grid-1-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                        Nome do responsável
                      </label>
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder="Nome completo do responsável"
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                          backgroundColor: '#ffffff',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--primary)';
                          e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#cbd5e1';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                        CPF do responsável
                      </label>
                      <input
                        type="text"
                        value={guardianCpf}
                        onChange={(e) => setGuardianCpf(formatCpf(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                          backgroundColor: '#ffffff',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--primary)';
                          e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#cbd5e1';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                    Para menores de idade — o recibo será emitido em nome do responsável.
                  </p>
                </div>

                {/* Mensagem de boas-vindas */}
                <div style={{ marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🔔</span>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      Mensagem de boas-vindas
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Escolha como deseja notificar o paciente após o cadastro
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '0.75rem' }}>
                    {/* E-mail Card */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        padding: '0.875rem',
                      }}
                    >
                      <div style={{ paddingRight: '0.75rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                          Enviar e-mail de boas-vindas
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                          Cadastre o e-mail acima para o envio acontecer
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSendWelcomeEmail(!sendWelcomeEmail)}
                        style={{
                          width: '44px',
                          height: '24px',
                          borderRadius: '9999px',
                          border: 'none',
                          backgroundColor: sendWelcomeEmail ? 'var(--primary)' : '#cbd5e1',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '2px',
                            left: sendWelcomeEmail ? '22px' : '2px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                      </button>
                    </div>

                    {/* WhatsApp Card */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        padding: '0.875rem',
                      }}
                    >
                      <div style={{ paddingRight: '0.75rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                          Enviar WhatsApp de boas-vindas
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                          Cadastre o telefone acima para o envio acontecer
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSendWelcomeWhatsapp(!sendWelcomeWhatsapp)}
                        style={{
                          width: '44px',
                          height: '24px',
                          borderRadius: '9999px',
                          border: 'none',
                          backgroundColor: sendWelcomeWhatsapp ? 'var(--primary)' : '#cbd5e1',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '2px',
                            left: sendWelcomeWhatsapp ? '22px' : '2px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ações da Etapa 1 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    paddingTop: '1rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={onBackToGrid}
                    style={{
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      padding: '0.625rem 1.25rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    style={{
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      padding: '0.625rem 1.25rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Continuar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    style={{
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      padding: '0.625rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                  >
                    {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 2: TRATAMENTO E PROTOCOLOS */}
            {currentStep === 'treatment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Tratamento e protocolos
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Defina o objetivo principal, protocolos clínicos, tags e patologias do paciente.
                  </p>
                </div>

                {/* Combobox: Objetivo Principal */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Objetivo
                  </label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="ygeia-select"
                  >
                    <option value="">Selecione o objetivo</option>
                    {OBJECTIVE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Protocolos e Metas Clínicas */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                    Protocolos e Metas Clínicas
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {AVAILABLE_PROTOCOLS.map((proto) => {
                      const isSelected = selectedProtocols.includes(proto);
                      return (
                        <button
                          key={proto}
                          type="button"
                          onClick={() => toggleProtocol(proto)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            borderRadius: '9999px',
                            padding: '0.45rem 0.875rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: isSelected ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? 'var(--primary-light)' : '#f8fafc',
                            color: isSelected ? 'var(--primary)' : '#475569',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isSelected && <Check size={14} />}
                          <span>{proto}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Campo Tags com Adição Dinâmica e Badges com 'X' */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Tags do paciente
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Digite uma tag (ex: Atleta, Cetogênica, Intolerante a lactose)..."
                      style={{
                        flex: 1,
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                        e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.625rem 1rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Plus size={15} />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  {/* Badges de Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.5rem' }}>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: 'var(--primary-light)',
                          border: '1px solid var(--primary-border)',
                          color: 'var(--primary)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <Tag size={12} />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            marginLeft: '0.15rem',
                          }}
                          title={`Remover tag ${tag}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {tags.length === 0 && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        Nenhuma tag vinculada ainda.
                      </span>
                    )}
                  </div>
                </div>

                {/* Campo Patologias com Adição Dinâmica e Badges com 'X' */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Patologias
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={pathologyInput}
                      onChange={(e) => setPathologyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPathology();
                        }
                      }}
                      placeholder="Digite uma patologia (ex: Diabetes Tipo 2, Hipertensão, SOP, Hipotireoidismo)..."
                      style={{
                        flex: 1,
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                        e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddPathology}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        backgroundColor: '#e11d48',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.625rem 1rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Plus size={15} />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  {/* Badges de Patologias */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.5rem' }}>
                    {pathologies.map((patho) => (
                      <span
                        key={patho}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#e11d48',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <Activity size={12} />
                        <span>{patho}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePathology(patho)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#e11d48',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            marginLeft: '0.15rem',
                          }}
                          title={`Remover patologia ${patho}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {pathologies.length === 0 && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        Nenhuma patologia cadastrada para este paciente.
                      </span>
                    )}
                  </div>
                </div>

                {/* Observações do tratamento */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Observações do tratamento
                  </label>
                  <textarea
                    rows={3}
                    value={protocolNotes}
                    onChange={(e) => setProtocolNotes(e.target.value)}
                    placeholder="Ex: Paciente busca recomposição corporal e relata fadiga no final do dia."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Controles da Etapa 2 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} /> Voltar
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={onBackToGrid}
                      style={{
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      style={{
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        padding: '0.625rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 3: CONVÊNIO */}
            {currentStep === 'insurance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Convênio
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Convênio do paciente e quanto ele repassa a você. Com repasse informado, é esse o valor lançado no controle financeiro.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Convênio
                  </label>
                  <select
                    value={insuranceName}
                    onChange={(e) => setInsuranceName(e.target.value)}
                    className="ygeia-select"
                  >
                    {INSURANCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {insuranceName !== 'Sem convênio' && (
                  <div className="ygeia-grid-1-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                        Número da carteirinha
                      </label>
                      <input
                        type="text"
                        value={insuranceCardNumber}
                        onChange={(e) => setInsuranceCardNumber(e.target.value)}
                        placeholder="Ex: 0023.8829.1120-00"
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.875rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                        Valor do repasse (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={insuranceRepassAmount}
                        onChange={(e) => setInsuranceRepassAmount(e.target.value)}
                        placeholder="Ex: 120,00"
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.875rem',
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

                {/* Controles da Etapa 3 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} /> Voltar
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={onBackToGrid}
                      style={{
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      style={{
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        padding: '0.625rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 4: LOCAL DE ATENDIMENTO */}
            {currentStep === 'location' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Local de atendimento
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Selecione o local padrão onde ocorrem os atendimentos deste paciente.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {LOCATION_OPTIONS.map((loc) => {
                    const isSelected = attendanceLocation === loc;
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setAttendanceLocation(loc)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderRadius: '0.75rem',
                          border: isSelected ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                          padding: '1rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Building size={20} color={isSelected ? 'var(--primary)' : '#94a3b8'} />
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isSelected ? '#0f172a' : '#475569' }}>
                            {loc}
                          </span>
                        </div>
                        {isSelected && <Check size={18} color="var(--primary)" />}
                      </button>
                    );
                  })}
                </div>

                {/* Controles da Etapa 4 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} /> Voltar
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={onBackToGrid}
                      style={{
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      style={{
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        padding: '0.625rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 5: FOTO DO PACIENTE */}
            {currentStep === 'photo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Foto do paciente
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Adicione uma foto do paciente para facilitar a identificação visual no sistema.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '1rem',
                    border: '2px dashed #cbd5e1',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                  }}
                >
                  {photoUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={photoUrl}
                        alt="Preview"
                        style={{
                          width: '110px',
                          height: '110px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          boxShadow: '0 0 0 4px var(--primary-border)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#e11d48',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Remover foto
                      </button>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          borderRadius: '50%',
                          backgroundColor: '#f1f5f9',
                          padding: '1rem',
                          color: '#94a3b8',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <Camera size={32} />
                      </div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', margin: 0 }}>
                        Insira a URL de uma foto ou avatar
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                        Formatos suportados: PNG, JPG ou WebP
                      </p>
                    </>
                  )}

                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://exemplo.com/foto-paciente.jpg"
                    style={{
                      marginTop: '1.25rem',
                      width: '100%',
                      maxWidth: '420px',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Controles da Etapa 5 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} /> Voltar
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={onBackToGrid}
                      style={{
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      style={{
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        padding: '0.625rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 6: ENDEREÇO COMPLETO */}
            {currentStep === 'address' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Endereço completo
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Informe o CEP para preenchimento automático das informações de endereço.
                  </p>
                </div>

                {/* CEP com busca automática */}
                <div style={{ maxWidth: '280px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    CEP
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(formatCep(e.target.value))}
                      placeholder="00000-000"
                      maxLength={9}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                        e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.boxShadow = 'none';
                        handleCepBlur();
                      }}
                    />
                    {isLoadingCep && (
                      <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#94a3b8' }}>
                        Buscando...
                      </span>
                    )}
                  </div>
                </div>

                {/* Logradouro e Número */}
                <div className="ygeia-grid-1-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Logradouro
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Rua, Avenida, Alameda..."
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Número
                    </label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Ex: 123"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Complemento e Bairro */}
                <div className="ygeia-grid-1-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto, Bloco..."
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ex: Centro"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Cidade e UF */}
                <div className="ygeia-grid-1-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: São Paulo"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      placeholder="SP"
                      maxLength={2}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Controles da Etapa 6 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} /> Voltar
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={onBackToGrid}
                      style={{
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      style={{
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        padding: '0.625rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 7: OBSERVAÇÃO IMPORTANTE */}
            {currentStep === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Observação importante
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Anotações clínicas críticas em destaque (alergias severas, intolerâncias, condições crônicas).
                  </p>
                </div>

                <div
                  style={{
                    borderRadius: '0.75rem',
                    border: '1px solid #fde68a',
                    backgroundColor: '#fffbeb',
                    padding: '1rem',
                    fontSize: '0.75rem',
                    color: '#92400e',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <AlertCircle size={16} color="#d97706" />
                    <span>Aviso de visualização rápida</span>
                  </div>
                  <p style={{ marginTop: '0.25rem', color: '#b45309', margin: '0.25rem 0 0 0' }}>
                    As informações registradas aqui serão exibidas com destaque no topo da ficha do paciente para toda a equipe.
                  </p>
                </div>

                <textarea
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Paciente alérgico a frutos do mar e amendoim. Diagnosticado com intolerância severa à lactose."
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Controles da Etapa 7 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} /> Voltar
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={onBackToGrid}
                      style={{
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      style={{
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        padding: '0.625rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 8: ATESTADO E RECIBO */}
            {currentStep === 'receipt' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Atestado e recibo
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Configure os parâmetros para emissão de recibos e declarações de comparecimento.
                  </p>
                </div>

                {/* Switch menor de idade */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                      Emitir recibos em nome do responsável
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                      Habilite se o paciente for dependente fiscal ou menor de idade.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmitInGuardianName(!emitInGuardianName)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: emitInGuardianName ? 'var(--primary)' : '#cbd5e1',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        left: emitInGuardianName ? '22px' : '2px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                      }}
                    />
                  </button>
                </div>

                {/* CPF customizado no recibo */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    CPF do pagador / responsável no recibo
                  </label>
                  <input
                    type="text"
                    value={customReceiptPayerCpf}
                    onChange={(e) => setCustomReceiptPayerCpf(formatCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    style={{
                      width: '100%',
                      maxWidth: '420px',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Notas adicionais no recibo */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                    Notas e instruções adicionais do recibo
                  </label>
                  <textarea
                    rows={3}
                    value={receiptNotes}
                    onChange={(e) => setReceiptNotes(e.target.value)}
                    placeholder="Ex: Consulta nutricional clínica com finalidade de assistência à saúde para fins de dedução no IRPF."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Controles Finais */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} /> Voltar
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={onBackToGrid}
                      style={{
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting}
                      style={{
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        padding: '0.625rem 1.75rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        opacity: isSubmitting ? 0.6 : 1,
                      }}
                    >
                      {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
