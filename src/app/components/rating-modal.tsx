import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { StarRating } from './star-rating';
import { X } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  teacherAvatar: string;
  onSubmit: (rating: number, feedback: string) => void;
}

export function RatingModal({ 
  isOpen, 
  onClose, 
  teacherName, 
  teacherAvatar,
  onSubmit 
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit(rating, feedback);
    setIsSubmitting(false);
    onClose();
    setRating(0);
    setFeedback('');
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-md z-50 shadow-soft-lg animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <DialogPrimitive.Title className="text-xl font-semibold text-foreground">
              Meetingni baholang
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-lg p-1 hover:bg-secondary transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </DialogPrimitive.Close>
          </div>
          
          <div className="space-y-6">
            {/* Teacher Info */}
            <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
              <div className="w-12 h-12 rounded-full bg-white overflow-hidden flex-shrink-0">
                <img src={teacherAvatar} alt={teacherName} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-foreground">{teacherName}</p>
                <p className="text-sm text-muted-foreground">Support Teacher</p>
              </div>
            </div>

            {/* Rating */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">Meetingdan qanchalik mamnun qoldingiz?</p>
              <div className="flex justify-center">
                <StarRating 
                  rating={rating} 
                  onRatingChange={setRating}
                  size="lg"
                />
              </div>
              {rating > 0 && (
                <p className="text-sm font-medium text-primary animate-fade-in">
                  {rating === 5 ? 'Ajoyib!' : rating >= 4 ? 'Yaxshi!' : rating >= 3 ? 'Yoqdi' : rating >= 2 ? 'O\'rtacha' : 'Yoqmadi'}
                </p>
              )}
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              <label htmlFor="feedback" className="block text-sm font-medium text-foreground">
                Izoh (ixtiyoriy)
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Meetingni yaxshilash bo'yicha fikrlaringizni yozing..."
                rows={4}
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <DialogPrimitive.Close asChild>
                <button className="flex-1 px-4 py-3 border-2 border-gray-200 text-foreground rounded-xl hover:bg-secondary transition-colors font-medium">
                  Bekor qilish
                </button>
              </DialogPrimitive.Close>
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex-1 px-4 py-3 gradient-primary text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-soft"
              >
                {isSubmitting ? 'Yuklanmoqda...' : 'Yuborish'}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
