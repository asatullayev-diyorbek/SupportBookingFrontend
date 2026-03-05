import { useEffect, useState } from 'react';
import { getMe } from '../lib/user';
import { logout } from '../lib/auth';
import { sendProfileComment } from '../lib/profile-comment';
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
  MessageSquare,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => {
        console.error("User yuklanishda xato:", err);
      });
  }, []);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f1f4]">
      <div className="w-10 h-10 border-4 border-[#0088cc] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const initials = `${user.first_name?.charAt(0)}`;

  return (
    <div className="min-h-screen bg-[#f1f1f4] pb-32">
      
      {/* 🔵 BLUE HEADER SECTION */}
      <div className="bg-[#0088cc] pt-5 pb-5 px-6 flex flex-col items-center shadow-lg rounded-b-[48px] relative z-0">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border-[3px] border-white/40 ring-4 ring-black/5">
             <span className="text-4xl font-black text-white tracking-tighter uppercase drop-shadow-md">
                {initials}
              </span>
          </div>
          <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 border-[4px] border-[#0088cc] rounded-full shadow-md" />
        </div>
        
        <h1 className="mt-5 text-[26px] font-black text-white tracking-tight text-center leading-tight">
          {user.first_name} {user.last_name}
        </h1>
        <p className="mt-2 text-blue-50 font-bold text-[13px] bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-[0.1em] backdrop-blur-sm border border-white/10">
          {user.role === 'student' ? 'O\'quvchi' : user.role === 'teacher' ? 'Ustoz' : 'Admin'}
        </p>
      </div>

      {/* 📱 INFO CARDS SECTION */}
      <div className="mt-5 space-y-7 px-4 max-w-lg mx-auto relative z-10">
        
        <div className="space-y-2">
          <p className="ml-5 text-[11px] font-black text-gray/90 uppercase tracking-[0.2em] drop-shadow-sm">Asosiy ma'lumotlar</p>
          <div className="bg-white rounded-[32px] overflow-hidden border border-white shadow-xl shadow-black/5">
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
          <p className="ml-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Yordam va aloqa</p>
          <div className="bg-white rounded-[32px] overflow-hidden border border-white shadow-sm">
            <ProfileItem 
              icon={<MessageSquareHeart className="w-5 h-5 text-pink-500" />} 
              label="Fikr va mulohazalar" 
              value="Taklif yuborish" 
              onClick={() => setIsFeedbackOpen(true)}
            />
            <ProfileItem 
              icon={<Phone className="w-5 h-5 text-emerald-500" />} 
              label="Yordam markazi" 
              value="+998 71 200 00 00" 
              isLast={true} 
            />
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center justify-between px-6 bg-white text-red-500 py-5 rounded-[32px] font-black shadow-lg shadow-black/5 border border-white active:scale-95 active:bg-red-50 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-red-50 p-2.5 rounded-2xl group-active:scale-90 transition-transform">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[17px] tracking-tight">Tizimdan chiqish</span>
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
      <div className="flex-1">
        <p className="text-[16px] text-gray-900 font-black leading-none mb-1.5 tracking-tight">
          {value}
        </p>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
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
      await sendProfileComment({
        star: rating,
        comment: comment.trim()
      });

      toast.success("Rahmat! Fikringiz qabul qilindi.");
      onOpenChange(false);
      setRating(0);
      setComment('');
    } catch (err: any) {
      const msg = err?.message || "Xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-2xl z-[101] outline-none max-w-lg mx-auto flex flex-col animate-in slide-in-from-bottom duration-500">
          <div className="p-8">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8 opacity-50" />
            <Dialog.Title className="text-[24px] font-black text-gray-900 text-center mb-1">
              Fikringiz
            </Dialog.Title>
            <p className="text-gray-400 text-center text-sm mb-8 font-medium">
              Ilovani baholang va taklifingizni yozing
            </p>

            <div className="flex justify-center gap-2 mb-10">
              {[1, 2, 3, 4, 5].map((s) => (
                <button 
                  key={s} 
                  type="button"
                  onClick={() => setRating(s)} 
                  className="active:scale-90 transition-transform p-1 outline-none"
                >
                  <Star className={cn("w-10 h-10 transition-all", s <= rating ? "fill-yellow-400 text-yellow-400 drop-shadow-lg" : "text-gray-200")} />
                </button>
              ))}
            </div>

            <div className="relative mb-8 group">
              <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-gray-300 group-focus-within:text-[#0088cc] transition-colors" />
              <textarea
                placeholder="Taklif yoki izohingiz..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-gray-50 rounded-[24px] p-5 pl-12 text-[15px] font-bold outline-none focus:bg-white border-2 border-transparent focus:border-[#0088cc]/10 transition-all min-h-[120px] resize-none text-gray-800"
              />
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => onOpenChange(false)} 
                className="flex-1 py-4.5 rounded-[22px] font-black text-gray-400 bg-gray-50 active:scale-95 transition-all text-[11px] tracking-[0.1em]"
              >
                YOPISH
              </button>
              <button 
                type="button"
                onClick={handleSubmit} 
                disabled={loading || rating === 0} 
                className="flex-[2] py-4.5 rounded-[22px] bg-[#0088cc] text-white font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-[11px] tracking-[0.1em] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'YUBORISH'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}