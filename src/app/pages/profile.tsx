import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  LogOut, 
  Building2, 
  Phone, 
  ChevronRight, 
  MessageSquareHeart, 
  Hash, 
  Users, 
  Star, 
  MessageSquare 
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';

import { getMe } from '../lib/user';
import { logout } from '../lib/auth';
import { sendProfileComment } from '../lib/profile-comment';
import { cn } from '../lib/utils';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => console.error("User yuklanishda xato:", err));
  }, []);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f1f4]">
      <div className="w-10 h-10 border-4 border-[#0088cc] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const initials = `${user.first_name?.charAt(0)}`;

  return (
    <div className="min-h-screen bg-[#f1f1f4] pb-32">
      
      {/* 🔵 HEADER SECTION */}
      <div className="bg-[#0088cc] pt-10 pb-8 px-6 flex flex-col items-center shadow-lg rounded-b-[48px] relative z-0">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border-[3px] border-white/40">
             <span className="text-3xl font-black text-white uppercase">
                {initials}
              </span>
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-[3px] border-[#0088cc] rounded-full shadow-md" />
        </div>
        
        <h1 className="mt-4 text-[22px] font-black text-white text-center leading-tight">
          {user.first_name} {user.last_name}
        </h1>
        <p className="mt-1 text-blue-50 font-bold text-[12px] bg-white/10 px-4 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
          {user.role === 'student' ? 'O\'quvchi' : user.role === 'teacher' ? 'Ustoz' : 'Admin'}
        </p>
      </div>

      {/* 📱 INFO CARDS SECTION */}
      <div className="mt-6 space-y-6 px-4 max-w-lg mx-auto relative z-10">
        
        <div className="space-y-2">
          <p className="ml-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Asosiy ma'lumotlar</p>
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-white">
            <ProfileItem 
              icon={<Hash className="w-5 h-5 text-blue-500" />} 
              label="ID raqamingiz" 
              value={`#${user.profile?.hh_id || 'ID yo\'q'}`} 
            />
            <ProfileItem 
              icon={<Building2 className="w-5 h-5 text-orange-500" />} 
              label="Filial" 
              value={user.branch?.title || 'Noma\'lum filial'} 
            />
            <ProfileItem 
              icon={<Users className="w-5 h-5 text-purple-500" />} 
              label="Faol guruh" 
              value={user.profile?.active_group || 'Guruh biriktirilmagan'} 
              isLast={true} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="ml-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Yordam va aloqa</p>
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-white">
            <ProfileItem 
              icon={<MessageSquareHeart className="w-5 h-5 text-pink-500" />} 
              label="Fikr va mulohazalar" 
              value="Taklif yuborish" 
              onClick={() => setIsFeedbackOpen(true)}
            />
            <ProfileItem 
              icon={<Phone className="w-5 h-5 text-emerald-500" />} 
              label="Yordam markazi" 
              value="+998 90 777 05 12" 
              isLast={true} 
            />
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center justify-between px-6 bg-white text-red-500 py-5 rounded-[32px] font-black shadow-sm border border-white active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-red-50 p-2.5 rounded-2xl">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[16px]">Tizimdan chiqish</span>
          </div>
          <ChevronRight className="w-5 h-5 opacity-20" />
        </button>
      </div>

      <FeedbackModal open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
    </div>
  );
}

function ProfileItem({ icon, label, value, isLast, onClick }: any) {
  return (
    <div 
      onClick={onClick} 
      className={cn(
        "flex items-center gap-5 px-6 py-5 active:bg-gray-50 transition-all", 
        onClick ? "cursor-pointer" : "cursor-default", 
        !isLast && "border-b border-gray-50"
      )}
    >
      <div className="shrink-0 p-2.5 bg-gray-50 rounded-[18px]">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-[16px] text-gray-900 font-black leading-tight mb-1">
          {value}
        </p>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-200" />
    </div>
  );
}

function FeedbackModal({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Iltimos, baho bering");
    setLoading(true);
    try {
      await sendProfileComment({ star: rating, comment: comment.trim() });
      toast.success("Fikringiz qabul qilindi.");
      onOpenChange(false);
      setRating(0);
      setComment('');
    } catch (err: any) {
      toast.error(err?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Z-INDEX TUZATILDI: 1000 Navbar ustida bo'lishi uchun */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[1001] outline-none max-w-lg mx-auto p-8 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-500">
          <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-8" />
          <Dialog.Title className="text-[22px] font-black text-gray-900 text-center mb-6">Fikringiz</Dialog.Title>
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className="active:scale-90 transition-transform">
                <Star className={cn("w-10 h-10 transition-all", s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Izohingiz..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-50 rounded-[24px] p-5 text-[15px] font-bold outline-none mb-8 min-h-[120px] resize-none border-2 border-transparent focus:border-gray-100"
          />
          <div className="flex gap-3">
            <button onClick={() => onOpenChange(false)} className="flex-1 py-4.5 rounded-[22px] font-black text-gray-400 bg-gray-50 text-[11px] tracking-widest uppercase">YOPISH</button>
            <button onClick={handleSubmit} disabled={loading || rating === 0} className="flex-[2] py-4.5 rounded-[22px] bg-[#0088cc] text-white font-black text-[11px] tracking-widest uppercase disabled:opacity-50">
              {loading ? 'Yuborilmoqda...' : 'YUBORISH'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}