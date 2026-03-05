import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router';
import { Clock, MessageCircle, Calendar as CalendarIcon } from 'lucide-react';
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

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  // Yuklanish statelarini ajratamiz
  const [loading, setLoading] = useState(true); // Birinchi marta kirganda
  const [isDataUpdating, setIsDataUpdating] = useState(false); // Sana o'zgarganda

  // Slotlarni filtrlash (faqat kelajakdagi vaqtlarni ko'rsatish)
  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      const slotDateTime = new Date(`${slot.date}T${slot.time}`);
      const now = new Date();
      return slotDateTime > now;
    });
  }, [slots]);

  // API uchun sanani formatlash (ru-RU orqali 12.05.2024 ko'rinishida)
  const formattedDateAPI = useMemo(() => {
    return selectedDate.toLocaleDateString('ru-RU').replace(/\//g, '.');
  }, [selectedDate]);

  // Ma'lumotlarni yuklash funksiyasi
  const loadData = useCallback(async (isInitial = false) => {
    if (!teacherId) return;
    try {
      if (isInitial) setLoading(true);
      else setIsDataUpdating(true);

      // O'qituvchi ma'lumotlarini faqat birinchi marta yuklaymiz
      if (isInitial) {
        const teachers = await getTeachers(1);
        const found = teachers.find((t) => t.id === Number(teacherId));
        if (found) setTeacher(found);
      }

      // Slotlarni har doim yuklaymiz
      const slotData = await getSlots(Number(teacherId), formattedDateAPI);
      setSlots(slotData || []);
    } catch {
      toast.error("Ma'lumot yuklanmadi");
    } finally {
      setLoading(false);
      setIsDataUpdating(false);
    }
  }, [teacherId, formattedDateAPI]);

  // Birinchi marta yuklash (Faqat teacherId o'zgarganda)
  useEffect(() => {
    loadData(true);
  }, [teacherId]);

  // Faqat sana o'zgarganda yuklash
  useEffect(() => {
    if (!loading) {
      loadData(false);
    }
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
      loadData(false); // Faqat slotlarni yangilash
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Bookingda xatolik');
    } finally {
      setIsBooking(false);
    }
  };

  // Full screen loading faqat birinchi marta chiqadi
  if (loading || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="w-10 h-10 border-4 border-[#0088cc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] pb-32">
      {/* 🟦 HEADER */}
      <div className="sticky top-0 mb-7 z-40 bg-[#0088cc] text-white px-5 pt-6 pb-12 rounded-b-[40px] shadow-lg">
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-white/20 shadow-xl">
            <img src={teacher.image_url} alt={teacher.full_name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight leading-tight">{teacher.full_name}</h1>
            <p className="text-blue-100/80 text-xs font-bold uppercase tracking-widest mt-1 italic">
              Professional o'qituvchi
            </p>
          </div>
        </div>
      </div>

      {/* 📅 CALENDAR (O'zgarmas qism) */}
      <div className="mt-[-40px] px-5 relative z-10">
        <div className="bg-white rounded-[32px] p-2 shadow-2xl shadow-blue-900/5 border border-white">
          <DateCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
      </div>

      {/* 🕒 SLOT SECTION (Yangilanayotgan qism) */}
      <div className={cn(
        "transition-all duration-300", 
        isDataUpdating ? "opacity-40 grayscale-[0.5] pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
      )}>
        <div className="max-w-lg mx-auto px-6 mt-8 mb-4 flex items-center justify-between">
          <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0088cc]" /> 
            {isDataUpdating ? "Yangilanmoqda..." : "Vaqt tanlang"}
          </h2>
          <span className="text-[10px] font-black text-[#0088cc] bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-wider">
            {formatDate(selectedDate)}
          </span>
        </div>

        <div className="max-w-lg mx-auto px-5">
          {filteredSlots.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredSlots.map((slot) => (
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
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-gray-100 mx-auto">
              <Clock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-bold italic">Bu kun uchun darslar topilmadi</p>
            </div>
          )}
        </div>
      </div>

      {/* 📝 CONFIRMATION MODAL */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[101] outline-none max-w-lg mx-auto p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            
            <Dialog.Title className="text-2xl font-black text-gray-900 mb-6">Tasdiqlash</Dialog.Title>
            
            {selectedSlot && (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                  <CalendarIcon className="w-6 h-6 text-[#0088cc]" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Dars vaqti</p>
                    <p className="font-bold text-gray-800">{formatDate(selectedDate)} • {selectedSlot.time.slice(0, 5)}</p>
                  </div>
                </div>

                <div className="relative">
                  <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    placeholder="Izoh qoldiring..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-[#0088cc]/20 outline-none min-h-[120px] resize-none"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Dialog.Close asChild>
                <button className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 active:scale-95 transition-all">
                  BEKOR QILISH
                </button>
              </Dialog.Close>
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="flex-[2] py-4 rounded-2xl bg-[#0088cc] text-white font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-50"
              >
                {isBooking ? 'BAND QILINMOQDA...' : 'TASDIQLASH'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}