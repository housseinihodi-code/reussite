import { useState } from 'react';
import clsx from 'clsx';
import type { VehicleImage } from '@/types/vehicle.types';

interface GalleryProps {
  images: VehicleImage[];
  alt: string;
}

export function Gallery({ images, alt }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!images.length) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        <img src="/placeholder-car.svg" alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        <img src={active.url} alt={active.altText ?? alt} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={clsx(
                'aspect-square overflow-hidden rounded-lg border-2',
                index === activeIndex ? 'border-primary-600' : 'border-transparent opacity-80 hover:opacity-100',
              )}
            >
              <img src={image.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
