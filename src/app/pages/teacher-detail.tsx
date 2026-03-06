import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Clock, MessageCircle, Calendar as CalendarIcon, ChevronLeft, Award, Sparkles } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';

import { getSlots, Slot } from '../lib/slot';
import { getTeachers, Teacher } from '../lib/teacher';
import { createBooking } from '../lib/booking-create';
import { DateCalendar } from '../components/date-calendar';
import { SlotCard } from '../components/slot-card';
import { formatDate, cn } from '../lib/utils';

export default function TeacherDetailPage() {
  const { teacherId } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [isDataUpdating, setIsDataUpdating] = useState(false);

  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      const slotDateTime = new Date(`${slot.date}T${slot.time}`);
      return slotDateTime > new Date();
    });
  }, [slots]);

  const formattedDateAPI = useMemo(() => {
    return selectedDate.toLocaleDateString('ru-RU').replace(/\//g, '.');
  }, [selectedDate]);

  const loadData = useCallback(async (isInitial = false) => {
    if (!teacherId) return;
    try {
      if (isInitial) setLoading(true);
      else setIsDataUpdating(true);

      if (isInitial) {
        const teachers = await getTeachers(1);
        const found = teachers.find((t) => t.id === Number(teacherId));
        if (found) setTeacher(found);
      }

      const slotData = await getSlots(Number(teacherId), formattedDateAPI);
      setSlots(slotData || []);
    } catch {
      toast.error("Ma'lumot yuklanmadi");
    } finally {
      setLoading(false);
      setIsDataUpdating(false);
    }
  }, [teacherId, formattedDateAPI]);

  useEffect(() => { loadData(true); }, [teacherId]);

  useEffect(() => {
    if (!loading) loadData(false);
  }, [selectedDate]);

  const handleSlotClick = (slot: Slot) => {
    if (slot.is_full || slot.is_blocked || slot.is_booked) return;
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    try {
      setIsBooking(true);
      await createBooking(selectedSlot.id, comment);
      toast.success('Muvaffaqiyatli band qilindi');
      setIsModalOpen(false);
      setComment('');
      loadData(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Bookingda xatolik');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#0088cc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-32">
      
      {/* 🏙 PREMIUM HEADER */}
      <div className="relative bg-[#0088cc] pt-6 pb-16 px-6 rounded-b-[45px] shadow-xl shadow-[#0088cc]/20">
        {/* <button 
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-xl border border-white/20 active:scale-90"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button> */}

        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-[50%] overflow-hidden border-4 border-white/30">
              <img src={teacher.image_url} alt={teacher.full_name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              {teacher.full_name}
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5 opacity-90">
              <Sparkles className="w-3.5 h-3.5 text-blue-100" />
              <p className="text-[10px] font-black text-blue-50 uppercase tracking-widest">
                Yordamchi ustoz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 📅 CALENDAR (O'rtacha ixcham) */}
      <div className="mt-[-40px] px-5 relative z-10">
        <div className="bg-white rounded-[32px] p-2 shadow-xl shadow-slate-200/50 border border-white/50">
          <DateCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
      </div>

      {/* 🕒 SLOT SECTION */}
      <div className={cn(
        "px-5 mt-8 transition-all duration-300", 
        isDataUpdating ? "opacity-40 scale-[0.98]" : "opacity-100"
      )}>
        <div className="flex items-center justify-between mb-5 px-1">
          <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-5 bg-[#0088cc] rounded-full" />
            Vaqt tanlang
          </h2>
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-50">
            <span className="text-[10px] font-black text-[#0088cc] uppercase">
               {formatDate(selectedDate)}
            </span>
          </div>
        </div>

        {/* 1 qatorda 2ta ixcham slotlar */}
        <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {filteredSlots.length > 0 ? (
            filteredSlots.map((slot) => (
              <SlotCard
                key={slot.id}
                time={slot.time.slice(0, 5)}
                status={slot.status}
                bookedCount={slot.capacity - slot.available_places}
                capacity={slot.capacity}
                isFull={slot.is_full}
                isBlocked={slot.is_blocked}
                isBooked={slot.is_booked}
                onClick={() => handleSlotClick(slot)}
              />
            ))
          ) : (
            <div className="col-span-2 py-16 text-center bg-white rounded-[35px] border-2 border-dashed border-slate-100">
              <Clock className="w-12 h-12 text-slate-100 mx-auto mb-3" />
              <p className="text-slate-400 font-bold text-sm italic">Bo'sh darslar yo'q</p>
            </div>
          )}
        </div>
      </div>

      {/* 📝 CONFIRMATION MODAL (Drawer Style) */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000]" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[1001] outline-none max-w-lg mx-auto p-8 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
            
            <Dialog.Title className="text-2xl font-black text-slate-900 mb-6 leading-none">
              Tasdiqlash
            </Dialog.Title>
            
            {selectedSlot && (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[28px] border border-slate-100">
                  <div className="w-12 h-12 bg-[#0088cc] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0088cc]/20">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#0088cc] uppercase tracking-widest mb-1">Dars vaqti</p>
                    <p className="font-black text-slate-800 text-lg leading-none">
                      {formatDate(selectedDate)} - {selectedSlot.time.slice(0, 5)}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    placeholder="Izoh qoldiring..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] p-6 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:border-[#0088cc]/20 focus:bg-white outline-none min-h-[120px] resize-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Dialog.Close asChild>
                <button className="flex-1 py-4 rounded-2xl font-black text-slate-400 bg-slate-100 active:scale-95 transition-all text-xs tracking-widest">
                  BEKOR
                </button>
              </Dialog.Close>
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="flex-[2] py-4 rounded-2xl bg-[#0088cc] text-white font-black shadow-lg shadow-[#0088cc]/30 active:scale-95 transition-all disabled:opacity-50 text-xs tracking-widest"
              >
                {isBooking ? 'YUKLANMOQDA...' : 'TASDIQLASH'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}