import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { removeFromCart } from '@/redux/slices/cartSlice';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/utils/format';

export function Cart() {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = Math.round(subtotal * 0.2 * 100) / 100;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Votre panier est vide</h1>
        <Link to="/vehicles" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline">
          Parcourir les véhicules
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Panier</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <img
                src={vehicle.images[0]?.url ?? '/placeholder-car.svg'}
                alt={vehicle.title}
                className="h-20 w-28 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{vehicle.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{vehicle.year} · {vehicle.city}</p>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(vehicle.price, vehicle.currency)}</p>
              <button
                onClick={() => dispatch(removeFromCart(vehicle.id))}
                aria-label="Retirer"
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" strokeWidth={2} fill="none">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Récapitulatif</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Sous-total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>TVA (20%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Button fullWidth className="mt-5" onClick={() => navigate('/checkout')}>
            Passer au paiement
          </Button>
        </div>
      </div>
    </div>
  );
}
