import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/Button';
import { contactService } from '@/services/contact.service';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await contactService.send(form);
      toast.success('Votre message a bien été envoyé.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error("Impossible d'envoyer votre message. Réessayez dans un instant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contactez-nous</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Une question, un problème ? Notre équipe vous répond sous 24h.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Nom</label>
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
          <textarea
            required
            minLength={10}
            rows={5}
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <Button type="submit" isLoading={isSubmitting} fullWidth>
          Envoyer
        </Button>
      </form>
    </div>
  );
}
