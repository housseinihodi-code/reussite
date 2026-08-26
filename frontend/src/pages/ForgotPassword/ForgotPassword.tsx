import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { authService } from '@/services/auth.service';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <div className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Indiquez votre email, nous vous enverrons un lien de réinitialisation.
        </p>

        {sent ? (
          <p className="mt-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-700 dark:bg-primary-950 dark:text-primary-300">
            Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <Button type="submit" isLoading={isSubmitting} fullWidth>
              Envoyer le lien
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
