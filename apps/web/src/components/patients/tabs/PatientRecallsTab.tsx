import React, { useState, useMemo } from 'react';
import { ClinicalDataGrid, ClinicalRecordItem, AppModal, AppInput, AppSelect, AppTextarea } from '../../ui';
import { useToast } from '../../../context/ToastContext';

export interface RecallItem {
  id: string;
  title: string;
  templateType: string;
  date: string;
  notes?: string;
}

export interface PatientRecallsTabProps {
  recallsList: RecallItem[];
  onSaveRecalls: (updated: RecallItem[]) => void;
}

export const PatientRecallsTab: React.FC<PatientRecallsTabProps> = ({
  recallsList,
  onSaveRecalls,
}) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecallItem | null>(null);
  const [form, setForm] = useState<{ title: string; templateType: string; date: string; notes: string }>({
    title: '',
    templateType: 'Recordatório 24 Horas',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const clinicalItems: ClinicalRecordItem[] = useMemo(() => {
    return recallsList.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      templateType: item.templateType || 'Recordatório 24 Horas',
      raw: item,
    }));
  }, [recallsList]);

  const handleOpenNewModal = () => {
    const now = new Date();
    setEditingItem(null);
    setForm({
      title: `Recordatório 24 Horas - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`,
      templateType: 'Recordatório 24 Horas',
      date: now.toISOString().split('T')[0],
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item: RecallItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      templateType: item.templateType || 'Recordatório 24 Horas',
      date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error('Informe um título para o recordatório alimentar.');
      return;
    }
    if (editingItem) {
      const updated = recallsList.map((r) =>
        r.id === editingItem.id
          ? {
              ...r,
              title: form.title.trim(),
              templateType: form.templateType,
              date: new Date(form.date).toISOString(),
              notes: form.notes,
            }
          : r
      );
      onSaveRecalls(updated);
      toast.success('Recordatório alimentar atualizado com sucesso.');
    } else {
      const newItem: RecallItem = {
        id: String(Date.now()),
        title: form.title.trim(),
        templateType: form.templateType,
        date: new Date(form.date).toISOString(),
        notes: form.notes,
      };
      onSaveRecalls([newItem, ...recallsList]);
      toast.success('Novo recordatório alimentar registrado com sucesso.');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = recallsList.filter((r) => r.id !== id);
    onSaveRecalls(updated);
    toast.success('Recordatório alimentar excluído.');
  };

  return (
    <>
      <ClinicalDataGrid
        title="Recordatório Alimentar"
        subtitle="Inquéritos alimentares de 24h, hábitos e questionários de consumo do paciente"
        items={clinicalItems}
        itemLabel="recordatórios"
        newButtonText="Adicionar recordatório"
        templates={['Recordatório 24 Horas', 'Registro Habitual', 'Registro de 3 Dias', 'QFA - Frequência']}
        onNew={handleOpenNewModal}
        onEdit={(item) => handleEditItem(item.raw || item)}
        onDelete={(item) => handleDelete(item.id)}
        onPrint={(item) => {
          toast.success(`Gerando PDF do recordatório: ${item.title}...`);
        }}
        onCompare={() => {
          toast.info('Comparando consumo alimentar com consultas anteriores...');
        }}
        onExportAll={() => {
          toast.info('Gerando consolidado em PDF de todos os recordatórios...');
        }}
      />

      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Recordatório Alimentar' : 'Novo Recordatório Alimentar'}
        subtitle="Inquérito alimentar detalhado com horários, quantidades e preparações"
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
              {editingItem ? 'Atualizar Recordatório' : 'Salvar Recordatório'}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppSelect
              label="Tipo de Recordatório"
              value={form.templateType}
              onChange={(e) => setForm({ ...form, templateType: e.target.value })}
              options={[
                { value: 'Recordatório 24 Horas', label: 'Recordatório 24 Horas' },
                { value: 'Registro Habitual', label: 'Registro Habitual' },
                { value: 'Registro de 3 Dias', label: 'Registro de 3 Dias' },
                { value: 'QFA - Frequência', label: 'QFA - Questionário de Frequência' },
              ]}
              required
            />
            <AppInput
              label="Data da Coleta"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <AppInput
            label="Título do Registro"
            placeholder="Ex: Recordatório 24 Horas - Segunda-feira típica"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <AppTextarea
            label="Refeições, Horários e Quantidades Relatadas"
            placeholder="Descreva as refeições consumidas, horários, marcas e medidas caseiras..."
            rows={8}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </AppModal>
    </>
  );
};
