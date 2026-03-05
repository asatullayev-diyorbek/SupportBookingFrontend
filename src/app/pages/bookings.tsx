import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { History, CalendarCheck, Star, MessageSquare, TicketCheck } from 'lucide-react';

import { getMyBookings, MyBooking } from '../lib/booking';
import { cancelBooking, reviewBooking } from '../lib/booking-create';
import { BookingCard } from '../components/booking-card';
import { StarRating } from '../components/star-rating';
import { cn } from '../lib/utils';

export default function BookingsPage() {
  // 1. Dastlabki qiymatni [] qilib belgilaymiz (Xatolikni oldini oladi)
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
      setBookings(data || []); // data undefined bo'lsa ham [] beradi
    } catch {
      toast.error("Ma'lumotlar yuklanmadi");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  // 2. Filter mantiqini xavfsizroq (optional chaining) qilish
  const upcoming = (bookings || []).filter((b) => b.status === 'booked');
  const history = (bookings || []).filter((b) => b.status !== 'booked');

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
    if (!selectedBooking || rating === 0) {
      toast.error('Iltimos, yulduzcha tanlang');
      return;
    }
    try {
      setActionLoading(selectedBooking.id);
      await reviewBooking(selectedBooking.id, rating, reviewText);
      setBookings((prev) => prev.map((b) => b.id === selectedBooking.id ? { ...b, stars: rating, review: reviewText } : b));
      toast.success('Rahmat! Baholash yuborildi');
      setReviewModalOpen(false);
    } catch {
      toast.error('Baholashda xatolik');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
      <div className="w-10 h-10 border-4 border-[#0088cc] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] pb-32">
      {/* 🌊 LIQUID TAB HEADER */}
      <div className="sticky top-0 z-40 bg-[#0088cc] px-6 pt-8 pb-6 rounded-b-[32px] shadow-lg shadow-blue-500/10">
        <div className="flex items-center gap-2 mb-4">
           <TicketCheck className="w-5 h-5 text-blue-200" />
           <h1 className="text-xl font-black text-white tracking-tight">Qo'shimcha darslar</h1>
        </div>
        
        <div className="flex bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/5">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={cn(
              "flex-1 py-2.5 text-[13px] font-black rounded-xl transition-all duration-500 z-10 flex items-center justify-center gap-2",
              activeTab === 'upcoming' ? "bg-white text-[#0088cc] shadow-md scale-100" : "text-white/70 scale-95 opacity-80"
            )}
          >
            <CalendarCheck className="w-4 h-4" /> FAOL
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 py-2.5 text-[13px] font-black rounded-xl transition-all duration-500 z-10 flex items-center justify-center gap-2",
              activeTab === 'history' ? "bg-white text-[#0088cc] shadow-md scale-100" : "text-white/70 scale-95 opacity-80"
            )}
          >
            <History className="w-4 h-4" /> TARIX
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4 max-w-lg mx-auto">
        {(activeTab === 'upcoming' ? upcoming : history).length > 0 ? (
          (activeTab === 'upcoming' ? upcoming : history).map((b, idx) => (
            <div 
               key={b.id} 
               className="animate-in fade-in slide-in-from-bottom-4 duration-500"
               style={{ animationDelay: `${idx * 60}ms` }}
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
          <div className="flex flex-col items-center justify-center py-24 animate-in zoom-in-95 duration-700">
            <div className="w-20 h-20 bg-gray-100 rounded-[35px] flex items-center justify-center mb-5 rotate-12">
               <CalendarCheck className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-400 font-black text-lg">Ma'lumot topilmadi</p>
            <p className="text-gray-300 text-sm mt-1 italic">Hozircha hech qanday dars mavjud emas</p>
          </div>
        )}
      </div>

      {/* 🌟 REVIEW DIALOG (Radix UI) */}
      <Dialog.Root open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-[#1c1c1c]/60 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 shadow-2xl z-[101] animate-in slide-in-from-bottom duration-700 outline-none">
            <div className="w-14 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
            
            <Dialog.Title className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
              <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
              Baholash
            </Dialog.Title>
            <p className="text-gray-400 font-medium mb-8">Dars qanday o'tdi? Ustozni baholang:</p>

            <div className="flex justify-center mb-8 bg-gray-50/50 py-8 rounded-[32px] border border-gray-100 shadow-inner">
              <StarRating rating={rating} onChange={setRating} />
            </div>

            <div className="relative mb-8">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <textarea
                placeholder="Fikr va mulohazalaringiz..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-gray-50/80 border-2 border-transparent focus:border-[#0088cc]/10 rounded-[24px] p-5 pl-12 text-[15px] font-bold text-gray-800 outline-none transition-all placeholder:text-gray-300"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Dialog.Close asChild>
                <button className="flex-1 py-4.5 rounded-[22px] font-black text-gray-400 bg-gray-50 active:scale-95 transition-all">
                  YOPISH
                </button>
              </Dialog.Close>
              <button
                onClick={handleSubmitReview}
                disabled={actionLoading === selectedBooking?.id}
                className="flex-[2] py-4.5 rounded-[22px] bg-[#0088cc] text-white font-black shadow-xl shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-50"
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