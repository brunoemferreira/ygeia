import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface DataTablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

export function DataTablePagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  itemLabel = 'registros',
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  // Calcula conjunto dinâmico de números de páginas
  const pageNumbers: (number | 'ellipsis')[] = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safePage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }

    if (safePage >= totalPages - 3) {
      return [
        1,
        'ellipsis',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      'ellipsis',
      safePage - 1,
      safePage,
      safePage + 1,
      'ellipsis',
      totalPages,
    ];
  })();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        padding: '0.625rem 1.25rem',
        fontSize: '0.75rem',
        color: '#64748b',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Informação e Seletor de Registros por Página */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
        <span>
          Exibindo{' '}
          <strong style={{ fontWeight: 600, color: '#1e293b' }}>
            {startItem}–{endItem}
          </strong>{' '}
          de{' '}
          <strong style={{ fontWeight: 600, color: '#1e293b' }}>
            {totalItems}
          </strong>{' '}
          {itemLabel}
        </span>

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <label htmlFor="bh-pagination-pagesize" style={{ color: '#94a3b8' }}>
              Itens por página:
            </label>
            <select
              id="bh-pagination-pagesize"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                padding: '0.2rem 0.45rem',
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: '#334155',
                outline: 'none',
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Controles de Navegação de Páginas */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {/* Primeira Página */}
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(1)}
          title="Primeira Página"
          style={{
            borderRadius: '0.375rem',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            padding: '0.2rem',
            color: '#64748b',
            cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
            opacity: safePage <= 1 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Página Anterior */}
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          title="Página Anterior"
          style={{
            borderRadius: '0.375rem',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            padding: '0.2rem',
            color: '#64748b',
            cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
            opacity: safePage <= 1 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Números das Páginas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0 0.15rem' }}>
          {pageNumbers.map((p, idx) => {
            if (p === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{ padding: '0 0.2rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem' }}
                >
                  …
                </span>
              );
            }

            const isActive = p === safePage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                style={{
                  minWidth: '24px',
                  height: '24px',
                  borderRadius: '0.375rem',
                  padding: '0 0.35rem',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? 'none' : '1px solid #cbd5e1',
                  backgroundColor: isActive ? 'var(--primary)' : '#ffffff',
                  color: isActive ? '#ffffff' : '#334155',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Próxima Página */}
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          title="Próxima Página"
          style={{
            borderRadius: '0.375rem',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            padding: '0.2rem',
            color: '#64748b',
            cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
            opacity: safePage >= totalPages ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={14} />
        </button>

        {/* Última Página */}
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          title="Última Página"
          style={{
            borderRadius: '0.375rem',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            padding: '0.2rem',
            color: '#64748b',
            cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
            opacity: safePage >= totalPages ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
