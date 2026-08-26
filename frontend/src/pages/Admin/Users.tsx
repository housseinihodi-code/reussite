import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/services/api';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import type { User } from '@/types/user.types';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ data: User[] }>('/users')
      .then((res) => setUsers(res.data.data))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePromoteToSeller = async (userId: string) => {
    setPromotingId(userId);
    try {
      const { data } = await api.patch<{ data: User }>(`/admin/users/${userId}/role`, { role: 'SELLER' });
      setUsers((prev) => prev.map((user) => (user.id === userId ? data.data : user)));
      toast.success('Utilisateur promu vendeur.');
    } finally {
      setPromotingId(null);
    }
  };

  if (isLoading) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Utilisateurs</h1>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Pays</th>
              <th className="px-4 py-3">Rôles</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSeller = user.roles.some((role) => ['SELLER', 'ADMIN', 'SUPER_ADMIN'].includes(role.name));
              return (
                <tr key={user.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.country ?? '—'}</td>
                  <td className="px-4 py-3">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="mr-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                      >
                        {role.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isSeller && (
                      <Button
                        size="sm"
                        variant="outline"
                        isLoading={promotingId === user.id}
                        onClick={() => handlePromoteToSeller(user.id)}
                      >
                        Promouvoir vendeur
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
