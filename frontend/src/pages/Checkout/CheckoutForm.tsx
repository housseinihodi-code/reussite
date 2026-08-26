import { useState, type FormEvent } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/Button';

interface CheckoutFormProps {
  orderId: string;
}

export function CheckoutForm({ orderId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setFormError(null);
    setIsSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/orders/${orderId}` },
    });

    if (error) {
      const message = error.message ?? 'Le paiement a échoué.';
      setFormError(message);
      toast.error(message);
      setIsSubmitting(false);
      return;
    }

    navigate(`/orders`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Informations de paiement
        </label>
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <PaymentElement />
        </div>
      </div>

      {formError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {formError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} fullWidth disabled={!stripe || !elements} size="lg">
        <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth={2}>
          <rect x="5" y="10" width="14" height="9" rx="2" />
          <path d="M8 10V7a4 4 0 018 0v3" strokeLinecap="round" />
        </svg>
        Payer maintenant
      </Button>
    </form>
  );
}
