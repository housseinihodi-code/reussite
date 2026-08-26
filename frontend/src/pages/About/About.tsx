export function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">À propos de Fast Deals Auto</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        Fast Deals Auto est une marketplace de véhicules d'occasion qui va vite. Notre mission est de connecter
        acheteurs et vendeurs grâce à une plateforme sécurisée, transparente et simple d'utilisation — pour
        trouver les meilleures affaires, rapidement.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { value: '40+', label: 'Pays couverts' },
          { value: '120k+', label: 'Véhicules vendus' },
          { value: '98%', label: 'Clients satisfaits' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-6 text-center shadow-card dark:bg-slate-900">
            <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
