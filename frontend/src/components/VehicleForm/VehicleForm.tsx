import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/Button';
import { categoryService } from '@/services/category.service';
import type { Brand, Category, FuelType, TransmissionType, VehicleCondition, VehicleModel } from '@/types/vehicle.types';

const fuelTypes: FuelType[] = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'PLUGIN_HYBRID', 'LPG', 'CNG'];
const transmissions: TransmissionType[] = ['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT'];
const conditions: VehicleCondition[] = ['NEW', 'USED', 'CERTIFIED_PRE_OWNED', 'SALVAGE'];
const currencies = ['EUR', 'USD', 'GBP', 'CHF'];

export interface VehicleFormValues {
  title: string;
  description: string;
  vin: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  condition: VehicleCondition;
  color: string;
  doors: number | '';
  seats: number | '';
  enginePower: number | '';
  engineSizeCc: number | '';
  country: string;
  city: string;
  brandId: string;
  modelId: string;
  categoryId: string;
}

export const defaultVehicleFormValues: VehicleFormValues = {
  title: '',
  description: '',
  vin: '',
  year: new Date().getFullYear(),
  price: 0,
  currency: 'EUR',
  mileage: 0,
  fuelType: 'PETROL',
  transmission: 'MANUAL',
  condition: 'USED',
  color: '',
  doors: '',
  seats: '',
  enginePower: '',
  engineSizeCc: '',
  country: '',
  city: '',
  brandId: '',
  modelId: '',
  categoryId: '',
};

interface VehicleFormProps {
  initialValues?: Partial<VehicleFormValues>;
  onSubmit: (values: VehicleFormValues) => void | Promise<void>;
  submitLabel: string;
  isSubmitting?: boolean;
  children?: ReactNode;
}

const inputClass =
  'h-11 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-800';
const labelClass = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

export function VehicleForm({ initialValues, onSubmit, submitLabel, isSubmitting, children }: VehicleFormProps) {
  const [values, setValues] = useState<VehicleFormValues>({ ...defaultVehicleFormValues, ...initialValues });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryService.findAllBrands().then(setBrands);
    categoryService.findAllCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!values.brandId) {
      setModels([]);
      return;
    }
    categoryService.findModelsByBrand(values.brandId).then(setModels);
  }, [values.brandId]);

  const update = <K extends keyof VehicleFormValues>(key: K, value: VehicleFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>Titre de l'annonce</label>
        <input
          required
          minLength={5}
          value={values.title}
          onChange={(event) => update('title', event.target.value)}
          placeholder="Ex : BMW Série 3 320d 2019, très bon état"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          required
          minLength={20}
          rows={5}
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Marque</label>
          <select
            required
            value={values.brandId}
            onChange={(event) => {
              update('brandId', event.target.value);
              update('modelId', '');
            }}
            className={inputClass}
          >
            <option value="">Sélectionner</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Modèle</label>
          <select
            required
            disabled={!values.brandId}
            value={values.modelId}
            onChange={(event) => update('modelId', event.target.value)}
            className={inputClass}
          >
            <option value="">Sélectionner</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Catégorie</label>
          <select
            required
            value={values.categoryId}
            onChange={(event) => update('categoryId', event.target.value)}
            className={inputClass}
          >
            <option value="">Sélectionner</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className={labelClass}>Année</label>
          <input
            required
            type="number"
            min={1900}
            max={new Date().getFullYear() + 1}
            value={values.year}
            onChange={(event) => update('year', Number(event.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Prix</label>
          <input
            required
            type="number"
            min={0}
            max={10000}
            value={values.price}
            onChange={(event) => update('price', Math.min(10000, Number(event.target.value)))}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-400">10 000 € maximum</p>
        </div>
        <div>
          <label className={labelClass}>Devise</label>
          <select value={values.currency} onChange={(event) => update('currency', event.target.value)} className={inputClass}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Kilométrage</label>
          <input
            required
            type="number"
            min={0}
            value={values.mileage}
            onChange={(event) => update('mileage', Number(event.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Carburant</label>
          <select value={values.fuelType} onChange={(event) => update('fuelType', event.target.value as FuelType)} className={inputClass}>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Transmission</label>
          <select
            value={values.transmission}
            onChange={(event) => update('transmission', event.target.value as TransmissionType)}
            className={inputClass}
          >
            {transmissions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>État</label>
          <select
            value={values.condition}
            onChange={(event) => update('condition', event.target.value as VehicleCondition)}
            className={inputClass}
          >
            {conditions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className={labelClass}>Couleur</label>
          <input value={values.color} onChange={(event) => update('color', event.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Portes</label>
          <input
            type="number"
            min={0}
            value={values.doors}
            onChange={(event) => update('doors', event.target.value ? Number(event.target.value) : '')}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Places</label>
          <input
            type="number"
            min={0}
            value={values.seats}
            onChange={(event) => update('seats', event.target.value ? Number(event.target.value) : '')}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Puissance (ch)</label>
          <input
            type="number"
            min={0}
            value={values.enginePower}
            onChange={(event) => update('enginePower', event.target.value ? Number(event.target.value) : '')}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Cylindrée (cm³)</label>
          <input
            type="number"
            min={0}
            value={values.engineSizeCc}
            onChange={(event) => update('engineSizeCc', event.target.value ? Number(event.target.value) : '')}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Pays</label>
          <input required value={values.country} onChange={(event) => update('country', event.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Ville</label>
          <input required value={values.city} onChange={(event) => update('city', event.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Numéro VIN (optionnel)</label>
        <input value={values.vin} onChange={(event) => update('vin', event.target.value)} className={inputClass} />
      </div>

      {children}

      <Button type="submit" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
