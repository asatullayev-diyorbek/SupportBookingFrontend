import { useEffect, useState } from 'react';
import { getMe, Me } from '../lib/user';
import { getTeachers, Teacher } from '../lib/teacher';
import { TeacherCard } from '../components/teacher-card';
import { toast } from 'sonner';
import { Search, X, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export default function HomePage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [branchName, setBranchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [user, setUser] = useState<Me | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const meData = await getMe();
        setUser(meData); // Foydalanuvchi ma'lumotlarini saqlaymiz
        const data = await getTeachers(meData.branch.id);
        setTeachers(data);
      } catch {
        toast.error("Ma'lumot yuklanmadi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getRoleLabel = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'student': return 'O\'quvchi';
      case 'teacher': return 'O\'qituvchi';
      case 'admin': return 'Admin';
      default: return role || 'Foydalanuvchi';
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    t.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8f9fb]">
       <div className="w-10 h-10 border-4 border-[#0088cc] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] pb-32">
      
      {/* 🌊 LIQUID STICKY HEADER */}
      <div className={cn(
        "sticky top-0 z-40 ease-[cubic-bezier(0.23,1,0.32,1)]",
        isFocused 
          ? "bg-white/90 backdrop-blur-2xl px-4 py-4 shadow-sm border-b border-gray-100" 
          : "bg-[#0088cc] px-5 pt-4 pb-6 shadow-lg rounded-b-[32px]"
      )}>
        
        <div className="max-w-2xl mx-auto overflow-hidden">
          {/* 1. TEPAGI QISM (FILIAL + LOGO) */}
          <div className={cn(
            "flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
            isFocused 
              ? "opacity-0 -translate-y-full mb-0 max-h-0" 
              : "opacity-100 translate-y-0 mb-6 max-h-20"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-[19px] font-black text-white leading-tight tracking-tight">
                  {user?.branch.title}
                </h1>
                <p className="text-[11px] font-bold text-blue-100/80 uppercase tracking-widest">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            </div>
            
            {/* ROBBIT LOGO */}
            <div className="w-[110px] h-11 bg-white rounded-2xl p-2.5 flex items-center justify-center shadow-md">
              <img 
                src="/logo-robbit.png" 
                alt="Robbit Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* 2. QIDIRUV QATORI */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 group">
              <Search className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-all duration-300",
                isFocused ? "text-[#0088cc]" : "text-white/70"
              )} />
              
              <input
                type="text"
                placeholder="Ustozni qidirish..."
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => !searchQuery && setIsFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full rounded-2xl py-3 pl-11 pr-11 text-[15px] font-bold transition-all duration-500 outline-none border-2",
                  isFocused 
                    ? "bg-gray-100 border-[#0088cc]/20 text-gray-900 shadow-inner" 
                    : "bg-white/15 border-transparent text-white placeholder:text-blue-50/50"
                )}
              />

              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200/50 rounded-lg active:scale-90 transition-transform"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Cancel Button */}
            {isFocused && (
              <button 
                onClick={() => {
                  setIsFocused(false);
                  setSearchQuery('');
                }}
                className="text-[15px] font-bold text-[#0088cc] animate-in slide-in-from-right-4 duration-500"
              >
                ✖️
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📋 LIST SECTION */}
      <div className="px-5 mt-6 space-y-4 max-w-2xl mx-auto">
        
        {!isFocused && (
          <div className="flex items-center justify-between px-1 animate-in fade-in duration-500">
            <h2 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.15em]">
              Sizning filial
            </h2>
            <div className="h-[1px] flex-1 bg-gray-200 mx-4 opacity-50" />
            <span className="text-[12px] font-black text-[#0088cc]">
              {filteredTeachers.length} ustoz
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((t, idx) => (
              <div 
                key={t.id} 
                className="animate-in fade-in slide-in-from-bottom-3 duration-500"
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
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <div className="w-20 h-20 bg-gray-100 rounded-[35px] flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-gray-300" />
               </div>
               <p className="text-gray-400 font-bold">Qidiruv natija bermadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}