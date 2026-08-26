import { PrismaClient, RoleName, FuelType, TransmissionType, VehicleCondition, VehicleStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Berline', slug: 'berline', description: 'Élégance et confort pour un usage quotidien haut de gamme.' },
  { name: 'SUV', slug: 'suv', description: 'Prestance et polyvalence, en ville comme en voyage.' },
  { name: 'Coupé', slug: 'coupe', description: 'Silhouette sportive et dynamique, deux portes.' },
  { name: 'Cabriolet', slug: 'cabriolet', description: 'Le plaisir de conduire à ciel ouvert.' },
  { name: 'Break', slug: 'break', description: 'Performance et volume de chargement premium.' },
  { name: 'Sportive', slug: 'sportive', description: 'Supercars et véhicules d’exception.' },
];

const BRANDS = [
  { name: 'BMW', slug: 'bmw', country: 'Allemagne' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', country: 'Allemagne' },
  { name: 'Porsche', slug: 'porsche', country: 'Allemagne' },
  { name: 'Audi', slug: 'audi', country: 'Allemagne' },
  { name: 'Land Rover', slug: 'land-rover', country: 'Royaume-Uni' },
  { name: 'Ferrari', slug: 'ferrari', country: 'Italie' },
  { name: 'Tesla', slug: 'tesla', country: 'États-Unis' },
  { name: 'Bentley', slug: 'bentley', country: 'Royaume-Uni' },
  { name: 'Volkswagen', slug: 'volkswagen', country: 'Allemagne' },
  { name: 'Renault', slug: 'renault', country: 'France' },
  { name: 'Peugeot', slug: 'peugeot', country: 'France' },
  { name: 'Toyota', slug: 'toyota', country: 'Japon' },
  { name: 'Ford', slug: 'ford', country: 'États-Unis' },
  { name: 'Opel', slug: 'opel', country: 'Allemagne' },
  { name: 'Citroën', slug: 'citroen', country: 'France' },
  { name: 'Škoda', slug: 'skoda', country: 'République tchèque' },
  { name: 'Fiat', slug: 'fiat', country: 'Italie' },
  { name: 'Nissan', slug: 'nissan', country: 'Japon' },
];

const MODELS: Record<string, { name: string; slug: string; bodyType: string }[]> = {
  bmw: [
    { name: 'Série 3', slug: 'serie-3', bodyType: 'Berline' },
    { name: 'M4', slug: 'm4', bodyType: 'Coupé' },
  ],
  'mercedes-benz': [
    { name: 'Classe S', slug: 'classe-s', bodyType: 'Berline' },
    { name: 'GLE', slug: 'gle', bodyType: 'SUV' },
  ],
  porsche: [
    { name: '911', slug: '911', bodyType: 'Coupé' },
    { name: 'Cayenne', slug: 'cayenne', bodyType: 'SUV' },
  ],
  audi: [
    { name: 'RS6 Avant', slug: 'rs6-avant', bodyType: 'Break' },
    { name: 'e-tron GT', slug: 'e-tron-gt', bodyType: 'Berline' },
  ],
  'land-rover': [{ name: 'Range Rover Sport', slug: 'range-rover-sport', bodyType: 'SUV' }],
  ferrari: [
    { name: '488 GTB', slug: '488-gtb', bodyType: 'Sportive' },
    { name: 'Roma', slug: 'roma', bodyType: 'Coupé' },
  ],
  tesla: [
    { name: 'Model S', slug: 'model-s', bodyType: 'Berline' },
    { name: 'Model X', slug: 'model-x', bodyType: 'SUV' },
  ],
  bentley: [
    { name: 'Continental GT', slug: 'continental-gt', bodyType: 'Coupé' },
    { name: 'Bentayga', slug: 'bentayga', bodyType: 'SUV' },
  ],
  volkswagen: [{ name: 'Golf GTI', slug: 'golf-gti', bodyType: 'Berline' }],
  renault: [{ name: 'Clio', slug: 'clio', bodyType: 'Berline' }],
  peugeot: [{ name: '3008', slug: '3008', bodyType: 'SUV' }],
  toyota: [{ name: 'Corolla', slug: 'corolla', bodyType: 'Berline' }],
  ford: [{ name: 'Focus ST', slug: 'focus-st', bodyType: 'Coupé' }],
  opel: [{ name: 'Corsa', slug: 'corsa', bodyType: 'Berline' }],
  citroen: [{ name: 'C4 Picasso', slug: 'c4-picasso', bodyType: 'Break' }],
  skoda: [{ name: 'Octavia Combi', slug: 'octavia-combi', bodyType: 'Break' }],
  fiat: [{ name: '500C', slug: '500c', bodyType: 'Cabriolet' }],
  nissan: [{ name: 'Qashqai', slug: 'qashqai', bodyType: 'SUV' }],
};

interface SeedVehicle {
  slug: string;
  title: string;
  description: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  condition: VehicleCondition;
  color: string;
  doors?: number;
  seats?: number;
  enginePower?: number;
  country: string;
  city: string;
  brandSlug: string;
  modelSlug: string;
  categorySlug: string;
  images: string[];
  isFeatured?: boolean;
  status: VehicleStatus;
}

const VEHICLES: SeedVehicle[] = [
  {
    slug: 'bmw-serie-3-2021-demo',
    title: 'BMW Série 3 320d 2021 — Full Options',
    description:
      'Magnifique BMW Série 3 2021 en excellent état, entretien suivi, carnet complet. Idéale pour un usage quotidien haut de gamme.',
    year: 2021, price: 9800, currency: 'EUR', mileage: 24000,
    fuelType: FuelType.DIESEL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Argent', doors: 4, seats: 5, enginePower: 190,
    country: 'France', city: 'Paris',
    brandSlug: 'bmw', modelSlug: 'serie-3', categorySlug: 'berline', images: [
      '/vehicles/bmw-serie-3-2021-demo-1.jpg',
      '/vehicles/bmw-serie-3-2021-demo-2.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'bmw-m4-competition-2022',
    title: 'BMW M4 Competition 2022',
    description:
      'BMW M4 Competition, moteur 6 cylindres bi-turbo 510 ch, pack carbone, échappement M Performance. Un pur bloc de sensations.',
    year: 2022, price: 9500, currency: 'EUR', mileage: 12500,
    fuelType: FuelType.PETROL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Bleu', doors: 2, seats: 4, enginePower: 510,
    country: 'Allemagne', city: 'Munich',
    brandSlug: 'bmw', modelSlug: 'm4', categorySlug: 'coupe', images: [
      '/vehicles/bmw-m4-competition-2022-1.jpg',
      '/vehicles/bmw-m4-competition-2022-2.jpg',
      '/vehicles/bmw-m4-competition-2022-3.jpg',
    ],
    isFeatured: true, status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'mercedes-classe-s-580-2022',
    title: 'Mercedes-Benz Classe S 580 4MATIC 2022',
    description:
      'Le summum du luxe allemand : suspension pneumatique, sièges massants, intérieur cuir Nappa. Livrée d’usine complète.',
    year: 2022, price: 9900, currency: 'CHF', mileage: 18000,
    fuelType: FuelType.HYBRID, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Noir', doors: 4, seats: 5, enginePower: 503,
    country: 'Suisse', city: 'Genève',
    brandSlug: 'mercedes-benz', modelSlug: 'classe-s', categorySlug: 'berline', images: [
      '/vehicles/mercedes-classe-s-580-2022-1.jpg',
      '/vehicles/mercedes-classe-s-580-2022-2.jpg',
      '/vehicles/mercedes-classe-s-580-2022-3.jpg',
    ],
    isFeatured: true, status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'mercedes-gle-450-2023',
    title: 'Mercedes-Benz GLE 450 4MATIC 2023',
    description:
      'SUV premium 7 places, toit panoramique, système MBUX, jantes 21". Parfait équilibre entre confort et prestance.',
    year: 2023, price: 8900, currency: 'CHF', mileage: 9000,
    fuelType: FuelType.HYBRID, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Noir', doors: 5, seats: 7, enginePower: 381,
    country: 'Suisse', city: 'Zürich',
    brandSlug: 'mercedes-benz', modelSlug: 'gle', categorySlug: 'suv', images: [
      '/vehicles/mercedes-gle-450-2023-1.jpg',
      '/vehicles/mercedes-gle-450-2023-2.jpg',
      '/vehicles/mercedes-gle-450-2023-3.jpg',
    ],
    status: VehicleStatus.PENDING_REVIEW,
  },
  {
    slug: 'porsche-911-carrera-s-2023',
    title: 'Porsche 911 Carrera S 2023',
    description:
      'Icône intemporelle. Boîte PDK, Sport Chrono, échappement sport. Entretien exclusivement chez Porsche Centre.',
    year: 2023, price: 9990, currency: 'USD', mileage: 4200,
    fuelType: FuelType.PETROL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Rouge', doors: 2, seats: 4, enginePower: 450,
    country: 'États-Unis', city: 'Los Angeles',
    brandSlug: 'porsche', modelSlug: '911', categorySlug: 'coupe', images: [
      '/vehicles/porsche-911-carrera-s-2023-1.jpg',
      '/vehicles/porsche-911-carrera-s-2023-2.jpg',
      '/vehicles/porsche-911-carrera-s-2023-3.jpg',
    ],
    isFeatured: true, status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'porsche-911-cabriolet-2022',
    title: 'Porsche 911 Carrera 4S Cabriolet 2022',
    description:
      'Transmission intégrale, capote électrique, sièges sport plus. Le plaisir de conduire à ciel ouvert sur la Côte d’Azur.',
    year: 2022, price: 9700, currency: 'EUR', mileage: 8600,
    fuelType: FuelType.PETROL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Jaune', doors: 2, seats: 4, enginePower: 450,
    country: 'France', city: 'Nice',
    brandSlug: 'porsche', modelSlug: '911', categorySlug: 'cabriolet', images: [
      '/vehicles/porsche-911-cabriolet-2022-1.jpg',
      '/vehicles/porsche-911-cabriolet-2022-2.jpg',
      '/vehicles/porsche-911-cabriolet-2022-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'porsche-cayenne-turbo-2022',
    title: 'Porsche Cayenne Turbo 2022',
    description:
      'Le SUV le plus véloce de sa catégorie : 571 ch, freins céramique, suspension pneumatique adaptative.',
    year: 2022, price: 8500, currency: 'USD', mileage: 15600,
    fuelType: FuelType.PETROL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Blanc', doors: 5, seats: 5, enginePower: 571,
    country: 'États-Unis', city: 'Miami',
    brandSlug: 'porsche', modelSlug: 'cayenne', categorySlug: 'suv', images: [
      '/vehicles/porsche-cayenne-turbo-2022-1.jpg',
      '/vehicles/porsche-cayenne-turbo-2022-2.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'audi-rs6-avant-2022',
    title: 'Audi RS6 Avant 2022',
    description:
      'Le break le plus rapide du marché : V8 biturbo 600 ch, quattro, freins carbo-céramique. Performance et praticité.',
    year: 2022, price: 7900, currency: 'EUR', mileage: 21000,
    fuelType: FuelType.PETROL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Anthracite', doors: 5, seats: 5, enginePower: 600,
    country: 'Allemagne', city: 'Munich',
    brandSlug: 'audi', modelSlug: 'rs6-avant', categorySlug: 'break', images: [
      '/vehicles/audi-rs6-avant-2022-1.jpg',
      '/vehicles/audi-rs6-avant-2022-2.jpg',
      '/vehicles/audi-rs6-avant-2022-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'audi-e-tron-gt-2023',
    title: 'Audi e-tron GT quattro 2023',
    description:
      'Berline 100% électrique, 476 ch, recharge rapide 270 kW, direction dynamique. L’élégance silencieuse.',
    year: 2023, price: 8200, currency: 'EUR', mileage: 6200,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Blanc', doors: 4, seats: 4, enginePower: 476,
    country: 'France', city: 'Paris',
    brandSlug: 'audi', modelSlug: 'e-tron-gt', categorySlug: 'berline', images: [
      '/vehicles/audi-e-tron-gt-2023-1.jpg',
      '/vehicles/audi-e-tron-gt-2023-2.jpg',
      '/vehicles/audi-e-tron-gt-2023-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'range-rover-sport-2023',
    title: 'Range Rover Sport Autobiography 2023',
    description:
      'Suspension pneumatique active, intérieur cuir Windsor, système Meridian. Le raffinement britannique tout-terrain.',
    year: 2023, price: 7500, currency: 'GBP', mileage: 7300,
    fuelType: FuelType.HYBRID, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Vert', doors: 5, seats: 5, enginePower: 434,
    country: 'Royaume-Uni', city: 'Londres',
    brandSlug: 'land-rover', modelSlug: 'range-rover-sport', categorySlug: 'suv', images: [
      '/vehicles/range-rover-sport-2023-1.jpg',
      '/vehicles/range-rover-sport-2023-2.jpg',
      '/vehicles/range-rover-sport-2023-3.jpg',
    ],
    isFeatured: true, status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'ferrari-488-gtb-2019',
    title: 'Ferrari 488 GTB 2019',
    description:
      'V8 biturbo 670 ch, châssis en aluminium, aérodynamique active. Une supercar mythique en parfait état, carnet Ferrari complet.',
    year: 2019, price: 9999, currency: 'EUR', mileage: 9800,
    fuelType: FuelType.PETROL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Rouge', doors: 2, seats: 2, enginePower: 670,
    country: 'Monaco', city: 'Monaco',
    brandSlug: 'ferrari', modelSlug: '488-gtb', categorySlug: 'sportive', images: [
      '/vehicles/ferrari-488-gtb-2019-1.jpg',
      '/vehicles/ferrari-488-gtb-2019-2.jpg',
      '/vehicles/ferrari-488-gtb-2019-3.jpg',
    ],
    isFeatured: true, status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'ferrari-roma-2022',
    title: 'Ferrari Roma 2022',
    description:
      'Grand tourisme élégant, V8 620 ch, ligne intemporelle signée Centro Stile Ferrari. Livrée neuve, garantie constructeur.',
    year: 2022, price: 9800, currency: 'EUR', mileage: 3100,
    fuelType: FuelType.PETROL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.CERTIFIED_PRE_OWNED,
    color: 'Rouge', doors: 2, seats: 4, enginePower: 620,
    country: 'Italie', city: 'Milan',
    brandSlug: 'ferrari', modelSlug: 'roma', categorySlug: 'coupe', images: [
      '/vehicles/ferrari-roma-2022-1.jpg',
      '/vehicles/ferrari-roma-2022-2.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'tesla-model-s-plaid-2023',
    title: 'Tesla Model S Plaid 2023',
    description:
      'La berline électrique la plus rapide au monde : 0 à 100 km/h en 2,1 s, autonomie 600 km, Autopilot complet.',
    year: 2023, price: 6900, currency: 'USD', mileage: 5400,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Blanc', doors: 4, seats: 5, enginePower: 1020,
    country: 'États-Unis', city: 'New York',
    brandSlug: 'tesla', modelSlug: 'model-s', categorySlug: 'berline', images: [
      '/vehicles/tesla-model-s-plaid-2023-1.jpg',
      '/vehicles/tesla-model-s-plaid-2023-2.jpg',
      '/vehicles/tesla-model-s-plaid-2023-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'tesla-model-x-2022',
    title: 'Tesla Model X 2022',
    description:
      'SUV électrique 6 places, portes Falcon Wing, autonomie 560 km. Technologie et espace au service de la famille.',
    year: 2022, price: 6500, currency: 'USD', mileage: 17200,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Blanc', doors: 5, seats: 6, enginePower: 670,
    country: 'États-Unis', city: 'Los Angeles',
    brandSlug: 'tesla', modelSlug: 'model-x', categorySlug: 'suv', images: [
      '/vehicles/tesla-model-x-2022-1.jpg',
      '/vehicles/tesla-model-x-2022-2.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'bentley-continental-gt-2021',
    title: 'Bentley Continental GT V8 2021',
    description:
      'Grand tourisme britannique par excellence : cuir cousu main, boiseries précieuses, W12... pardon, V8 550 ch de couple souverain.',
    year: 2021, price: 9200, currency: 'GBP', mileage: 11400,
    fuelType: FuelType.PETROL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Bleu', doors: 2, seats: 4, enginePower: 550,
    country: 'Royaume-Uni', city: 'Londres',
    brandSlug: 'bentley', modelSlug: 'continental-gt', categorySlug: 'coupe', images: [
      '/vehicles/bentley-continental-gt-2021-1.jpg',
      '/vehicles/bentley-continental-gt-2021-2.jpg',
      '/vehicles/bentley-continental-gt-2021-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'bentley-bentayga-2022',
    title: 'Bentley Bentayga Azure 2022',
    description:
      'Le SUV ultra-luxe : suspension active Bentley Dynamic Ride, intérieur sur-mesure, finition Azure. Prestige absolu.',
    year: 2022, price: 8800, currency: 'CHF', mileage: 6700,
    fuelType: FuelType.HYBRID, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Vert', doors: 5, seats: 5, enginePower: 462,
    country: 'Suisse', city: 'Genève',
    brandSlug: 'bentley', modelSlug: 'bentayga', categorySlug: 'suv', images: [
      '/vehicles/bentley-bentayga-2022-1.jpg',
      '/vehicles/bentley-bentayga-2022-2.jpg',
      '/vehicles/bentley-bentayga-2022-3.jpg',
    ],
    isFeatured: true, status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'vw-golf-gti-2018',
    title: 'Volkswagen Golf GTI 2018',
    description:
      'La référence des compactes sportives : moteur 2.0 TSI 230 ch, châssis affûté, finition GTI reconnaissable entre mille. Entretien complet, carnet à jour.',
    year: 2018, price: 9200, currency: 'EUR', mileage: 68000,
    fuelType: FuelType.PETROL, transmission: TransmissionType.MANUAL, condition: VehicleCondition.USED,
    color: 'Blanc', doors: 5, seats: 5, enginePower: 230,
    country: 'Allemagne', city: 'Munich',
    brandSlug: 'volkswagen', modelSlug: 'golf-gti', categorySlug: 'berline', images: [
      '/vehicles/vw-golf-gti-2018-1.jpg',
      '/vehicles/vw-golf-gti-2018-2.jpg',
      '/vehicles/vw-golf-gti-2018-3.jpg',
    ],
    isFeatured: true, status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'renault-clio-v-2020',
    title: 'Renault Clio V Intens 2020',
    description:
      'Citadine moderne et économique, faible kilométrage, garantie constructeur restante. Idéale pour un premier achat malin.',
    year: 2020, price: 8900, currency: 'EUR', mileage: 32000,
    fuelType: FuelType.PETROL, transmission: TransmissionType.MANUAL, condition: VehicleCondition.USED,
    color: 'Rouge', doors: 5, seats: 5, enginePower: 100,
    country: 'France', city: 'Paris',
    brandSlug: 'renault', modelSlug: 'clio', categorySlug: 'berline', images: [
      '/vehicles/renault-clio-v-2020-1.jpg',
      '/vehicles/renault-clio-v-2020-2.jpg',
      '/vehicles/renault-clio-v-2020-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'peugeot-3008-gt-2019',
    title: 'Peugeot 3008 GT 2019',
    description:
      'SUV familial maintes fois primé, finition GT, toit panoramique, i-Cockpit digital. Un excellent rapport prestations/prix.',
    year: 2019, price: 9500, currency: 'EUR', mileage: 54000,
    fuelType: FuelType.DIESEL, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Gris', doors: 5, seats: 5, enginePower: 130,
    country: 'France', city: 'Lyon',
    brandSlug: 'peugeot', modelSlug: '3008', categorySlug: 'suv', images: [
      '/vehicles/peugeot-3008-gt-2019-1.jpg',
      '/vehicles/peugeot-3008-gt-2019-2.jpg',
      '/vehicles/peugeot-3008-gt-2019-3.jpg',
    ],
    isFeatured: true, status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'toyota-corolla-hybrid-2020',
    title: 'Toyota Corolla Touring Sports Hybrid 2020',
    description:
      'Break hybride ultra fiable, consommation réduite, garantie Toyota étendue. La sérénité au quotidien.',
    year: 2020, price: 8700, currency: 'EUR', mileage: 41000,
    fuelType: FuelType.HYBRID, transmission: TransmissionType.AUTOMATIC, condition: VehicleCondition.USED,
    color: 'Blanc', doors: 5, seats: 5, enginePower: 122,
    country: 'Italie', city: 'Milan',
    brandSlug: 'toyota', modelSlug: 'corolla', categorySlug: 'berline', images: [
      '/vehicles/toyota-corolla-hybrid-2020-1.jpg',
      '/vehicles/toyota-corolla-hybrid-2020-2.jpg',
      '/vehicles/toyota-corolla-hybrid-2020-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'ford-focus-st-2019',
    title: 'Ford Focus ST 2019',
    description:
      'Berline sportive 280 ch, châssis ST, freins renforcés. Pour les amateurs de sensations à petit budget.',
    year: 2019, price: 8300, currency: 'EUR', mileage: 61000,
    fuelType: FuelType.PETROL, transmission: TransmissionType.MANUAL, condition: VehicleCondition.USED,
    color: 'Gris', doors: 4, seats: 5, enginePower: 280,
    country: 'Allemagne', city: 'Berlin',
    brandSlug: 'ford', modelSlug: 'focus-st', categorySlug: 'coupe', images: [
      '/vehicles/ford-focus-st-2019-1.jpg',
      '/vehicles/ford-focus-st-2019-2.jpg',
      '/vehicles/ford-focus-st-2019-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'opel-corsa-2021',
    title: 'Opel Corsa 2021',
    description:
      'Citadine récente, faible kilométrage, garantie constructeur active. Économique et agréable à conduire au quotidien.',
    year: 2021, price: 7200, currency: 'EUR', mileage: 28000,
    fuelType: FuelType.PETROL, transmission: TransmissionType.MANUAL, condition: VehicleCondition.USED,
    color: 'Blanc', doors: 5, seats: 5, enginePower: 100,
    country: 'Allemagne', city: 'Berlin',
    brandSlug: 'opel', modelSlug: 'corsa', categorySlug: 'berline', images: [
      '/vehicles/opel-corsa-2021-1.jpg',
      '/vehicles/opel-corsa-2021-2.jpg',
      '/vehicles/opel-corsa-2021-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'citroen-c4-picasso-2018',
    title: 'Citroën C4 Picasso 2018',
    description:
      'Monospace compact spacieux et confortable, idéal pour la famille. Bien équipé, entretien à jour.',
    year: 2018, price: 6900, currency: 'EUR', mileage: 72000,
    fuelType: FuelType.DIESEL, transmission: TransmissionType.MANUAL, condition: VehicleCondition.USED,
    color: 'Gris', doors: 5, seats: 5, enginePower: 120,
    country: 'France', city: 'Paris',
    brandSlug: 'citroen', modelSlug: 'c4-picasso', categorySlug: 'break', images: [
      '/vehicles/citroen-c4-picasso-2018-1.jpg',
      '/vehicles/citroen-c4-picasso-2018-2.jpg',
      '/vehicles/citroen-c4-picasso-2018-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'skoda-octavia-combi-2019',
    title: 'Škoda Octavia Combi 2019',
    description:
      'Break diesel increvable, grand volume de coffre, entretien rigoureux. Le choix malin des gros rouleurs.',
    year: 2019, price: 7900, currency: 'EUR', mileage: 58000,
    fuelType: FuelType.DIESEL, transmission: TransmissionType.MANUAL, condition: VehicleCondition.USED,
    color: 'Bleu', doors: 5, seats: 5, enginePower: 150,
    country: 'République tchèque', city: 'Prague',
    brandSlug: 'skoda', modelSlug: 'octavia-combi', categorySlug: 'break', images: [
      '/vehicles/skoda-octavia-combi-2019-1.jpg',
      '/vehicles/skoda-octavia-combi-2019-2.jpg',
      '/vehicles/skoda-octavia-combi-2019-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'fiat-500c-2020',
    title: 'Fiat 500C 2020',
    description:
      'Cabriolet citadin plein de charme, toit ouvrant électrique, faible kilométrage. Parfait pour rouler cheveux au vent.',
    year: 2020, price: 6500, currency: 'EUR', mileage: 22000,
    fuelType: FuelType.PETROL, transmission: TransmissionType.MANUAL, condition: VehicleCondition.USED,
    color: 'Blanc', doors: 2, seats: 4, enginePower: 70,
    country: 'Italie', city: 'Rome',
    brandSlug: 'fiat', modelSlug: '500c', categorySlug: 'cabriolet', images: [
      '/vehicles/fiat-500c-2020-1.jpg',
      '/vehicles/fiat-500c-2020-2.jpg',
      '/vehicles/fiat-500c-2020-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
  {
    slug: 'nissan-qashqai-2019',
    title: 'Nissan Qashqai 2019',
    description:
      'SUV compact polyvalent, diesel économique, très bon état général. Un classique toujours plébiscité.',
    year: 2019, price: 7800, currency: 'EUR', mileage: 65000,
    fuelType: FuelType.DIESEL, transmission: TransmissionType.MANUAL, condition: VehicleCondition.USED,
    color: 'Noir', doors: 5, seats: 5, enginePower: 115,
    country: 'Pays-Bas', city: 'Amsterdam',
    brandSlug: 'nissan', modelSlug: 'qashqai', categorySlug: 'suv', images: [
      '/vehicles/nissan-qashqai-2019-1.jpg',
      '/vehicles/nissan-qashqai-2019-2.jpg',
      '/vehicles/nissan-qashqai-2019-3.jpg',
    ],
    status: VehicleStatus.PUBLISHED,
  },
];

async function main() {
  console.log('Seeding CarMarket…');

  const [superAdminRole, adminRole, sellerRole, buyerRole] = await Promise.all(
    [RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.SELLER, RoleName.BUYER].map((name) =>
      prisma.role.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );

  const passwordHash = await argon2.hash('Passw0rd!');

  await prisma.user.upsert({
    where: { email: 'admin@carmarket.com' },
    update: {},
    create: {
      firstName: 'Ada',
      lastName: 'Admin',
      email: 'admin@carmarket.com',
      passwordHash,
      isEmailVerified: true,
      roleIds: [superAdminRole.id, adminRole.id],
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@carmarket.com' },
    update: {},
    create: {
      firstName: 'Sam',
      lastName: 'Seller',
      email: 'seller@carmarket.com',
      passwordHash,
      isEmailVerified: true,
      country: 'France',
      roleIds: [sellerRole.id],
    },
  });

  await prisma.user.upsert({
    where: { email: 'buyer@carmarket.com' },
    update: {},
    create: {
      firstName: 'Bob',
      lastName: 'Buyer',
      email: 'buyer@carmarket.com',
      passwordHash,
      isEmailVerified: true,
      country: 'France',
      roleIds: [buyerRole.id],
    },
  });

  const categoriesBySlug = new Map<string, { id: string }>();
  for (const category of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: { name: category.name, slug: category.slug, description: category.description, parentId: null },
    });
    categoriesBySlug.set(category.slug, created);
  }

  const brandsBySlug = new Map<string, { id: string }>();
  for (const brand of BRANDS) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: { name: brand.name, slug: brand.slug, country: brand.country },
    });
    brandsBySlug.set(brand.slug, created);
  }

  const modelsBySlug = new Map<string, { id: string }>();
  for (const [brandSlug, models] of Object.entries(MODELS)) {
    const brand = brandsBySlug.get(brandSlug)!;
    for (const model of models) {
      const created = await prisma.model.upsert({
        where: { brandId_slug: { brandId: brand.id, slug: model.slug } },
        update: {},
        create: { name: model.name, slug: model.slug, brandId: brand.id, bodyType: model.bodyType },
      });
      modelsBySlug.set(`${brandSlug}:${model.slug}`, created);
    }
  }

  for (const vehicle of VEHICLES) {
    const brand = brandsBySlug.get(vehicle.brandSlug)!;
    const model = modelsBySlug.get(`${vehicle.brandSlug}:${vehicle.modelSlug}`)!;
    const category = categoriesBySlug.get(vehicle.categorySlug)!;

    const scalarData = {
      title: vehicle.title,
      description: vehicle.description,
      year: vehicle.year,
      price: vehicle.price,
      currency: vehicle.currency,
      mileage: vehicle.mileage,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      condition: vehicle.condition,
      status: vehicle.status,
      color: vehicle.color,
      doors: vehicle.doors,
      seats: vehicle.seats,
      enginePower: vehicle.enginePower,
      country: vehicle.country,
      city: vehicle.city,
      isFeatured: vehicle.isFeatured ?? false,
      brandId: brand.id,
      modelId: model.id,
      categoryId: category.id,
    };

    // Re-running the seed (e.g. after adjusting demo prices) keeps existing
    // vehicles in sync instead of silently skipping them — but only their
    // scalar fields; images are left alone once created.
    await prisma.vehicle.upsert({
      where: { slug: vehicle.slug },
      update: scalarData,
      create: {
        ...scalarData,
        slug: vehicle.slug,
        sellerId: seller.id,
        images: {
          create: vehicle.images.map((url, index) => ({ url, position: index, isPrimary: index === 0 })),
        },
      },
    });
  }

  console.log('Seed terminé.');
  console.log(`   Admin:  admin@carmarket.com / Passw0rd!`);
  console.log(`   Seller: seller@carmarket.com / Passw0rd!`);
  console.log(`   Buyer:  buyer@carmarket.com / Passw0rd!`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
