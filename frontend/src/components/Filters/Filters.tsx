import type { VehicleQueryParams, Brand } from '@/types/vehicle.types';

interface FiltersProps {
  brands: Brand[];
  filters: VehicleQueryParams;
  onChange: (filters: VehicleQueryParams) => void;
  onReset: () => void;
}

const fuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'PLUGIN_HYBRID', 'LPG', 'CNG'] as const;
const transmissions = ['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT'] as const;
const conditions = ['NEW', 'USED', 'CERTIFIED_PRE_OWNED', 'SALVAGE'] as const;

export function Filters({ brands, filters, onChange, onReset }: FiltersProps) {
  const update = (patch: Partial<VehicleQueryParams>) => onChange({ ...filters, ...patch, page: 1 });

  return (
    <aside className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Filtres</h3>
        <button onClick={onReset} className="text-xs font-medium text-primary-600 hover:underline">
          Réinitialiser
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">Marque</label>
        <select
          value={filters.brandId ?? ''}
          onChange={(event) => update({ brandId: event.target.value || undefined })}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="">Toutes les marques</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">Prix (€)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(event) => update({ minPrice: event.target.value ? Number(event.target.value) : undefined })}
            className="h-10 w-1/2 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(event) => update({ maxPrice: event.target.value ? Number(event.target.value) : undefined })}
            className="h-10 w-1/2 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">Année</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="De"
            value={filters.minYear ?? ''}
            onChange={(event) => update({ minYear: event.target.value ? Number(event.target.value) : undefined })}
            className="h-10 w-1/2 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <input
            type="number"
            placeholder="À"
            value={filters.maxYear ?? ''}
            onChange={(event) => update({ maxYear: event.target.value ? Number(event.target.value) : undefined })}
            className="h-10 w-1/2 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">Carburant</label>
        <select
          value={filters.fuelType ?? ''}
          onChange={(event) => update({ fuelType: (event.target.value || undefined) as VehicleQueryParams['fuelType'] })}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="">Tous</option>
          {fuelTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">Transmission</label>
        <select
          value={filters.transmission ?? ''}
          onChange={(event) => update({ transmission: (event.target.value || undefined) as VehicleQueryParams['transmission'] })}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="">Toutes</option>
          {transmissions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">État</label>
        <select
          value={filters.condition ?? ''}
          onChange={(event) => update({ condition: (event.target.value || undefined) as VehicleQueryParams['condition'] })}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="">Tous</option>
          {conditions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}
