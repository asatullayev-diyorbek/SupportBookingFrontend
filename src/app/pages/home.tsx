import { useEffect, useState } from 'react';
import { getMe, Me } from '../lib/user';
import { getTeachers, Teacher } from '../lib/teacher';
import { TeacherCard } from '../components/teacher-card';
import { toast } from 'sonner';
import { Search, X, Sparkles, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export default function HomePage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [user, setUser] = useState<Me | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const meData = await getMe();
        setUser(meData);
        const data = await getTeachers(meData.branch.id);
        setTeachers(data);
      } catch (error) {
        toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredTeachers = teachers.filter((t) =>
    t.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-32">
      
      {/* 🏙 FIXED HEIGHT BRANDED HEADER */}
      {/* min-h-[160px] orqali sahifa yuklanganda header joyi band qilib qo'yiladi */}
      <div className={cn(
        "sticky top-0 z-40 transition-all duration-300 ease-in-out",
        isFocused || searchQuery
          ? "bg-white px-4 py-3 shadow-md border-b border-gray-100 min-h-[70px]" 
          : "bg-[#0088cc] px-5 pt-6 pb-7 rounded-b-[28px] shadow-lg shadow-[#0088cc]/15 min-h-[160px]"
      )}>
        
        <div className="max-w-2xl mx-auto w-full">
          
          {/* USER INFO SECTION */}
          {!isFocused && !searchQuery && (
            <div className="flex items-center justify-between mb-6 h-11">
              {user ? (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-[17px] font-bold text-white leading-tight">
                      {user.branch.title}
                    </h1>
                    <p className="text-[10px] font-bold text-blue-100/70 uppercase tracking-widest mt-0.5">
                      {user.role === 'student' ? "O'quvchi" : user.role} paneli
                    </p>
                  </div>
                </div>
              ) : (
                /* Header yuklanayotgan paytdagi Skeleton */
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-white/10 rounded-xl" />
                  <div className="space-y-1.5">
                    <div className="w-28 h-4 bg-white/10 rounded-md" />
                    <div className="w-16 h-3 bg-white/10 rounded-md" />
                  </div>
                </div>
              )}
              
              <div className="bg-white/90 p-1.5 rounded-[8px] shadow-sm shrink-0">
                <img src="/logo-robbit.png" alt="Logo" className="h-6 w-[100px] h-[30px] object-contain" />
              </div>
            </div>
          )}

          {/* SEARCH BAR SECTION */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 group">
              <Search className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                isFocused || searchQuery ? "text-[#0088cc]" : "text-white/60"
              )} />
              
              <input
                type="text"
                placeholder="Ustozni qidirish..."
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => !searchQuery && setIsFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full rounded-[16px] py-2.5 pl-10 pr-10 text-sm transition-all duration-300 outline-none font-medium",
                  isFocused || searchQuery
                    ? "bg-slate-100 border border-[#0088cc]/10 text-slate-900 shadow-inner" 
                    : "bg-white/15 border border-white/5 text-white placeholder:text-blue-50/40"
                )}
              />

              {(searchQuery || isFocused) && (
                <button 
                  onClick={() => {setSearchQuery(''); setIsFocused(false);}}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all active:scale-90",
                    isFocused || searchQuery ? "bg-slate-200 text-slate-500" : "bg-white/10 text-white"
                  )}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📋 MAIN CONTENT SECTION */}
      <div className="px-5 mt-7 space-y-4 max-w-2xl mx-auto">
        
        {/* LIST HEADER */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-[#0088cc] rounded-full" />
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Sizning filial
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#0088cc] bg-[#0088cc]/8 px-2.5 py-1 rounded-lg">
            {loading ? "..." : filteredTeachers.length} ta ustoz
          </span>
        </div>

        {/* TEACHERS GRID / LIST */}
        <div className="grid grid-cols-1 gap-3.5">
          {loading ? (
            /* Ro'yxat yuklanayotganda Skeleton ko'rsatish */
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="w-full h-[88px] bg-white rounded-2xl border border-gray-100 animate-pulse flex items-center px-4 gap-4">
                <div className="w-14 h-14 bg-slate-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-slate-100 rounded" />
                  <div className="w-20 h-3 bg-slate-100 rounded" />
                </div>
              </div>
            ))
          ) : filteredTeachers.length > 0 ? (
            filteredTeachers.map((t, idx) => (
              <div 
                key={t.id} 
                className="animate-in fade-in slide-in-from-bottom-2 duration-500" 
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <TeacherCard
                  id={t.id}
                  fullName={t.full_name}
                  avatar={t.image_url}
                  branchTitle={t.branch_title}
                  online={t.online}
                />
              </div>
            ))
          ) : (
            /* Qidiruv natijasi topilmagandagi holat */
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <div className="w-20 h-20 bg-slate-100 rounded-[30px] flex items-center justify-center mb-4">
                  <Search className="w-9 h-9 text-slate-300" />
               </div>
               <p className="text-slate-400 font-bold text-sm">Hech kim topilmadi</p>
               <button 
                 onClick={() => setSearchQuery('')}
                 className="mt-2 text-[#0088cc] text-xs font-bold underline"
               >
                 Filtrlarni tozalash
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}