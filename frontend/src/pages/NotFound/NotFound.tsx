import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Page introuvable</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button className="mt-6" onClick={() => navigate('/')}>
        Retour à l'accueil
      </Button>
    </div>
  );
}
