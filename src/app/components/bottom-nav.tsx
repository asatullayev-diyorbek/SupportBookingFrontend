import { Home, Calendar, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { cn } from '../lib/utils';
import { useMemo, useState, useEffect } from 'react';

export function BottomNav() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const items = useMemo(() => [
    { path: '/', regex: /^\/($|teacher\/)/, icon: Home },
    { path: '/bookings', regex: /^\/bookings/, icon: Calendar },
    { path: '/profile', regex: /^\/profile/, icon: User },
  ], []);

  useEffect(() => {
    const newIndex = items.findIndex(item => item.regex.test(location.pathname));
    if (newIndex !== activeIndex) {
      setIsMoving(true);
      setActiveIndex(newIndex);
      // Animatsiya tugagach holatni qaytaramiz
      setTimeout(() => setIsMoving(false), 500);
    }
  }, [location.pathname, items, activeIndex]);

  return (
    <div className="fixed bottom-3 left-0 right-0 flex justify-center z-50 pointer-events-auto px-6 font-sans">
      <nav className="relative flex items-center justify-between w-full max-w-[360px] h-[66px] bg-white/70 backdrop-blur-xl rounded-full p-1.5 border border-white/40 shadow-lg overflow-hidden">
        
        {/* 🪄 ELASTIK SHISHA (Worm Effect) */}
        <div 
          className={cn(
            "absolute h-[54px] rounded-full bg-[#0088cc]/15 border border-[#0088cc]/20 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
            isMoving ? "scale-x-125 opacity-80" : "scale-x-100 opacity-100"
          )}
          style={{
            width: `calc(${100 / items.length}% - 12px)`,
            left: `calc(${(activeIndex * 100) / items.length}% + 6px)`,
            transformOrigin: activeIndex > (items.findIndex(i => i.path === location.pathname)) ? "left" : "right"
          }}
        />

        {items.map((item, index) => {
          const Icon = item.icon;
          const active = activeIndex === index;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative z-10 flex flex-1 items-center justify-center h-full transition-all duration-300",
                active ? "text-[#0088cc]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className={cn(
                "w-6 h-6 transition-transform duration-300",
                active && "scale-110 stroke-[2.5px]"
              )} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}