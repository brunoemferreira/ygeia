import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';
import { ClinicalDataGrid, ClinicalRecordItem } from '../../ui';
import { AnamneseEditor, AnamneseData } from '../AnamneseEditor';
import { PatientRecord } from '../PatientDirectory';
import { useToast } from '../../../context/ToastContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AnamneseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AnamneseEditor ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            margin: '2rem',
            border: '1px solid #fee2e2',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <AlertCircle size={24} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Houve uma falha ao renderizar a anamnese
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            Não foi possível exibir os dados da anamnese no momento. Clique abaixo para retornar à lista com segurança.
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onReset();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.55rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Voltar para a Lista de Anamneses
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export interface PatientAnamneseTabProps {
  patient: PatientRecord;
  patientAgeString: string;
  isEditingAnamnese: boolean;
  editingAnamneseData: AnamneseData | null;
  anamnesesList: AnamneseData[];
  onStartNewAnamnese: (templateType?: string) => void;
  onOpenAnamneseForEdit: (item: AnamneseData) => void;
  onSaveAnamnese: (updatedData: AnamneseData) => void;
  onCancelAnamnese: () => void;
  onDeleteAnamnese: (id: string) => void;
}

export const PatientAnamneseTab: React.FC<PatientAnamneseTabProps> = ({
  patient,
  patientAgeString,
  isEditingAnamnese,
  editingAnamneseData,
  anamnesesList,
  onStartNewAnamnese,
  onOpenAnamneseForEdit,
  onSaveAnamnese,
  onCancelAnamnese,
  onDeleteAnamnese,
}) => {
  const { toast } = useToast();

  const clinicalAnamnesesItems: ClinicalRecordItem[] = anamnesesList.map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    templateType: item.templateType || 'Seções padrão',
    raw: item,
  }));

  if (isEditingAnamnese && editingAnamneseData) {
    return (
      <AnamneseErrorBoundary onReset={onCancelAnamnese}>
        <AnamneseEditor
          patient={patient}
          patientAgeString={patientAgeString}
          initialData={editingAnamneseData}
          onSave={onSaveAnamnese}
          onBack={onCancelAnamnese}
        />
      </AnamneseErrorBoundary>
    );
  }

  return (
    <ClinicalDataGrid
      title="Anamnese"
      subtitle="Registro de consultas, queixas e evolução clínica do paciente"
      items={clinicalAnamnesesItems}
      itemLabel="anamneses"
      templates={['Seções padrão', 'Anamnese Esportiva', 'Anamnese Infantil', 'Saúde Gastrointestinal', 'Anamnese em Branco']}
      onNew={() => onStartNewAnamnese('Seções padrão')}
      onEdit={(item) => onOpenAnamneseForEdit(item.raw || item)}
      onDelete={(item) => onDeleteAnamnese(item.id)}
      onPrint={(item) => {
        toast.success(`Gerando PDF clínico da anamnese: ${item.title}...`);
      }}
      onCompare={(item) => {
        toast.info(`Comparando evolução clínica a partir de ${item.title}...`);
      }}
      onExportAll={() => {
        toast.info('Gerando prontuário consolidado em PDF de todas as anamneses...');
      }}
    />
  );
};

