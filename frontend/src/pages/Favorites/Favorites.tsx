import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { VehicleCard } from '@/components/VehicleCard';
import { Loader } from '@/components/Loader';
import { favoriteService, type Favorite } from '@/services/favorite.service';

export function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    favoriteService.findAll().then(setFavorites).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (vehicleId: string) => {
    await favoriteService.remove(vehicleId);
    setFavorites((prev) => prev.filter((f) => f.vehicleId !== vehicleId));
    toast.info('Retiré des favoris.');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Mes favoris</h1>

      {isLoading ? (
        <Loader fullScreen />
      ) : favorites.length === 0 ? (
        <p className="py-16 text-center text-slate-500 dark:text-slate-400">
          Vous n'avez pas encore de véhicule favori.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {favorites.map((favorite) => (
            <VehicleCard
              key={favorite.id}
              vehicle={favorite.vehicle}
              isFavorite
              onToggleFavorite={() => handleRemove(favorite.vehicleId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
