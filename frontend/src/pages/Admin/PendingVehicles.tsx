import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/services/api';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { formatCurrency } from '@/utils/format';
import type { Vehicle } from '@/types/vehicle.types';

export function PendingVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    api
      .get<{ data: Vehicle[] }>('/admin/vehicles/pending')
      .then((res) => setVehicles(res.data.data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDecision = async (id: string, action: 'approve' | 'reject') => {
    await api.patch(`/admin/vehicles/${id}/${action}`);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    toast.success(action === 'approve' ? 'Annonce approuvée.' : 'Annonce rejetée.');
  };

  if (isLoading) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Véhicules en attente</h1>

      {vehicles.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Aucune annonce en attente de validation.</p>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-4">
                <img
                  src={vehicle.images[0]?.url ?? '/placeholder-car.svg'}
                  alt={vehicle.title}
                  className="h-16 w-24 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{vehicle.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatCurrency(vehicle.price, vehicle.currency)} · {vehicle.city}, {vehicle.country}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleDecision(vehicle.id, 'approve')}>
                  Approuver
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDecision(vehicle.id, 'reject')}>
                  Rejeter
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
