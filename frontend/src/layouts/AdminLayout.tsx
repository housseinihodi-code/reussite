import { Link, Outlet } from 'react-router-dom';
import { Sidebar, type SidebarLink } from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';

const adminLinks: SidebarLink[] = [
  { label: 'Tableau de bord', to: '/admin' },
  { label: 'Ajouter un véhicule', to: '/admin/vehicles/new' },
  { label: 'Véhicules en attente', to: '/admin/vehicles/pending' },
  { label: 'Utilisateurs', to: '/admin/users' },
  { label: 'Commandes', to: '/admin/orders' },
];

export function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Fast Deals Auto" className="h-9 w-auto rounded bg-white p-0.5" />
            <span className="text-sm font-normal text-slate-400">— Administration</span>
          </Link>
          <span className="text-sm text-slate-500 dark:text-slate-400">{user?.firstName} {user?.lastName}</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        <Sidebar title="Administration" links={adminLinks} />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
