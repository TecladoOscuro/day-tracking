import type { WeightEntry } from '../types';

interface Props {
  weights: WeightEntry[];
}

export default function ProgressPhotos({ weights }: Props) {
  const photos = weights.filter((w) => w.photo);

  if (photos.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        Añade fotos a tus registros de peso para ver la galería
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">
        Galería de progreso
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((w) => (
          <div key={w.id} className="relative group">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={w.photo}
                alt={w.date}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md">
              {new Date(w.date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              })}
              <br />
              {w.weight}kg
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
