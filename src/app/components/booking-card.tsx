import { formatShortDate, cn } from '../lib/utils';
import { Calendar, Clock, Star, XCircle, MessageSquareQuote } from 'lucide-react';

interface Props {
  id: number;
  teacherName: string;
  date: string;
  time: string;
  status: string;
  stars?: number | null;
  review?: string | null;
  onCancel?: () => void;
  onRate?: () => void;
}

export function BookingCard({ teacherName, date, time, status, stars, review, onCancel, onRate }: Props) {
  const normalized = status?.toLowerCase();

  const statusConfig: Record<string, { label: string; class: string }> = {
    booked: { label: 'Kutilmoqda', class: 'bg-blue-50 text-blue-600 border-blue-100' },
    attended: { label: 'Yakunlandi', class: 'bg-green-50 text-green-600 border-green-100' },
    cancelled: { label: 'Bekor qilingan', class: 'bg-gray-100 text-gray-500 border-gray-200' },
  };

  const currentStatus = statusConfig[normalized] || statusConfig.booked;

  return (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 text-[17px] tracking-tight group-hover:text-[#0088cc] transition-colors">
            {teacherName}
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-gray-400 text-[13px] font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#0088cc]" />
              {formatShortDate(date)}
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-[13px] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#0088cc]" />
              {time}
            </div>
          </div>
        </div>

        <span className={cn("text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border", currentStatus.class)}>
          {currentStatus.label}
        </span>
      </div>

      {/* Review Section */}
      {stars && (
        <div className="mt-4 p-3 bg-[#f8f9fb] rounded-2xl border border-gray-100 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("w-3.5 h-3.5", i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
            ))}
          </div>
          {review && (
            <p className="text-gray-600 text-sm leading-relaxed italic flex gap-2">
              <MessageSquareQuote className="w-4 h-4 text-gray-300 shrink-0" />
              "{review}"
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-5">
        {normalized === 'booked' && onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Bekor qilish
          </button>
        )}

        {normalized === 'attended' && !stars && onRate && (
          <button
            onClick={onRate}
            className="flex-1 py-2.5 rounded-xl bg-[#0088cc] text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4" />
            Baholash
          </button>
        )}
      </div>
    </div>
  );
}