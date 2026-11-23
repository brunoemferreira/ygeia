import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  List,
  LayoutGrid,
  Plus,
  Printer,
  Download,
  Edit2,
  Trash2,
  Split,
  Eye,
  Clock,
  Activity,
  CheckCircle2,
  X,
  FolderOpen,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { DataTablePagination } from './DataTablePagination';
import { AppModal } from './AppModal';

export interface ClinicalRecordItem {
  id: string;
  title: string;
  date: string;
  templateType?: string;
  previewText?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  raw?: any;
}

export interface ClinicalDataGridProps<T extends ClinicalRecordItem> {
  title: string;
  subtitle?: string;
  items: T[];
  itemLabel?: string;
  newButtonText?: string;
  onNew: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onPrint?: (item: T) => void;
  onCompare?: (item: T) => void;
  onExportAll?: () => void;
  templates?: string[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export function ClinicalDataGrid<T extends ClinicalRecordItem>({
  title,
  subtitle,
  items,
  itemLabel = 'registros',
  newButtonText,
  onNew,
  onEdit,
  onDelete,
  onPrint,
  onCompare,
  onExportAll,
  templates = ['Todos os modelos'],
  emptyStateTitle = 'Nenhum registro encontrado',
  emptyStateDescription = 'Comece criando o primeiro registro clínico para este paciente.',
}: ClinicalDataGridProps<T>) {
  const singularLabel = itemLabel.endsWith('es')
    ? itemLabel.slice(0, -2)
    : itemLabel.endsWith('s')
    ? itemLabel.slice(0, -1)
    : itemLabel;

  const computedNewText = newButtonText || `Adicionar ${singularLabel}`;
  // Estados de visualização e filtros
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('ALL');
  const [sortBy, setSortBy] = useState<'desc' | 'asc'>('desc');
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Cálculos de Métricas Clínicas de Cabeçalho (Summary KPIs)
  const metrics = useMemo(() => {
    if (!items || items.length === 0) {
      return {
        total: 0,
        firstDate: '—',
        lastDate: '—',
        lastRelative: 'Nenhuma consulta',
        avgInterval: '—',
      };
    }

    // Ordena por data temporal real
    const sortedDates = [...items]
      .map((item) => new Date(item.date).getTime())
      .filter((time) => !isNaN(time))
      .sort((a, b) => a - b);

    if (sortedDates.length === 0) {
      return {
        total: items.length,
        firstDate: '—',
        lastDate: '—',
        lastRelative: '—',
        avgInterval: '—',
      };
    }

    const first = new Date(sortedDates[0]!);
    const last = new Date(sortedDates[sortedDates.length - 1]!);

    const now = new Date().getTime();
    const diffDaysLast = Math.floor((now - last.getTime()) / (1000 * 60 * 60 * 24));

    let lastRelative = 'Hoje';
    if (diffDaysLast === 1) lastRelative = 'Ontem';
    else if (diffDaysLast > 1) lastRelative = `Há ${diffDaysLast} dias`;

    let avgInterval = '—';
    if (sortedDates.length > 1) {
      const totalSpanDays = (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24);
      const avg = Math.round(totalSpanDays / (sortedDates.length - 1));
      avgInterval = avg > 0 ? `A cada ~${avg} dias` : 'No mesmo dia';
    }

    return {
      total: items.length,
      firstDate: first.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastDate: last.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastRelative,
      avgInterval,
    };
  }, [items]);

  // Filtros dinâmicos e busca
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          item.title.toLowerCase().includes(query) ||
          (item.previewText && item.previewText.toLowerCase().includes(query)) ||
          (item.templateType && item.templateType.toLowerCase().includes(query)) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)));

        const matchesTemplate =
          selectedTemplate === 'ALL' || item.templateType === selectedTemplate;

        return matchesQuery && matchesTemplate;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime() || 0;
        const timeB = new Date(b.date).getTime() || 0;
        return sortBy === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [items, searchQuery, selectedTemplate, sortBy]);

  // Itens paginados
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Formata data e tempo relativo
  const formatDateBadge = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { date: dateStr, relative: '' };
    }
    const dateFormatted = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const diffDays = Math.floor((new Date().getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    let relative = 'Hoje';
    if (diffDays === 1) relative = 'Ontem';
    else if (diffDays > 1) relative = `Há ${diffDays} dias`;
    return { date: dateFormatted, relative };
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', fontFamily: 'var(--font-sans)' }}>
      {/* ========================================================
          1. CABEÇALHO DA SEÇÃO (TÍTULO, SUBTÍTULO & AÇÕES GERAIS)
         ======================================================== */}
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          {onExportAll && (
            <button
              type="button"
              onClick={onExportAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
            >
              <Printer size={15} color="#64748b" />
              <span>PDF Unificado</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNew}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.45rem 1.15rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
          >
            <Plus size={16} />
            <span>{computedNewText}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. SUMMARY KPI STRIP (MÉTRICAS CLÍNICAS DE CABEÇALHO)
         ======================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.875rem',
          width: '100%',
        }}
      >
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={kpiLabelStyle}>Total de Consultas</span>
            <div style={{ ...kpiIconBoxStyle, color: 'var(--primary)', backgroundColor: 'var(--primary-light)' }}>
              <Activity size={15} />
            </div>
          </div>
          <div style={kpiValueStyle}>{metrics.total} <small style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>{itemLabel}</small></div>
          <div style={kpiSubtextStyle}>Histórico longitudinal</div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={kpiLabelStyle}>Primeira Consulta</span>
            <div style={{ ...kpiIconBoxStyle, color: '#6366f1', backgroundColor: '#eef2ff' }}>
              <Calendar size={15} />
            </div>
          </div>
          <div style={kpiValueStyle}>{metrics.firstDate}</div>
          <div style={kpiSubtextStyle}>Início do acompanhamento</div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={kpiLabelStyle}>Último Retorno</span>
            <div style={{ ...kpiIconBoxStyle, color: '#059669', backgroundColor: '#ecfdf5' }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={kpiValueStyle}>{metrics.lastDate}</div>
          <div style={kpiSubtextStyle}>{metrics.lastRelative}</div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={kpiLabelStyle}>Frequência Média</span>
            <div style={{ ...kpiIconBoxStyle, color: '#d97706', backgroundColor: '#fef3c7' }}>
              <Clock size={15} />
            </div>
          </div>
          <div style={kpiValueStyle}>{metrics.avgInterval}</div>
          <div style={kpiSubtextStyle}>Intervalo médio de retornos</div>
        </div>
      </div>

      {/* ========================================================
          3. BARRA DE CONTROLE (BUSCA, FILTRO, ORDENAÇÃO E SWITCHER)
         ======================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '0.875rem',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '0.625rem 0.875rem',
          gap: '0.75rem',
          flexWrap: 'wrap',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        }}
      >
        {/* Campo de Busca em Tempo Real */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por queixa, medicamento ou observação..."
            style={{
              width: '100%',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              padding: '0.45rem 2rem 0.45rem 2.2rem',
              fontSize: '0.8125rem',
              color: '#0f172a',
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
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '0.2rem',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Controles da Direita: Filtros + Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Filtro por Modelo/Template */}
          {templates.length > 1 && (
            <div style={{ position: 'relative' }}>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  setCurrentPage(1);
                }}
                style={selectControlStyle}
              >
                <option value="ALL">Todos os Modelos</option>
                {templates.map((tmpl) => (
                  <option key={tmpl} value={tmpl}>
                    {tmpl}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} color="#94a3b8" style={selectChevronStyle} />
            </div>
          )}

          {/* Ordenação Mais Recente / Mais Antiga */}
          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'desc' | 'asc')}
              style={selectControlStyle}
            >
              <option value="desc">Mais recentes primeiro</option>
              <option value="asc">Mais antigas primeiro</option>
            </select>
            <ArrowUpDown size={13} color="#94a3b8" style={selectChevronStyle} />
          </div>

          <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 0.15rem' }} />

          {/* Alternador de Layout (Tabela Lista vs. Cards Cronológicos) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.5rem',
              padding: '0.2rem',
              gap: '0.15rem',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Visualização em Tabela"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: '0.375rem',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#0f172a' : '#64748b',
                boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <List size={14} />
              <span className="desktop-only">Tabela Lista</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              title="Visualização em Linha do Tempo / Cards"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: '0.375rem',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'cards' ? '#ffffff' : 'transparent',
                color: viewMode === 'cards' ? '#0f172a' : '#64748b',
                boxShadow: viewMode === 'cards' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <LayoutGrid size={14} />
              <span className="desktop-only">Cards Cronológicos</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. APRESENTAÇÃO DE DADOS (DUAL-VIEW OU EMPTY STATE)
         ======================================================== */}
      {filteredItems.length === 0 ? (
        /* Empty State Elegante */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <FolderOpen size={32} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
            {searchQuery ? 'Nenhum resultado encontrado' : emptyStateTitle}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', maxWidth: '380px', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
            {searchQuery
              ? `Não foram encontrados registros para o termo "${searchQuery}". Tente buscar por outros termos ou limpe o filtro.`
              : emptyStateDescription}
          </p>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                padding: '0.45rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              Limpar busca
            </button>
          ) : (
            <button
              type="button"
              onClick={onNew}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                padding: '0.5rem 1.25rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>Adicionar primeiro registro</span>
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* ========================================================
            MODO TABELA CLÍNICA PAGINADA (DENSE SCANNER VIEW)
           ======================================================== */
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Data da Consulta</th>
                  <th
                    style={{
                      padding: '0.85rem 1.25rem',
                      textAlign: 'right',
                      width: '180px',
                      minWidth: '180px',
                      position: 'sticky',
                      right: 0,
                      backgroundColor: '#f8fafc',
                      boxShadow: '-4px 0 6px -2px rgba(0,0,0,0.03)',
                    }}
                  >
                    Ações Rápidas
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item, index) => {
                  const dateInfo = formatDateBadge(item.date);
                  const isFirstConsult = index === paginatedItems.length - 1 && currentPage === Math.ceil(filteredItems.length / pageSize);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onEdit(item)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                      onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
                    >
                      {/* 1. Coluna Data da Consulta com Ícone, Título e Modelo */}
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '36px',
                              height: '36px',
                              borderRadius: '0.5rem',
                              backgroundColor: 'var(--primary-light)',
                              color: 'var(--primary)',
                              border: '1px solid var(--primary-border)',
                              flexShrink: 0,
                            }}
                          >
                            <Calendar size={18} />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                                {item.title}
                              </span>
                              {item.templateType && (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    borderRadius: '9999px',
                                    backgroundColor: '#f1f5f9',
                                    border: '1px solid #e2e8f0',
                                    color: '#475569',
                                    padding: '0.1rem 0.5rem',
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.templateType}
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                              <span style={{ fontWeight: 500 }}>{dateInfo.date}</span>
                              <span>•</span>
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: dateInfo.relative === 'Hoje' ? 'var(--primary)' : '#64748b',
                                }}
                              >
                                {isFirstConsult ? 'Primeira consulta' : dateInfo.relative}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Coluna Ações Rápidas (Sticky) */}
                      <td
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: '0.85rem 1.25rem',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                          position: 'sticky',
                          right: 0,
                          backgroundColor: '#ffffff',
                          boxShadow: '-4px 0 6px -2px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            title="Visualizar e editar no editor Word"
                            style={actionIconBtnStyle}
                            onMouseOver={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-light)';
                              (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                              (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-border)';
                            }}
                            onMouseOut={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                              (e.currentTarget as HTMLElement).style.color = '#64748b';
                              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                            }}
                          >
                            <Eye size={14} />
                          </button>

                          {onPrint && (
                            <button
                              type="button"
                              onClick={() => onPrint(item)}
                              title={`Imprimir ou baixar PDF deste ${singularLabel}`}
                              style={actionIconBtnStyle}
                              onMouseOver={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                                (e.currentTarget as HTMLElement).style.color = '#0f172a';
                              }}
                              onMouseOut={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                                (e.currentTarget as HTMLElement).style.color = '#64748b';
                              }}
                            >
                              <Download size={14} />
                            </button>
                          )}

                          {onCompare && (
                            <button
                              type="button"
                              onClick={() => onCompare(item)}
                              title="Comparar evolução com consultas anteriores"
                              style={actionIconBtnStyle}
                              onMouseOver={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                                (e.currentTarget as HTMLElement).style.color = '#0f172a';
                              }}
                              onMouseOut={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                                (e.currentTarget as HTMLElement).style.color = '#64748b';
                              }}
                            >
                              <Split size={14} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            title={`Excluir ${singularLabel}`}
                            style={actionIconBtnStyle}
                            onMouseOver={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = '#fff1f2';
                              (e.currentTarget as HTMLElement).style.borderColor = '#fecdd3';
                              (e.currentTarget as HTMLElement).style.color = '#e11d48';
                            }}
                            onMouseOut={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                              (e.currentTarget as HTMLElement).style.color = '#64748b';
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

          {/* Paginação da Tabela */}
          <DataTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredItems.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            itemLabel={itemLabel}
          />
        </div>
      ) : (
        /* ========================================================
            MODO CARDS CRONOLÓGICOS / LINHA DO TEMPO (TIMELINE VIEW)
           ======================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
          {/* Linha vertical conectora de Timeline */}
          <div
            style={{
              position: 'absolute',
              left: '20px',
              top: '20px',
              bottom: '20px',
              width: '2px',
              backgroundColor: '#e2e8f0',
              zIndex: 0,
            }}
          />

          {paginatedItems.map((item, index) => {
            const dateInfo = formatDateBadge(item.date);
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Marcador do Nó da Linha do Tempo */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: index === 0 ? 'var(--primary)' : '#ffffff',
                    border: `2px solid ${index === 0 ? 'var(--primary)' : '#cbd5e1'}`,
                    color: index === 0 ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  <Calendar size={18} />
                </div>

                {/* Card Clínico do Encontro */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    border: '1px solid #e2e8f0',
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-border)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                          {dateInfo.date}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          ({dateInfo.relative})
                        </span>
                        {item.templateType && (
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              color: 'var(--primary)',
                              backgroundColor: 'var(--primary-light)',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '9999px',
                            }}
                          >
                            {item.templateType}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {item.title}
                      </h3>
                    </div>

                    {/* Ações do Card */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: 'var(--primary)',
                          color: '#ffffff',
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '0.375rem',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Abrir no Editor</span>
                      </button>

                      {onPrint && (
                        <button
                          type="button"
                          onClick={() => onPrint(item)}
                          title="Imprimir PDF"
                          style={actionIconBtnStyle}
                        >
                          <Download size={14} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        title={`Excluir ${singularLabel}`}
                        style={actionIconBtnStyle}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <DataTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredItems.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            itemLabel={itemLabel}
          />
        </div>
      )}

      {/* ========================================================
          5. MODAL DE CONFIRMAÇÃO DE EXCLUSÃO SEGURA
         ======================================================== */}
      {itemToDelete && (
        <AppModal
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          title="Confirmar Exclusão de Registro Clínico"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Tem certeza que deseja excluir permanentemente o registro clínico{' '}
              <strong>"{itemToDelete.title}"</strong> ({itemToDelete.date})?
            </p>
            <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0, fontWeight: 600 }}>
              Esta ação removerá as notas de evolução do prontuário do paciente e não poderá ser desfeita.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                style={{
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  padding: '0.5rem 1rem',
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
                onClick={handleConfirmDelete}
                style={{
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
}

// Estilos utilitários
const kpiCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '0.875rem',
  border: '1px solid #e2e8f0',
  padding: '0.85rem 1rem',
  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
};

const kpiLabelStyle: React.CSSProperties = {
  fontSize: '0.6875rem',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const kpiValueStyle: React.CSSProperties = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: '#0f172a',
  letterSpacing: '-0.02em',
  marginBottom: '0.15rem',
};

const kpiSubtextStyle: React.CSSProperties = {
  fontSize: '0.6875rem',
  color: '#94a3b8',
};

const kpiIconBoxStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '0.375rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const selectControlStyle: React.CSSProperties = {
  borderRadius: '0.5rem',
  border: '1px solid #cbd5e1',
  backgroundColor: '#ffffff',
  padding: '0.45rem 1.85rem 0.45rem 0.75rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#334155',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
};

const selectChevronStyle: React.CSSProperties = {
  position: 'absolute',
  right: '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

const actionIconBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '0.375rem',
  border: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
  color: '#64748b',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
};
