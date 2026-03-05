import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  rating: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export function StarRating({ rating, onChange, readonly }: Props) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          className={cn(
            "transition-all duration-300",
            !readonly && "active:scale-125 hover:scale-110",
            n <= rating ? "scale-110" : "scale-100"
          )}
          onClick={() => !readonly && onChange?.(n)}
        >
          <Star
            className={cn(
              "w-8 h-8 transition-colors duration-300",
              n <= rating
                ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                : 'text-gray-200 fill-transparent'
            )}
          />
        </button>
      ))}
    </div>
  );
}