import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Fast Deals Auto',
    links: [
      { label: 'À propos', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Acheter',
    links: [
      { label: 'Tous les véhicules', to: '/vehicles' },
      { label: 'Favoris', to: '/favorites' },
    ],
  },
  {
    title: 'Compte',
    links: [
      { label: 'Connexion', to: '/login' },
      { label: 'Inscription', to: '/register' },
      { label: 'Mes commandes', to: '/orders' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-flex items-center">
            <img src="/logo.svg" alt="Fast Deals Auto" className="h-12 w-auto rounded-md bg-white p-1" />
          </Link>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            La marketplace de véhicules d'occasion qui va vite. Achetez et vendez en toute confiance, au meilleur prix.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{column.title}</h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} Fast Deals Auto. Tous droits réservés.
      </div>
    </footer>
  );
}
