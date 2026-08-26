import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService.findMine().then(setOrders).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Mes commandes</h1>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-slate-500 dark:text-slate-400">Vous n'avez pas encore passé de commande.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-primary-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">#{order.orderNumber}</p>
                  <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount, order.currency)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
