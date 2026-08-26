import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VehicleCard } from '@/components/VehicleCard';
import { Filters } from '@/components/Filters';
import { Pagination } from '@/components/Pagination';
import { Loader } from '@/components/Loader';
import { vehicleService } from '@/services/vehicle.service';
import { categoryService } from '@/services/category.service';
import { useDebounce } from '@/hooks/useDebounce';
import type { Brand, Vehicle, VehicleQueryParams } from '@/types/vehicle.types';
import type { PaginationMeta } from '@/types/api.types';

export function Vehicles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filters: VehicleQueryParams = {
    q: searchParams.get('q') ?? undefined,
    brandId: searchParams.get('brandId') ?? undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minYear: searchParams.get('minYear') ? Number(searchParams.get('minYear')) : undefined,
    maxYear: searchParams.get('maxYear') ? Number(searchParams.get('maxYear')) : undefined,
    fuelType: (searchParams.get('fuelType') as VehicleQueryParams['fuelType']) ?? undefined,
    transmission: (searchParams.get('transmission') as VehicleQueryParams['transmission']) ?? undefined,
    condition: (searchParams.get('condition') as VehicleQueryParams['condition']) ?? undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  };

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    categoryService.findAllBrands().then(setBrands);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    vehicleService
      .findAll(debouncedFilters)
      .then((result) => {
        setVehicles(result.data);
        setMeta(result.meta);
      })
      .finally(() => setIsLoading(false));
  }, [JSON.stringify(debouncedFilters)]);

  const updateFilters = (next: VehicleQueryParams) => {
    const params: Record<string, string> = {};
    Object.entries(next).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params[key] = String(value);
    });
    setSearchParams(params);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
        {filters.q ? `Résultats pour « ${filters.q} »` : 'Tous les véhicules'}
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-72 lg:shrink-0">
          <Filters
            brands={brands}
            filters={filters}
            onChange={updateFilters}
            onReset={() => setSearchParams({})}
          />
        </div>

        <div className="flex-1">
          {isLoading ? (
            <Loader fullScreen />
          ) : vehicles.length === 0 ? (
            <p className="py-16 text-center text-slate-500 dark:text-slate-400">
              Aucun véhicule ne correspond à votre recherche.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
              {meta && (
                <div className="mt-8">
                  <Pagination
                    page={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={(page) => updateFilters({ ...filters, page })}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
