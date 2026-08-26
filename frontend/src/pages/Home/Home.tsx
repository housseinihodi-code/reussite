import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { VehicleCard } from '@/components/VehicleCard';
import { Loader } from '@/components/Loader';
import { vehicleService } from '@/services/vehicle.service';
import { categoryService } from '@/services/category.service';
import type { Vehicle, Brand } from '@/types/vehicle.types';

export function Home() {
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [vehiclesPage, brandList] = await Promise.all([
          vehicleService.findAll({ limit: 8, sortBy: 'viewsCount' }),
          categoryService.findAllBrands(),
        ]);
        setFeatured(vehiclesPage.data);
        setBrands(brandList.slice(0, 10));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold sm:text-5xl">
            Trouvez le véhicule d'occasion parfait, au meilleur prix
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Des milliers d'annonces vérifiées, un paiement sécurisé et des bonnes affaires tous les jours.
            Fast Deals Auto connecte acheteurs et vendeurs de confiance.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/vehicles?brandId=${brand.id}`}
                className="text-sm font-medium text-slate-500 hover:text-primary-600 dark:text-slate-400"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Annonces populaires</h2>
          <Link to="/vehicles" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
            Voir tout
            <svg viewBox="0 0 20 20" className="h-4 w-4 stroke-current" strokeWidth={2} fill="none">
              <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <Loader fullScreen />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          {[
            { title: 'Annonces vérifiées', desc: 'Chaque véhicule est contrôlé par notre équipe avant publication.' },
            { title: 'Paiement sécurisé', desc: 'Transactions protégées via Stripe, PayPal ou virement bancaire.' },
            { title: 'Portée internationale', desc: 'Achetez et vendez dans plus de 40 pays partenaires.' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
