import clsx from 'clsx';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: number) => void;
}

export function Rating({ value, count, size = 'md', onChange }: RatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';

  const star = (starValue: number) => (
    <svg
      viewBox="0 0 20 20"
      className={clsx(starSize, starValue <= Math.round(value) ? 'fill-accent-500' : 'fill-slate-200 dark:fill-slate-700')}
    >
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.6 1-5.78-4.2-4.1 5.8-.86L10 1.5z" />
    </svg>
  );

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((starValue) =>
          onChange ? (
            <button
              key={starValue}
              type="button"
              aria-label={`${starValue} étoile${starValue > 1 ? 's' : ''}`}
              onClick={() => onChange(starValue)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              {star(starValue)}
            </button>
          ) : (
            <span key={starValue}>{star(starValue)}</span>
          ),
        )}
      </div>
      {typeof count === 'number' && (
        <span className="text-xs text-slate-500 dark:text-slate-400">({count})</span>
      )}
    </div>
  );
}
