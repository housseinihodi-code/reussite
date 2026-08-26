import { formatCurrency } from '@/utils/format';
import type { Order } from '@/types/order.types';
import type { Vehicle } from '@/types/vehicle.types';

interface OrderSummaryProps {
  order: Order;
  vehicles: Vehicle[];
}

export function OrderSummary({ order, vehicles }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Récapitulatif</h2>
          <span className="text-xs text-slate-400">#{order.orderNumber}</span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center gap-3">
            <img
              src={vehicle.images[0]?.url ?? '/placeholder-car.svg'}
              alt={vehicle.title}
              className="h-14 w-20 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{vehicle.title}</p>
              <p className="text-xs text-slate-400">{vehicle.year} · {vehicle.city}, {vehicle.country}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-slate-900 dark:text-white">
              {formatCurrency(vehicle.price, vehicle.currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-slate-100 p-5 text-sm dark:border-slate-800">
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Sous-total</span>
          <span>{formatCurrency(order.subtotal, order.currency)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>TVA</span>
          <span>{formatCurrency(order.taxAmount, order.currency)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900 dark:border-slate-800 dark:text-white">
          <span>Total</span>
          <span>{formatCurrency(order.totalAmount, order.currency)}</span>
        </div>
      </div>
    </div>
  );
}
