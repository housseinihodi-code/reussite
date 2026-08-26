import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { VehicleForm, type VehicleFormValues } from '@/components/VehicleForm';
import { vehicleService } from '@/services/vehicle.service';
import { uploadService } from '@/services/upload.service';

export function CreateVehicle() {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFilesChange = (fileList: FileList | null) => {
    if (!fileList) return;
    setImages(Array.from(fileList));
  };

  const handleSubmit = async (values: VehicleFormValues) => {
    setIsSubmitting(true);
    try {
      const imageUrls = images.length ? await uploadService.uploadImages(images) : [];
      const vehicle = await vehicleService.create({
        title: values.title,
        description: values.description,
        vin: values.vin || undefined,
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
        engineSizeCc: values.engineSizeCc === '' ? undefined : values.engineSizeCc,
        country: values.country,
        city: values.city,
        brandId: values.brandId,
        modelId: values.modelId,
        categoryId: values.categoryId,
        imageUrls,
      });
      toast.success('Véhicule publié.');
      navigate(`/vehicles/${vehicle.slug}`);
    } catch {
      toast.error("Impossible de publier le véhicule. Vérifiez les champs du formulaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Ajouter un véhicule</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        En tant qu'administrateur, le véhicule est publié immédiatement — aucune modération requise.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <VehicleForm onSubmit={handleSubmit} submitLabel="Publier le véhicule" isSubmitting={isSubmitting}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Photos</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              multiple
              onChange={(event) => handleFilesChange(event.target.files)}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 dark:text-slate-300 dark:file:bg-primary-950 dark:file:text-primary-300"
            />
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {images.map((file, index) => (
                  <img
                    key={`${file.name}-${index}`}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </VehicleForm>
      </div>
    </div>
  );
}
