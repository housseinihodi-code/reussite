import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/Button';
import { Rating } from '@/components/Rating';
import { reviewService } from '@/services/review.service';
import type { Review } from '@/types/order.types';

interface ReviewFormProps {
  vehicleId: string;
  onSubmitted: (review: Review) => void;
}

export function ReviewForm({ vehicleId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (rating === 0) {
      toast.info('Sélectionnez une note avant d’envoyer votre avis.');
      return;
    }

    setIsSubmitting(true);
    try {
      const review = await reviewService.create(vehicleId, rating, comment.trim() || undefined);
      onSubmitted(review);
      setRating(0);
      setComment('');
      toast.success('Merci pour votre avis !');
    } catch {
      toast.error("Impossible d'envoyer votre avis pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Laisser un avis</p>
      <Rating value={rating} onChange={setRating} size="lg" />
      <textarea
        rows={3}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Partagez votre expérience avec ce véhicule (optionnel)"
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <Button type="submit" size="sm" className="mt-3" isLoading={isSubmitting}>
        Envoyer mon avis
      </Button>
    </form>
  );
}
