import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { Button } from '@/components/Button';

const navLinks = [
  { label: 'Véhicules', to: '/vehicles' },
  { label: 'À propos', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const cartCount = useAppSelector((state) => state.cart.items.length);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4">
        <Link to="/" className="flex shrink-0 items-center">
          <img src="/logo.svg" alt="Fast Deals Auto" className="h-12 w-auto rounded-md bg-white p-1 shadow-sm" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/favorites" aria-label="Favoris" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-slate-600 dark:stroke-slate-300" strokeWidth={1.8}>
              <path d="M12 21s-6.7-4.35-9.3-8.14C1 10.1 1.6 6.6 4.6 5.1c2.3-1.15 4.6-.2 5.9 1.5.4.5.8 1 1.5 1 .7 0 1.1-.5 1.5-1 1.3-1.7 3.6-2.65 5.9-1.5 3 1.5 3.6 5 1.9 7.76C18.7 16.65 12 21 12 21z" />
            </svg>
          </Link>

          <Link to="/cart" aria-label="Panier" className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-slate-600 dark:stroke-slate-300" strokeWidth={1.8}>
              <path d="M3 3h2l2.4 12.2a2 2 0 002 1.8h7.2a2 2 0 002-1.6L20 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/seller"
                className="hidden text-sm font-medium text-slate-700 hover:text-primary-600 dark:text-slate-200 sm:inline"
              >
                Vendre un véhicule
              </Link>
              <Link to="/profile" className="text-sm font-medium text-slate-700 hover:text-primary-600 dark:text-slate-200">
                {user.firstName}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-primary-600 dark:text-slate-200">
                Connexion
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary-600 px-3 text-sm font-medium text-white hover:bg-primary-700"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
