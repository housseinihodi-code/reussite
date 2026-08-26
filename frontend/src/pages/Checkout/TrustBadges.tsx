const badges = [
  {
    label: 'Connexion chiffrée SSL',
    icon: (
      <path d="M6 10V7a6 6 0 1112 0v3M5 10h14v10H5V10z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: 'Paiement propulsé par Stripe',
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Données jamais stockées',
    icon: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export function TrustBadges() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:grid-cols-3">
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 stroke-current" fill="none" strokeWidth={1.8}>
            {badge.icon}
          </svg>
          {badge.label}
        </div>
      ))}
    </div>
  );
}
