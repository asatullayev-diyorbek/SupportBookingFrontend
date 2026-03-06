import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { History, CalendarCheck, Star, MessageSquare, TicketCheck, Sparkles, AlertCircle } from 'lucide-react';

import { getMyBookings, MyBooking } from '../lib/booking';
import { cancelBooking, reviewBooking } from '../lib/booking-create';
import { BookingCard } from '../components/booking-card';
import { StarRating } from '../components/star-rating';
import { cn } from '../lib/utils';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<MyBooking | null>(null);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data || []);
    } catch {
      toast.error("Ma'lumotlar yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const upcoming = bookings.filter((b) => b.status === 'booked');
  const history = bookings.filter((b) => b.status !== 'booked');
  const currentList = activeTab === 'upcoming' ? upcoming : history;

  const handleCancel = async (id: number) => {
    try {
      setActionLoading(id);
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Bekor qilindi');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenReview = (booking: MyBooking) => {
    setSelectedBooking(booking);
    setRating(0);
    setReviewText('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking || rating === 0) return toast.error('Yulduzcha tanlang');
    try {
      setActionLoading(selectedBooking.id);
      await reviewBooking(selectedBooking.id, rating, reviewText);
      setBookings((prev) => prev.map((b) => b.id === selectedBooking.id ? { ...b, stars: rating, review: reviewText } : b));
      toast.success('Rahmat!');
      setReviewModalOpen(false);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9]">
      <div className="w-10 h-10 border-4 border-[#0088cc] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-32 overflow-x-hidden">
      
      {/* 🟦 PREMIUM HEADER */}
      <div className="sticky top-0 z-40 bg-[#0088cc] px-6 pt-10 pb-8 rounded-b-[45px] shadow-[0_15px_40px_rgba(0,136,204,0.25)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-inner">
               <TicketCheck className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="text-2xl font-black text-white tracking-tighter italic leading-none">Darslarim</h1>
               <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-1">Jadval boshqaruvi</p>
             </div>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
        </div>
        
        <div className="flex bg-black/10 p-1.5 rounded-[22px] backdrop-blur-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={cn(
              "flex-1 py-3 text-[12px] font-black rounded-[18px] transition-all duration-300",
              activeTab === 'upcoming' ? "bg-white text-[#0088cc] shadow-md" : "text-white/60"
            )}
          > FAOL </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 py-3 text-[12px] font-black rounded-[18px] transition-all duration-300",
              activeTab === 'history' ? "bg-white text-[#0088cc] shadow-md" : "text-white/60"
            )}
          > TARIX </button>
        </div>
      </div>

      {/* 📋 LIST SECTION - Teacher Card kabi animatsiya qo'shildi */}
      <div className="p-5 space-y-4 max-w-lg mx-auto relative z-10">
        {currentList.length > 0 ? (
          currentList.map((b, index) => (
            <div 
              key={b.id}
              className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BookingCard
                id={b.id}
                teacherName={b.teacher_name}
                date={b.slot_date}
                time={b.slot_time.slice(0, 5)}
                status={b.status}
                stars={b.stars}
                review={b.review}
                onCancel={() => handleCancel(b.id)}
                onRate={() => handleOpenReview(b)}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-white rounded-[35px] shadow-xl flex items-center justify-center mb-6">
              <AlertCircle className="text-slate-200 w-10 h-10" />
            </div>
            <p className="text-slate-400 font-black text-lg italic">Ma'lumot topilmadi</p>
          </div>
        )}
      </div>

      {/* 🌟 REVIEW DIALOG */}
      <Dialog.Root open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 pb-10 shadow-2xl z-[1001] outline-none max-w-lg mx-auto animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
            <Dialog.Title className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 italic">
              <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" /> Baholash
            </Dialog.Title>
            <div className="mb-8 flex justify-center py-6 bg-slate-50 rounded-[30px] border border-slate-100 shadow-inner">
              <StarRating rating={rating} onChange={setRating} />
            </div>
            <textarea
              placeholder="Fikrlaringiz..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-[28px] p-5 text-sm font-bold text-slate-800 outline-none min-h-[120px] mb-8"
            />
            <div className="flex gap-3">
              <Dialog.Close asChild>
                <button className="flex-1 py-4.5 rounded-[22px] font-black text-slate-400 bg-slate-100 text-xs tracking-widest">BEKOR</button>
              </Dialog.Close>
              <button
                onClick={handleSubmitReview}
                disabled={actionLoading === selectedBooking?.id}
                className="flex-[2] py-4.5 rounded-[22px] bg-[#0088cc] text-white font-black shadow-lg text-xs tracking-widest uppercase"
              >
                {actionLoading === selectedBooking?.id ? 'YUBORILMOQDA...' : 'YUBORISH'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}