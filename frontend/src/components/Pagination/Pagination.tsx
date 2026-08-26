import clsx from 'clsx';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="h-9 w-9 rounded-lg border border-slate-300 text-sm disabled:opacity-40 dark:border-slate-700"
      >
        ‹
      </button>
      {pages.map((p, index) => (
        <span key={p} className="flex items-center">
          {index > 0 && pages[index - 1] !== p - 1 && <span className="px-1 text-slate-400">…</span>}
          <button
            onClick={() => onPageChange(p)}
            className={clsx(
              'h-9 w-9 rounded-lg text-sm',
              p === page
                ? 'bg-primary-600 text-white'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200',
            )}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="h-9 w-9 rounded-lg border border-slate-300 text-sm disabled:opacity-40 dark:border-slate-700"
      >
        ›
      </button>
    </nav>
  );
}
