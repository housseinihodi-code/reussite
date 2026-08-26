import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader } from '@/components/Loader';
import { orderService } from '@/services/order.service';
import { formatCurrency, formatDate } from '@/utils/format';
import type { Order, OrderStatus } from '@/types/order.types';

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  PAID: 'Payée',
  PROCESSING: 'En traitement',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
};

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  PAID: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  PROCESSING: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  SHIPPED: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  REFUNDED: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
};

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    orderService
      .findOne(id)
      .then(setOrder)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Loader fullScreen />;
  if (!order) return <p className="py-16 text-center text-slate-500">Commande introuvable.</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/orders" className="mb-4 inline-block text-sm font-medium text-primary-600 hover:underline">
        ← Mes commandes
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Commande #{order.orderNumber}</h1>
          <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="mb-6 space-y-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <img
              src={item.vehicle?.images?.[0]?.url ?? '/placeholder-car.svg'}
              alt={item.vehicle?.title ?? 'Véhicule'}
              className="h-20 w-28 rounded-lg object-cover"
            />
            <div className="flex-1">
              <Link
                to={item.vehicle?.slug ? `/vehicles/${item.vehicle.slug}` : '#'}
                className="font-semibold text-slate-900 hover:text-primary-600 dark:text-white"
              >
                {item.vehicle?.title ?? 'Véhicule'}
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400">Quantité : {item.quantity}</p>
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.totalPrice, order.currency)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Sous-total</span>
            <span>{formatCurrency(order.subtotal, order.currency)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>TVA</span>
            <span>{formatCurrency(order.taxAmount, order.currency)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount, order.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
