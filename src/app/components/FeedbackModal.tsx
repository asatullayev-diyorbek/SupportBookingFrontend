import * as Dialog from '@radix-ui/react-dialog';
import { Star, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export function FeedbackModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Iltimos, yulduzcha tanlang");
    
    setIsSending(true);
    // Bu yerda API chaqiruvi bo'ladi
    setTimeout(() => {
      toast.success("Fikringiz uchun rahmat!");
      setIsSending(false);
      onOpenChange(false);
      setRating(0);
      setComment('');
    }, 1000);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-2xl z-[101] outline-none max-w-lg mx-auto flex flex-col animate-in slide-in-from-bottom duration-500">
          
          <div className="p-8 pb-10">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6 opacity-50" />
            
            <Dialog.Title className="text-2xl font-black text-gray-900 tracking-tight text-center mb-2">
              Fikringiz biz uchun muhim
            </Dialog.Title>
            <p className="text-gray-400 text-center text-sm mb-8">
              Ilovamizni baholang va takliflaringizni yozing
            </p>

            {/* ⭐ YULDUZCHALAR */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="relative p-1 active:scale-90 transition-transform"
                >
                  <Star 
                    className={cn(
                      "w-10 h-10 transition-all duration-300",
                      star <= rating ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" : "text-gray-200"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* 📝 MATN MAYDONI */}
            <div className="relative mb-8 group">
              <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-300 group-focus-within:text-[#0088cc] transition-colors" />
              <textarea
                placeholder="Taklif yoki shikoyatingizni yozing..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0088cc]/10 focus:bg-white rounded-2xl p-4 pl-11 text-[15px] font-medium transition-all outline-none min-h-[120px] resize-none text-gray-800"
                rows={3}
              />
            </div>

            {/* TUGMALAR */}
            <div className="flex gap-3">
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-[14px] text-gray-400 bg-red-50 active:scale-95 transition-all uppercase tracking-widest"
              >
                Yopish
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSending}
                className="flex-[2] py-4 rounded-2xl bg-[#0088cc] text-white font-bold text-[14px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest"
              >
                {isSending ? 'Yuborilmoqda...' : 'Yuborish'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}