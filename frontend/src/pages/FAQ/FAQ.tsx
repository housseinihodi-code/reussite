import { useState } from 'react';
import clsx from 'clsx';

const faqs = [
  {
    question: 'Comment puis-je vendre mon véhicule sur Fast Deals Auto ?',
    answer: "Créez un compte vendeur, publiez votre annonce avec photos et détails, puis notre équipe la valide sous 24h avant publication.",
  },
  {
    question: 'Les paiements sont-ils sécurisés ?',
    answer: 'Oui, tous les paiements transitent par Stripe ou PayPal avec chiffrement de bout en bout.',
  },
  {
    question: 'Puis-je acheter un véhicule à l’étranger ?',
    answer: 'Fast Deals Auto couvre plus de 40 pays et facilite les formalités de transport international.',
  },
  {
    question: 'Que faire si le véhicule ne correspond pas à l’annonce ?',
    answer: 'Contactez notre support sous 48h après réception, notre politique de garantie acheteur s’applique.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Questions fréquentes</h1>
      <div className="mt-8 space-y-3">
        {faqs.map((faq, index) => (
          <div key={faq.question} className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white"
            >
              {faq.question}
              <svg
                viewBox="0 0 20 20"
                className={clsx('h-4 w-4 shrink-0 stroke-current transition-transform', openIndex === index && 'rotate-180')}
                strokeWidth={2}
                fill="none"
              >
                <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openIndex === index && (
              <p className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
