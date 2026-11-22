import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Edit2, AlertTriangle, AlertCircle, Ban } from 'lucide-react';
import { AppModal, AppInput, AppSelect, AppTextarea } from '../../ui';
import { useToast } from '../../../context/ToastContext';

export interface FoodRestriction {
  id: string;
  foodOrSubstance: string;
  reason: 'Alergia' | 'Intolerância' | 'Não Gosta' | 'Outra restrição';
  status: 'Ativa' | 'Inativa';
  origin?: string;
  observation?: string;
  createdAt?: string;
}

export interface PatientRestrictionsTabProps {
  restrictionsList: FoodRestriction[];
  onSaveRestrictions: (updated: FoodRestriction[]) => void;
}

export const PatientRestrictionsTab: React.FC<PatientRestrictionsTabProps> = ({
  restrictionsList,
  onSaveRestrictions,
}) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodRestriction | null>(null);
  const [form, setForm] = useState<{
    foodOrSubstance: string;
    reason: 'Alergia' | 'Intolerância' | 'Não Gosta' | 'Outra restrição';
    status: 'Ativa' | 'Inativa';
    origin: string;
    observation: string;
  }>({
    foodOrSubstance: '',
    reason: 'Alergia',
    status: 'Ativa',
    origin: 'Relatado pelo paciente',
    observation: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterReason, setFilterReason] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredList = useMemo(() => {
    return restrictionsList.filter((r) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.foodOrSubstance.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        (r.origin && r.origin.toLowerCase().includes(q)) ||
        (r.observation && r.observation.toLowerCase().includes(q));

      const matchesReason = filterReason === 'ALL' || r.reason === filterReason;
      const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;

      return matchesQuery && matchesReason && matchesStatus;
    });
  }, [restrictionsList, searchQuery, filterReason, filterStatus]);

  const handleOpenNewModal = () => {
    setEditingItem(null);
    setForm({
      foodOrSubstance: '',
      reason: 'Alergia',
      status: 'Ativa',
      origin: 'Relatado pelo paciente',
      observation: '',
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item: FoodRestriction) => {
    setEditingItem(item);
    setForm({
      foodOrSubstance: item.foodOrSubstance,
      reason: item.reason,
      status: item.status,
      origin: item.origin || 'Relatado pelo paciente',
      observation: item.observation || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.foodOrSubstance.trim()) {
      toast.error('O alimento ou substância é obrigatório.');
      return;
    }
    if (!form.reason) {
      toast.error('O motivo da restrição é obrigatório.');
      return;
    }

    if (editingItem) {
      const updated = restrictionsList.map((r) =>
        r.id === editingItem.id
          ? {
              ...r,
              foodOrSubstance: form.foodOrSubstance.trim(),
              reason: form.reason,
              status: form.status,
              origin: form.origin,
              observation: form.observation.trim() || undefined,
            }
          : r
      );
      onSaveRestrictions(updated);
      toast.success('Restrição alimentar atualizada com sucesso.');
    } else {
      const newItem: FoodRestriction = {
        id: String(Date.now()),
        foodOrSubstance: form.foodOrSubstance.trim(),
        reason: form.reason,
        status: form.status,
        origin: form.origin,
        observation: form.observation.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      onSaveRestrictions([newItem, ...restrictionsList]);
      toast.success('Restrição alimentar cadastrada com sucesso.');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = restrictionsList.filter((r) => r.id !== id);
    onSaveRestrictions(updated);
    toast.success('Restrição alimentar removida com sucesso.');
  };

  const handleToggleStatus = (item: FoodRestriction) => {
    const newStatus: 'Ativa' | 'Inativa' = item.status === 'Ativa' ? 'Inativa' : 'Ativa';
    const updated = restrictionsList.map((r) => (r.id === item.id ? { ...r, status: newStatus } : r));
    onSaveRestrictions(updated);
    toast.info(`Situação de "${item.foodOrSubstance}" alterada para ${newStatus}.`);
  };

  const getReasonBadgeStyle = (reason: string) => {
    switch (reason) {
      case 'Alergia':
        return { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5', icon: AlertTriangle };
      case 'Intolerância':
        return { bg: '#ffedd5', color: '#ea580c', border: '#fdba74', icon: AlertCircle };
      case 'Não Gosta':
        return { bg: '#ede9fe', color: '#7c3aed', border: '#c4b5fd', icon: Ban };
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', icon: AlertCircle };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
      {/* Cabeçalho */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Restrições Alimentares
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
            Alergias, intolerâncias e aversões alimentares relatadas ou diagnosticadas
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 2px var(--primary-border)',
            transition: 'background-color 0.15s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
        >
          <Plus size={15} />
          <span>Adicionar restrição</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca Padronizada */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
          padding: '0.75rem 1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.625rem',
        }}
      >
        {/* Campo de Busca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar alimento, motivo, origem..."
            style={{
              width: '100%',
              minHeight: '38px',
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              fontSize: '0.8125rem',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.2rem',
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Filtro por Motivo via AppSelect */}
        <div style={{ minWidth: '170px' }}>
          <AppSelect
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            options={[
              { value: 'ALL', label: 'Todos os motivos' },
              { value: 'Alergia', label: 'Alergia' },
              { value: 'Intolerância', label: 'Intolerância' },
              { value: 'Não Gosta', label: 'Não Gosta' },
              { value: 'Outra restrição', label: 'Outra restrição' },
            ]}
          />
        </div>

        {/* Filtro por Situação via AppSelect */}
        <div style={{ minWidth: '140px' }}>
          <AppSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'Todas as situações' },
              { value: 'Ativa', label: 'Ativa' },
              { value: 'Inativa', label: 'Inativa' },
            ]}
          />
        </div>
      </div>

      {/* Tabela de Restrições */}
      {filteredList.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3.5rem 1rem',
            borderRadius: '0.75rem',
            border: '1px dashed #cbd5e1',
            backgroundColor: '#f8fafc',
            textAlign: 'center',
            gap: '0.75rem',
          }}
        >
          <Ban size={40} color="#94a3b8" />
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
            Nenhuma restrição alimentar encontrada.
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
            Cadastre alimentos com alergia, intolerância ou recusa do paciente.
          </p>
          <button
            type="button"
            onClick={handleOpenNewModal}
            style={{
              marginTop: '0.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.45rem 0.95rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            <span>Adicionar primeira restrição</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Alimento ou Substância</th>
                  <th style={{ padding: '0.75rem 1.25rem', width: '150px' }}>Tipo / Motivo</th>
                  <th style={{ padding: '0.75rem 1.25rem', width: '110px' }}>Situação</th>
                  <th style={{ padding: '0.75rem 1.25rem', width: '180px' }}>Origem</th>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Observação</th>
                  <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right', width: '120px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => {
                  const badge = getReasonBadgeStyle(item.reason);
                  const BadgeIcon = badge.icon;
                  const isAtiva = item.status === 'Ativa';

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                      onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
                    >
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                          {item.foodOrSubstance}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            borderRadius: '9999px',
                            padding: '0.15rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          <BadgeIcon size={12} />
                          <span>{item.reason}</span>
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          title="Clique para alternar a situação"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: isAtiva ? 'var(--primary-light)' : '#f1f5f9',
                            color: isAtiva ? 'var(--primary)' : '#64748b',
                            border: `1px solid ${isAtiva ? 'var(--primary-border)' : '#cbd5e1'}`,
                            borderRadius: '0.375rem',
                            padding: '0.15rem 0.55rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isAtiva ? 'var(--primary)' : '#94a3b8',
                            }}
                          />
                          <span>{item.status}</span>
                        </button>
                      </td>

                      <td style={{ padding: '0.85rem 1.25rem', color: '#64748b' }}>
                        {item.origin || 'Relatado pelo paciente'}
                      </td>

                      <td style={{ padding: '0.85rem 1.25rem', color: '#475569' }}>
                        {item.observation || '—'}
                      </td>

                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleEditItem(item)}
                            title="Editar restrição"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '0.25rem',
                            }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Excluir restrição"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '0.25rem',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Adicionar/Editar Restrição */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Restrição Alimentar' : 'Nova Restrição Alimentar'}
        subtitle="Registro de intolerâncias, alergias ou aversões para blindar o plano alimentar"
        maxWidth="560px"
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
              {editingItem ? 'Salvar Alterações' : 'Cadastrar Restrição'}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AppInput
            label="Alimento ou Substância"
            placeholder="Ex: Leite de vaca, Camarão, Glúten, Amendoim"
            value={form.foodOrSubstance}
            onChange={(e) => setForm({ ...form, foodOrSubstance: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppSelect
              label="Tipo / Motivo da Restrição"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value as any })}
              options={[
                { value: 'Alergia', label: 'Alergia (Mediada por IgE/Não IgE)' },
                { value: 'Intolerância', label: 'Intolerância Alimentar' },
                { value: 'Não Gosta', label: 'Não Gosta / Recusa' },
                { value: 'Outra restrição', label: 'Outra Restrição Clínica' },
              ]}
              required
            />
            <AppSelect
              label="Situação"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              options={[
                { value: 'Ativa', label: 'Ativa' },
                { value: 'Inativa', label: 'Inativa' },
              ]}
              required
            />
          </div>

          <AppInput
            label="Origem da Informação"
            placeholder="Ex: Exame de IgE específica, Relatado pelo paciente"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
          />

          <AppTextarea
            label="Observações e Sintomas Clínicos"
            placeholder="Descreva sintomas apresentados (ex: urticária, desconforto abdominal)..."
            rows={4}
            value={form.observation}
            onChange={(e) => setForm({ ...form, observation: e.target.value })}
          />
        </div>
      </AppModal>
    </div>
  );
};
