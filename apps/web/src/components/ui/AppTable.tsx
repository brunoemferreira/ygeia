import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { getStoredBranding } from '../../utils/branding';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableFilterOption<T> {
  label: string;
  value: string;
  filterFn: (item: T) => boolean;
}

export interface AppTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (item: T, term: string) => boolean;
  filterOptions?: TableFilterOption<T>[];
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  topActionRight?: React.ReactNode;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

export function AppTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Buscar...',
  searchFilter,
  filterOptions,
  onRowClick,
  actions,
  topActionRight,
  emptyMessage = 'Nenhum registro localizado.',
  pageSizeOptions = [10, 20, 50],
  defaultPageSize = 10,
}: AppTableProps<T>) {
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>(
    filterOptions && filterOptions.length > 0 ? filterOptions[0].value : 'ALL'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Search filter
      let matchSearch = true;
      if (searchTerm.trim()) {
        if (searchFilter) {
          matchSearch = searchFilter(item, searchTerm.toLowerCase().trim());
        } else {
          matchSearch = JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase().trim());
        }
      }

      // 2. Dropdown category filter
      let matchFilter = true;
      if (filterOptions && selectedFilter !== 'ALL') {
        const option = filterOptions.find((opt) => opt.value === selectedFilter);
        if (option) {
          matchFilter = option.filterFn(item);
        }
      }

      return matchSearch && matchFilter;
    });
  }, [data, searchTerm, selectedFilter, searchFilter, filterOptions]);

  // Paginated data
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* 1. Barra de Ações Superiores: Busca + Filtro + Ação Direita */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.8125rem',
              color: '#0f172a',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              backgroundColor: 'transparent',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {filterOptions && filterOptions.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>
                Filtrar:
              </span>
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                }}
              >
                <option value="ALL">Todos os Registros</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {topActionRight && <div>{topActionRight}</div>}
        </div>
      </div>

      {/* 2. Container da Tabela com Scroll Horizontal Seguro */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    style={{
                      padding: '0.875rem 1.25rem',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#64748b',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      textAlign: col.align || 'left',
                      width: col.width,
                      whiteSpace: 'nowrap',
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    }}
                  >
                    {col.header}
                  </th>
                ))}
                {actions && (
                  <th
                    style={{
                      padding: '0.875rem 1.25rem',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#64748b',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      width: '110px',
                      minWidth: '110px',
                      position: 'sticky',
                      right: 0,
                      backgroundColor: '#ffffff',
                      zIndex: 2,
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    }}
                  >
                    AÇÕES
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    style={{
                      padding: '3.5rem 1rem',
                      textAlign: 'center',
                      color: '#64748b',
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    }}
                  >
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                      {emptyMessage}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Tente ajustar os filtros de pesquisa ou cadastre um novo registro.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const key = keyExtractor(item);
                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick?.(item)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        cursor: onRowClick ? 'pointer' : 'default',
                        transition: 'background-color 0.12s ease',
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                        const stickyCell = (e.currentTarget as HTMLElement).querySelector('.app-table-actions-cell') as HTMLElement;
                        if (stickyCell) stickyCell.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                        const stickyCell = (e.currentTarget as HTMLElement).querySelector('.app-table-actions-cell') as HTMLElement;
                        if (stickyCell) stickyCell.style.backgroundColor = '#ffffff';
                      }}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          style={{
                            padding: '0.875rem 1.25rem',
                            textAlign: col.align || 'left',
                            fontSize: '0.8125rem',
                            color: '#334155',
                            whiteSpace: 'nowrap',
                            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                          }}
                        >
                          {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey] ?? '') : null}
                        </td>
                      ))}

                      {actions && (
                        <td
                          className="app-table-actions-cell"
                          style={{
                            padding: '0.875rem 1.25rem',
                            textAlign: 'right',
                            whiteSpace: 'nowrap',
                            width: '110px',
                            minWidth: '110px',
                            position: 'sticky',
                            right: 0,
                            backgroundColor: '#ffffff',
                            zIndex: 1,
                            boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.05)',
                            transition: 'background-color 0.12s ease',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {actions(item)}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Rodapé de Paginação Padrão */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            backgroundColor: '#ffffff',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          {/* Contador de Registros & Seletor de Tamanho */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Exibindo {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredData.length)} de {filteredData.length} registros
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Itens por página:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  color: '#334155',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navegação Numérica e Setas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}
              title="Primeira página"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.3rem',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                color: currentPage <= 1 ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronsLeft size={15} />
            </button>

            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              title="Página anterior"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.3rem',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                color: currentPage <= 1 ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '0.375rem',
                    backgroundColor: isActive ? primaryColor : 'transparent',
                    color: isActive ? '#ffffff' : '#64748b',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              title="Próxima página"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.3rem',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                color: currentPage >= totalPages ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronRight size={15} />
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              title="Última página"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.3rem',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                color: currentPage >= totalPages ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
