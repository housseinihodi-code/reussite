import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { VehicleForm, type VehicleFormValues } from '@/components/VehicleForm';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { vehicleService } from '@/services/vehicle.service';
import { uploadService } from '@/services/upload.service';
import { imageService } from '@/services/image.service';
import type { Vehicle } from '@/types/vehicle.types';

const toFormValues = (vehicle: Vehicle): VehicleFormValues => ({
  title: vehicle.title,
  description: vehicle.description,
  vin: '',
  year: vehicle.year,
  price: vehicle.price,
  currency: vehicle.currency,
  mileage: vehicle.mileage,
  fuelType: vehicle.fuelType,
  transmission: vehicle.transmission,
  condition: vehicle.condition,
  color: vehicle.color ?? '',
  doors: vehicle.doors ?? '',
  seats: vehicle.seats ?? '',
  enginePower: vehicle.enginePower ?? '',
  engineSizeCc: '',
  country: vehicle.country,
  city: vehicle.city,
  brandId: vehicle.brand.id,
  modelId: vehicle.model.id,
  categoryId: vehicle.category.id,
});

export function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    if (!id) return;
    vehicleService
      .findMine()
      .then((vehicles) => setVehicle(vehicles.find((item) => item.id === id) ?? null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Loader fullScreen />;
  if (!vehicle || !id) return <p className="py-16 text-center text-slate-500">Annonce introuvable.</p>;

  const handleSubmit = async (values: VehicleFormValues) => {
    setIsSubmitting(true);
    try {
      await vehicleService.update(id, {
        title: values.title,
        description: values.description,
        year: values.year,
        price: values.price,
        currency: values.currency,
        mileage: values.mileage,
        fuelType: values.fuelType,
        transmission: values.transmission,
        condition: values.condition,
        color: values.color || undefined,
        doors: values.doors === '' ? undefined : values.doors,
        seats: values.seats === '' ? undefined : values.seats,
        enginePower: values.enginePower === '' ? undefined : values.enginePower,
        country: values.country,
        city: values.city,
        brandId: values.brandId,
        modelId: values.modelId,
        categoryId: values.categoryId,
      });
      toast.success('Annonce mise à jour.');
      navigate('/seller', { replace: true });
    } catch {
      toast.error("Impossible de mettre à jour l'annonce.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    await imageService.remove(imageId);
    setVehicle((prev) => (prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : prev));
  };

  const handleSetPrimary = async (imageId: string) => {
    await imageService.setPrimary(imageId);
    setVehicle((prev) =>
      prev ? { ...prev, images: prev.images.map((img) => ({ ...img, isPrimary: img.id === imageId })) } : prev,
    );
  };

  const handleAddImages = async () => {
    if (!newFiles.length) return;
    setIsUploadingImages(true);
    try {
      const urls = await uploadService.uploadImages(newFiles);
      const added = await Promise.all(urls.map((url) => imageService.add(id, url)));
      setVehicle((prev) => (prev ? { ...prev, images: [...prev.images, ...added] } : prev));
      setNewFiles([]);
      toast.success('Photos ajoutées.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Modifier l'annonce</h1>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Photos</h2>
        {vehicle.images.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {vehicle.images.map((image) => (
              <div key={image.id} className="group relative">
                <img
                  src={image.url}
                  alt={vehicle.title}
                  className={`aspect-square w-full rounded-lg object-cover ${image.isPrimary ? 'ring-2 ring-primary-600' : ''}`}
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(image.id)}
                      className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-900"
                    >
                      Principale
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image.id)}
                    className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-red-600"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            multiple
            onChange={(event) => setNewFiles(event.target.files ? Array.from(event.target.files) : [])}
            className="block text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 dark:text-slate-300 dark:file:bg-primary-950 dark:file:text-primary-300"
          />
          <Button type="button" size="sm" variant="outline" onClick={handleAddImages} isLoading={isUploadingImages} disabled={!newFiles.length}>
            Ajouter les photos
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <VehicleForm
          initialValues={toFormValues(vehicle)}
          onSubmit={handleSubmit}
          submitLabel="Enregistrer les modifications"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
