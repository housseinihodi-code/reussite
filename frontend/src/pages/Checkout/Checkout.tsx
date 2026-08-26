import { useEffect, useRef, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import { clearCart } from '@/redux/slices/cartSlice';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { CheckoutForm } from './CheckoutForm';
import { OrderSummary } from './OrderSummary';
import { TrustBadges } from './TrustBadges';
import type { Order } from '@/types/order.types';
import type { Vehicle } from '@/types/vehicle.types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

export function Checkout() {
  const items = useAppSelector((state) => state.cart.items);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [orderVehicles, setOrderVehicles] = useState<Vehicle[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const hasStartedCheckout = useRef(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    // Guards against React 18 StrictMode's dev-time double-invocation of
    // effects (and any accidental remount) placing the order twice.
    if (hasStartedCheckout.current) return;
    hasStartedCheckout.current = true;

    const cartSnapshot = items;

    const initCheckout = async () => {
      try {
        const createdOrder = await orderService.create({ items: cartSnapshot.map((item) => ({ vehicleId: item.id })) });
        const intent = await paymentService.createIntent(createdOrder.id);
        setOrder(createdOrder);
        setOrderVehicles(cartSnapshot);
        dispatch(clearCart());

        if (!intent.clientSecret) {
          // No payment provider configured: the order was confirmed and paid immediately.
          setIsConfirmed(true);
        } else {
          setClientSecret(intent.clientSecret);
        }
      } catch {
        toast.error('Impossible de préparer la commande.');
        navigate('/cart');
      } finally {
        setIsLoading(false);
      }
    };

    initCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader fullScreen />;
  if (!order) return null;

  if (isConfirmed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
            <svg viewBox="0 0 24 24" className="h-8 w-8 stroke-emerald-600 dark:stroke-emerald-400" fill="none" strokeWidth={2}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Commande confirmée !</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Un e-mail de confirmation a été envoyé à {user?.email}.
          </p>
        </div>

        <div className="mt-8">
          <OrderSummary order={order} vehicles={orderVehicles} />
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link to={`/orders/${order.id}`}>
            <Button>Voir la commande</Button>
          </Link>
          <Link to="/vehicles">
            <Button variant="outline">Continuer mes achats</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3 text-sm font-medium text-slate-400">
        <Link to="/cart" className="hover:text-primary-600">Panier</Link>
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 stroke-current" fill="none" strokeWidth={2}>
          <path d="M7.5 4l5 6-5 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-slate-900 dark:text-white">Paiement</span>
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 stroke-current" fill="none" strokeWidth={2}>
          <path d="M7.5 4l5 6-5 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Confirmation</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950">
                <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-primary-600 dark:stroke-primary-400" fill="none" strokeWidth={2}>
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 018 0v3" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Paiement sécurisé</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Vos informations sont chiffrées de bout en bout.</p>
              </div>
            </div>

            {user && (
              <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Titulaire</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">E-mail</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</p>
                </div>
              </div>
            )}

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#dc2626' } } }}>
                <CheckoutForm orderId={order.id} />
              </Elements>
            )}

            <TrustBadges />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-20">
            <OrderSummary order={order} vehicles={orderVehicles} />
          </div>
        </div>
      </div>
    </div>
  );
}
