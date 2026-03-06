import { cn } from '../lib/utils';
import { Lock, CheckCircle2, Users, Check } from 'lucide-react';

interface SlotCardProps {
  time: string;
  status: string;
  bookedCount: number;
  capacity: number;
  isFull?: boolean;
  isBlocked?: boolean;
  isBooked?: boolean;
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
  const isDisabled = isFull || isBlocked || isBooked;

  const getStyle = () => {
    if (isBooked) return 'bg-white border-emerald-500 shadow-sm';
    if (isBlocked) return 'bg-slate-50 border-slate-100 text-slate-300 opacity-60';
    if (isFull) return 'bg-orange-50/50 border-orange-100 text-orange-300';
    if (normalized === 'open') return 'bg-white border-slate-100 text-slate-800 shadow-sm';
    return 'bg-gray-50 border-gray-100 text-gray-500';
  };

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-between p-4 rounded-[22px] border-2 transition-colors duration-200',
        getStyle(),
        'cursor-pointer disabled:cursor-default'
      )}
    >
      {/* BAND QILINGAN UCHUN CHAP TOMONDAGI STATIK INDIKATOR */}
      {isBooked && (
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-500 rounded-r-full" />
      )}

      {/* VAQT */}
      <div className="flex flex-col items-start">
        <span className={cn(
          "text-[18px] font-black tracking-tight leading-none italic",
          isBooked ? "text-emerald-600 pl-2" : "text-slate-800"
        )}>
          {time}
        </span>
        {isBooked && (
          <span className="text-[8px] font-black uppercase text-emerald-500/60 tracking-widest mt-1.5 pl-2">
            BAND QILINDI
          </span>
        )}
      </div>

      {/* STATUS BADGE - TRUE ICON + SONI */}
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border",
        isBooked 
          ? "bg-emerald-50 border-emerald-100" 
          : "bg-slate-50 border-slate-100"
      )}>
        <div className="flex items-center gap-1">
          {isBooked ? (
            // Band qilinganda galochka chiqadi
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
          ) : (
            // Oddiy holatda odamcha
            <Users className="w-3 h-3 text-[#0088cc] opacity-40" />
          )}
          
          <span className={cn(
            "text-[10px] font-black tabular-nums", 
            isBooked ? "text-emerald-600" : "text-slate-500"
          )}>
            {bookedCount}/{capacity}
          </span>
        </div>
      </div>
    </button>
  );
}