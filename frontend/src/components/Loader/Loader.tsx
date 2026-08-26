import clsx from 'clsx';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

export function Loader({ fullScreen, size = 'md' }: LoaderProps) {
  const spinner = (
    <span
      className={clsx(
        'inline-block animate-spin rounded-full border-4 border-primary-200 border-t-primary-600',
        sizeMap[size],
      )}
      role="status"
      aria-label="Chargement"
    />
  );

  if (!fullScreen) return spinner;

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      {spinner}
    </div>
  );
}
