import { cn } from '../lib/utils';
import { Lock, CheckCircle2, Users, BookmarkCheck } from 'lucide-react';

interface SlotCardProps {
  time: string;
  status: string;
  bookedCount: number;
  capacity: number;
  isFull?: boolean;
  isBlocked?: boolean;
  isBooked?: boolean; // Yangi prop qo'shildi
  onClick?: () => void;
}

export function SlotCard({ 
  time, 
  status, 
  bookedCount, 
  capacity, 
  isFull, 
  isBlocked, 
  isBooked, 
  onClick 
}: SlotCardProps) {
  const normalized = status?.toLowerCase();
  
  // Agar band qilingan, to'lgan yoki bloklangan bo'lsa - tugma ishlamaydi
  const isDisabled = isFull || isBlocked || isBooked;

  const getStyle = () => {
    // 1. Foydalanuvchi o'zi band qilgan holat (Yashil)
    if (isBooked) return 'bg-emerald-50 border-emerald-100 text-emerald-600 cursor-not-allowed';
    
    // 2. Bloklangan holat
    if (isBlocked) return 'bg-gray-100 border-transparent text-gray-400 opacity-60 cursor-not-allowed';
    
    // 3. To'lib bo'lgan holat (Lekin foydalanuvchi o'zi band qilmagan)
    if (isFull) return 'bg-orange-50 border-orange-100 text-orange-600 cursor-not-allowed';
    
    // 4. Ochiq holat
    if (normalized === 'open') return 'bg-white border-[#0088cc]/20 text-[#0088cc] shadow-sm hover:shadow-md active:bg-[#0088cc]/5';
    
    return 'bg-gray-50 border-gray-100 text-gray-500';
  };

  return (
    <button
      disabled={isDisabled}
      onClick={!isDisabled ? onClick : undefined}
      className={cn(
        'relative overflow-hidden group p-4 rounded-[20px] border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 active:scale-95',
        getStyle()
      )}
    >
      {!isDisabled && (
        <div className="absolute inset-0 bg-[#0088cc]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      )}

      <div className="relative z-10 font-black text-[18px] tracking-tight leading-none mb-1">
        {time}
      </div>

      <div className="relative z-10 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em]">
        {isBooked ? (
          <>
            <BookmarkCheck className="w-3.5 h-3.5 fill-emerald-600/20" />
            Band qildingiz
          </>
        ) : isBlocked ? (
          <>
            <Lock className="w-3 h-3" /> 
            Yopiq
          </>
        ) : isFull ? (
          <>
            <CheckCircle2 className="w-3 h-3" /> 
            To'lgan
          </>
        ) : (
          <>
            <Users className="w-3.5 h-3.5 opacity-70" /> 
            {bookedCount}/{capacity}
          </>
        )}
      </div>

      {isBooked && (
        <div className="absolute top-[-10px] right-[-10px] w-6 h-6 bg-emerald-500 rotate-45" />
      )}
    </button>
  );
}