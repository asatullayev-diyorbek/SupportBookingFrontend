import { useEffect, useRef, memo } from 'react'; // memo qo'shildi
import { format, isToday } from 'date-fns';
import { uz } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

// Komponentni memo bilan o'raymiz
export const DateCalendar = memo(({ selectedDate, onDateChange }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Kunlarni har safar renderda qayta hisoblamaslik uchun useMemo ichiga olish ham mumkin
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Vaqtni nolga tushiramiz (taqqoslashda xato qilmaslik uchun)
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = activeRef.current;
    
      // Elementning konteynerga nisbatan markazda bo'lishini hisoblash
      const targetScrollPos = element.offsetLeft - (container.offsetWidth / 2) + (element.offsetWidth / 2);
      
      container.scrollTo({
        left: targetScrollPos,
        behavior: 'smooth'
      });
    }
    // Faqat tanlangan sana o'zgargandagina scroll qiladi
  }, [selectedDate.toDateString()]); 

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f8f9fb] via-[#f8f9fb]/80 to-transparent z-10 pointer-events-none rounded-r-[32px]" />
      
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 pt-2 px-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {days.map((day) => {
          const isActive = day.toDateString() === selectedDate.toDateString();
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              ref={isActive ? activeRef : null}
              type="button" // Form ichida bo'lsa, refresh bermasligi uchun
              onClick={(e) => {
                e.preventDefault(); // Sahifa refreshini to'xtatish
                onDateChange(day);
              }}
              className={cn(
                'min-w-[68px] py-4 rounded-[24px] text-center transition-all duration-300 relative active:scale-95 flex flex-col items-center gap-1 snap-center',
                isActive 
                  ? 'bg-[#0088cc] text-white scale-105 z-20 shadow-lg shadow-[#0088cc]/20' 
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              )}
            >
              <div className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "text-blue-100" : "text-gray-400")}>
                {format(day, 'EEE', { locale: uz })}
              </div>
              <div className="text-xl font-black leading-none tracking-tighter">
                {format(day, 'dd')}
              </div>
              
              {today && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full absolute bottom-2",
                  isActive ? "bg-white" : "bg-[#0088cc] animate-pulse"
                )} />
              )}
            </button>
          );
        })}
        <div className="min-w-[40px] shrink-0" />
      </div>
    </div>
  );
});

DateCalendar.displayName = 'DateCalendar';