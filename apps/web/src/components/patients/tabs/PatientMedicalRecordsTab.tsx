import React, { useState, useMemo } from 'react';
import { ClinicalDataGrid, ClinicalRecordItem, AppModal, AppInput, AppSelect, AppTextarea } from '../../ui';
import { useToast } from '../../../context/ToastContext';

export interface ProntuarioItem {
  id: string;
  title: string;
  templateType: string;
  date: string;
  notes?: string;
}

export interface PatientMedicalRecordsTabProps {
  prontuarioList: ProntuarioItem[];
  onSaveProntuario: (updated: ProntuarioItem[]) => void;
}

export const PatientMedicalRecordsTab: React.FC<PatientMedicalRecordsTabProps> = ({
  prontuarioList,
  onSaveProntuario,
}) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProntuarioItem | null>(null);
  const [form, setForm] = useState<{ title: string; templateType: string; date: string; notes: string }>({
    title: '',
    templateType: 'Evolução Clínica',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const clinicalItems: ClinicalRecordItem[] = useMemo(() => {
    return prontuarioList.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      templateType: item.templateType || 'Evolução Clínica',
      raw: item,
    }));
  }, [prontuarioList]);

  const handleOpenNewModal = () => {
    const now = new Date();
    setEditingItem(null);
    setForm({
      title: `Evolução Clínica - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`,
      templateType: 'Evolução Clínica',
      date: now.toISOString().split('T')[0],
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item: ProntuarioItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      templateType: item.templateType || 'Evolução Clínica',
      date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error('Informe um título para o registro do prontuário.');
      return;
    }
    if (editingItem) {
      const updated = prontuarioList.map((p) =>
        p.id === editingItem.id
          ? {
              ...p,
              title: form.title.trim(),
              templateType: form.templateType,
              date: new Date(form.date).toISOString(),
              notes: form.notes,
            }
          : p
      );
      onSaveProntuario(updated);
      toast.success('Evolução do prontuário atualizada com sucesso.');
    } else {
      const newItem: ProntuarioItem = {
        id: String(Date.now()),
        title: form.title.trim(),
        templateType: form.templateType,
        date: new Date(form.date).toISOString(),
        notes: form.notes,
      };
      onSaveProntuario([newItem, ...prontuarioList]);
      toast.success('Evolução clínica adicionada ao prontuário.');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = prontuarioList.filter((p) => p.id !== id);
    onSaveProntuario(updated);
    toast.success('Registro do prontuário excluído.');
  };

  return (
    <>
      <ClinicalDataGrid
        title="Prontuário & Linha do Tempo Clínica"
        subtitle="Histórico longitudinal de condutas, anotações de evolução e intercorrências"
        items={clinicalItems}
        itemLabel="evoluções"
        newButtonText="Adicionar evolução"
        templates={['Evolução Clínica', 'Consulta de Retorno', 'Ajuste de Conduta', 'Intercorrência']}
        onNew={handleOpenNewModal}
        onEdit={(item) => handleEditItem(item.raw || item)}
        onDelete={(item) => handleDelete(item.id)}
        onPrint={(item) => {
          toast.success(`Imprimindo evolução do prontuário: ${item.title}...`);
        }}
        onCompare={() => {
          toast.info('Comparando linha do tempo clínica...');
        }}
        onExportAll={() => {
          toast.info('Exportando prontuário integral em PDF...');
        }}
      />

      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Registro no Prontuário' : 'Nova Evolução Clínica'}
        subtitle="Registro formal de condutas nutricionais, observações e intercorrências"
        maxWidth="680px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 2px var(--primary-border)',
              }}
            >
              {editingItem ? 'Atualizar Prontuário' : 'Gravar no Prontuário'}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppSelect
              label="Tipo de Registro"
              value={form.templateType}
              onChange={(e) => setForm({ ...form, templateType: e.target.value })}
              options={[
                { value: 'Evolução Clínica', label: 'Evolução Clínica' },
                { value: 'Consulta de Retorno', label: 'Consulta de Retorno' },
                { value: 'Ajuste de Conduta', label: 'Ajuste de Conduta' },
                { value: 'Intercorrência', label: 'Intercorrência' },
              ]}
              required
            />
            <AppInput
              label="Data do Atendimento"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <AppInput
            label="Assunto / Título do Registro"
            placeholder="Ex: Consulta 2º Mês - Boa adesão, ajuste de calorias"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <AppTextarea
            label="Conduta Nutricional & Observações Clínicas"
            placeholder="Relate as queixas do paciente, adesão ao plano, alterações de exames e conduta prescrita..."
            rows={8}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </AppModal>
    </>
  );
};
