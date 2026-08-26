import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { vehicleService } from '@/services/vehicle.service';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { formatCurrency } from '@/utils/format';
import type { Vehicle, VehicleStatus } from '@/types/vehicle.types';

interface SellerStats {
  totalListings: number;
  publishedListings: number;
  soldListings: number;
  totalViews: number;
  averageRating: number;
}

const statusLabels: Record<VehicleStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Brouillon', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  PENDING_REVIEW: { label: 'En attente', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  PUBLISHED: { label: 'Publiée', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  SOLD: { label: 'Vendue', className: 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300' },
  ARCHIVED: { label: 'Archivée', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  REJECTED: { label: 'Rejetée', className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' },
};

export function SellerDashboard() {
  const { user, becomeSeller } = useAuth();
  const isSeller = user?.roles.some((role) => ['SELLER', 'ADMIN', 'SUPER_ADMIN'].includes(role.name)) ?? false;

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSeller) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    Promise.all([api.get<{ data: SellerStats }>('/dashboard/seller'), vehicleService.findMine()])
      .then(([statsRes, myVehicles]) => {
        setStats(statsRes.data.data);
        setVehicles(myVehicles);
      })
      .finally(() => setIsLoading(false));
  }, [isSeller]);

  const handleBecomeSeller = async () => {
    setIsUpgrading(true);
    try {
      await becomeSeller();
      toast.success('Vous êtes maintenant vendeur !');
    } catch {
      toast.error("Impossible d'activer le compte vendeur.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    await vehicleService.remove(id);
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
    toast.success('Annonce supprimée.');
  };

  if (!isSeller) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Devenez vendeur sur Fast Deals Auto</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Activez votre compte vendeur pour publier vos annonces de véhicules, suivre leurs statistiques et gérer
          vos ventes.
        </p>
        <Button className="mt-6" onClick={handleBecomeSeller} isLoading={isUpgrading}>
          Devenir vendeur
        </Button>
      </div>
    );
  }

  if (isLoading) return <Loader fullScreen />;

  const cards = stats
    ? [
        { label: 'Annonces', value: stats.totalListings },
        { label: 'Publiées', value: stats.publishedListings },
        { label: 'Vendues', value: stats.soldListings },
        { label: 'Vues cumulées', value: stats.totalViews },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Espace vendeur</h1>
        <Link to="/seller/vehicles/new">
          <Button>Nouvelle annonce</Button>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Mes annonces</h2>

      {vehicles.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Vous n'avez pas encore publié d'annonce. Cliquez sur « Nouvelle annonce » pour commencer.
        </p>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => {
            const status = statusLabels[vehicle.status];
            return (
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
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white">{vehicle.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatCurrency(vehicle.price, vehicle.currency)} · {vehicle.city}, {vehicle.country}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/seller/vehicles/${vehicle.id}/edit`}>
                    <Button size="sm" variant="outline">Modifier</Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(vehicle.id)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
