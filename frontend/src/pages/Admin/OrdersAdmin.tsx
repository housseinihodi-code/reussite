import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/services/api';
import { orderService } from '@/services/order.service';
import { formatCurrency, formatDate } from '@/utils/format';
import type { Order, OrderStatus } from '@/types/order.types';

const statuses: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

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

export function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ data: Order[] }>('/orders/all')
      .then((res) => setOrders(res.data.data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      const updated = await orderService.updateStatus(id, status);
      setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
      toast.success('Statut mis à jour.');
    } catch {
      toast.error('Impossible de mettre à jour le statut.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) return <p className="text-sm text-slate-500 dark:text-slate-400">Chargement…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Commandes</h1>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">N° commande</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Montant</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">#{order.orderNumber}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(event) => handleStatusChange(order.id, event.target.value as OrderStatus)}
                    className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{statusLabels[status]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  {formatCurrency(order.totalAmount, order.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
