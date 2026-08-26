import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Loader } from '@/components/Loader';
import { formatCurrency } from '@/utils/format';

interface AdminStats {
  totalUsers: number;
  totalVehicles: number;
  totalOrders: number;
  totalRevenue: number;
  pendingReview: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.get<{ data: AdminStats }>('/dashboard/admin').then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <Loader fullScreen />;

  const cards = [
    { label: 'Utilisateurs', value: stats.totalUsers },
    { label: 'Véhicules', value: stats.totalVehicles },
    { label: 'Commandes', value: stats.totalOrders },
    { label: 'Chiffre d\'affaires', value: formatCurrency(stats.totalRevenue) },
    { label: 'En attente de validation', value: stats.pendingReview },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
