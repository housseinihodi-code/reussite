import { Link } from 'react-router-dom';
import { formatCurrency, formatMileage } from '@/utils/format';
import { Rating } from '@/components/Rating';
import type { Vehicle } from '@/types/vehicle.types';

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite?: boolean;
  onToggleFavorite?: (vehicleId: string) => void;
}

export function VehicleCard({ vehicle, isFavorite, onToggleFavorite }: VehicleCardProps) {
  const primaryImage = vehicle.images.find((img) => img.isPrimary) ?? vehicle.images[0];

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-card transition-shadow hover:shadow-card-hover dark:bg-slate-900">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link to={`/vehicles/${vehicle.slug}`}>
          <img
            src={primaryImage?.url ?? '/placeholder-car.svg'}
            alt={vehicle.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        {vehicle.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white">
            En vedette
          </span>
        )}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(vehicle.id)}
            aria-label="Ajouter aux favoris"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white dark:bg-slate-800/90"
          >
            <svg
              viewBox="0 0 24 24"
              className={isFavorite ? 'h-5 w-5 fill-red-500 stroke-red-500' : 'h-5 w-5 fill-none stroke-slate-600 dark:stroke-slate-300'}
              strokeWidth={1.8}
            >
              <path d="M12 21s-6.7-4.35-9.3-8.14C1 10.1 1.6 6.6 4.6 5.1c2.3-1.15 4.6-.2 5.9 1.5.4.5.8 1 1.5 1 .7 0 1.1-.5 1.5-1 1.3-1.7 3.6-2.65 5.9-1.5 3 1.5 3.6 5 1.9 7.76C18.7 16.65 12 21 12 21z" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
          {vehicle.brand.name} · {vehicle.model.name}
        </p>
        <Link to={`/vehicles/${vehicle.slug}`}>
          <h3 className="mt-1 truncate text-base font-semibold text-slate-900 hover:text-primary-600 dark:text-white">
            {vehicle.title}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <span>{vehicle.year}</span>
          <span>·</span>
          <span>{formatMileage(vehicle.mileage, vehicle.mileageUnit)}</span>
          <span>·</span>
          <span>{vehicle.fuelType}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {formatCurrency(vehicle.price, vehicle.currency)}
          </span>
          {vehicle.reviewsCount > 0 && <Rating value={vehicle.averageRating} count={vehicle.reviewsCount} size="sm" />}
        </div>

        <p className="mt-2 text-xs text-slate-400">{vehicle.city}, {vehicle.country}</p>
      </div>
    </div>
  );
}
