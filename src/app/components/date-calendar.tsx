import { useEffect, useRef, memo, useMemo } from 'react';
import { format, isToday, startOfDay } from 'date-fns';
import { uz } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateCalendar = memo(({ selectedDate, onDateChange }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Kunlarni useMemo bilan xotirada saqlaymiz (14 kun juda ko'p emas, lekin tartib uchun yaxshi)
  const days = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      return startOfDay(new Date(d.setDate(d.getDate() + i)));
    });
  }, []);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = activeRef.current;
      const targetScrollPos = element.offsetLeft - (container.offsetWidth / 2) + (element.offsetWidth / 2);
      
      container.scrollTo({
        left: targetScrollPos,
        behavior: 'smooth'
      });
    }
  }, [selectedDate.toDateString()]); 

  return (
    <div className="relative bg-white/50 backdrop-blur-sm py-2">
      {/* O'ng tarafdagi yumshoq gradient (ixchamroq) */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 px-4 no-scrollbar scroll-smooth snap-x"
      >
        {days.map((day) => {
          const isActive = day.toDateString() === selectedDate.toDateString();
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              ref={isActive ? activeRef : null}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onDateChange(day);
              }}
              className={cn(
                // O'lchamlar ixchamlashtirildi: min-w-[56px], py-2.5
                'min-w-[54px] py-2.5 rounded-[18px] text-center transition-all duration-200 relative active:scale-95 flex flex-col items-center gap-0.5 snap-center border',
                isActive 
                  ? 'bg-[#0088cc] text-white border-[#0088cc] shadow-md shadow-[#0088cc]/15' 
                  : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
              )}
            >
              {/* Hafta kuni (kichikroq) */}
              <span className={cn(
                "text-[9px] font-semibold uppercase tracking-tight", 
                isActive ? "text-blue-100/80" : "text-gray-400"
              )}>
                {format(day, 'EEE', { locale: uz })}
              </span>
              
              {/* Sana (ixchamroq) */}
              <span className="text-base font-bold tabular-nums">
                {format(day, 'dd')}
              </span>
              
              {/* "Bugun" belgisi (nuqta o'rniga chiziqcha ixchamroq ko'rinadi) */}
              {today && (
                <div className={cn(
                  "w-3 h-0.5 rounded-full absolute bottom-1.5",
                  isActive ? "bg-white/60" : "bg-[#0088cc]"
                )} />
              )}
            </button>
          );
        })}
        {/* Oxiridagi bo'sh joy */}
        <div className="min-w-[20px] shrink-0" />
      </div>
    </div>
  );
});

DateCalendar.displayName = 'DateCalendar';