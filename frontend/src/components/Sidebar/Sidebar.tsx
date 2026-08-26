import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export interface SidebarLink {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  title: string;
  links: SidebarLink[];
}

export function Sidebar({ title, links }: SidebarProps) {
  return (
    <aside className="w-full shrink-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:w-64">
      <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h2>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800',
              )
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
