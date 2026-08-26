import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Gallery } from '@/components/Gallery';
import { ReviewForm } from './ReviewForm';
import { Rating } from '@/components/Rating';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { vehicleService } from '@/services/vehicle.service';
import { favoriteService } from '@/services/favorite.service';
import { reviewService } from '@/services/review.service';
import { formatCurrency, formatDate, formatMileage } from '@/utils/format';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/redux/slices/cartSlice';
import type { Vehicle } from '@/types/vehicle.types';
import type { Review } from '@/types/order.types';

export function VehicleDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    vehicleService
      .findBySlug(slug)
      .then((data) => {
        setVehicle(data);
        return reviewService.findByVehicle(data.id);
      })
      .then(setReviews)
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!vehicle) return;
    dispatch(addToCart(vehicle));
    toast.success('Véhicule ajouté au panier.');
  };

  const handleAddToFavorites = async () => {
    if (!vehicle || !user) {
      toast.info('Connectez-vous pour ajouter aux favoris.');
      return;
    }
    await favoriteService.add(vehicle.id);
    toast.success('Ajouté aux favoris.');
  };

  if (isLoading) return <Loader fullScreen />;
  if (!vehicle) return <p className="py-16 text-center text-slate-500">Véhicule introuvable.</p>;

  const hasReviewed = Boolean(user && reviews.some((review) => review.author.id === user.id));

  const specs = [
    { label: 'Année', value: vehicle.year },
    { label: 'Kilométrage', value: formatMileage(vehicle.mileage, vehicle.mileageUnit) },
    { label: 'Carburant', value: vehicle.fuelType },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'État', value: vehicle.condition },
    { label: 'Couleur', value: vehicle.color ?? '—' },
    { label: 'Portes', value: vehicle.doors ?? '—' },
    { label: 'Places', value: vehicle.seats ?? '—' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Gallery images={vehicle.images} alt={vehicle.title} />

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {vehicle.description}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Caractéristiques</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {specs.map((spec) => (
                <div key={spec.label} className="rounded-lg bg-white p-3 shadow-card dark:bg-slate-900">
                  <dt className="text-xs text-slate-400">{spec.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Avis ({reviews.length})
            </h2>

            {user && user.id !== vehicle.sellerId && (
              hasReviewed ? (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Vous avez déjà laissé un avis sur ce véhicule.</p>
              ) : (
                <div className="mt-3">
                  <ReviewForm vehicleId={vehicle.id} onSubmitted={(review) => setReviews((prev) => [review, ...prev])} />
                </div>
              )
            )}

            <div className="mt-4 space-y-4">
              {reviews.length === 0 && <p className="text-sm text-slate-500">Aucun avis pour le moment.</p>}
              {reviews.map((review) => (
                <div key={review.id} className="rounded-lg bg-white p-4 shadow-card dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {review.author.firstName} {review.author.lastName}
                    </span>
                    <Rating value={review.rating} size="sm" />
                  </div>
                  {review.comment && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>}
                  <p className="mt-1 text-xs text-slate-400">{formatDate(review.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-20">
          <p className="text-sm font-medium uppercase text-primary-600">{vehicle.brand.name} · {vehicle.model.name}</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{vehicle.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Rating value={vehicle.averageRating} count={vehicle.reviewsCount} />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(vehicle.price, vehicle.currency)}
          </p>
          <p className="mt-1 text-sm text-slate-400">{vehicle.city}, {vehicle.country}</p>

          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={handleAddToCart} fullWidth>Ajouter au panier</Button>
            <Button onClick={handleAddToFavorites} variant="outline" fullWidth>
              Ajouter aux favoris
            </Button>
            {user?.id === vehicle.sellerId && (
              <Link to={`/seller/vehicles/${vehicle.id}/edit`}>
                <Button variant="secondary" fullWidth>Modifier l'annonce</Button>
              </Link>
            )}
          </div>

          {vehicle.seller && (
            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-xs text-slate-400">Vendu par</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {vehicle.seller.firstName} {vehicle.seller.lastName}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
