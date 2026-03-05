import { useState } from 'react';
import { StarRating } from './star-rating';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackFormProps {
  onSubmit: (rating: number, comment: string) => void;
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Iltimos, baho bering');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Iltimos, izoh yozing');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(rating, comment);
    toast.success('Fikr-mulohazangiz yuborildi!');
    
    setRating(0);
    setComment('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
      <h3 className="font-semibold text-foreground mb-4">Fikr-mulohaza qoldiring</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Xizmatimizni baholang
          </label>
          <div className="flex items-center gap-3">
            <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            {rating > 0 && (
              <span className="text-sm font-medium text-primary animate-fade-in">
                {rating}/5
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm text-muted-foreground mb-2">
            Izohingiz
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Xizmatimizni yaxshilash bo'yicha takliflaringizni yozing..."
            rows={4}
            className="w-full px-4 py-3 bg-input-background rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {comment.length}/500 belgi
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className="w-full gradient-primary text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-soft flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
        </button>
      </div>
    </form>
  );
}
