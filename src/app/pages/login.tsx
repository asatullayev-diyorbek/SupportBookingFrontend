import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../lib/auth';
import { toast } from 'sonner';
import { Loader2, Lock, User } from 'lucide-react'; // Ikonkalar qo'shildi

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Ma'lumotlarni to'ldiring");
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      toast.success('Xush kelibsiz!');
      navigate('/', { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-6">
      <div className="w-full max-w-[360px]"> {/* Konteyner yanada ixchamlashdi */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Xush kelibsiz
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Tizimga kirish uchun ma'lumotlarni kiriting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Foydalanuvchi nomi"
              className="w-full bg-white border border-slate-100 rounded-[18px] pl-11 pr-4 py-3.5 text-sm outline-none focus:border-[#0088cc] focus:ring-4 focus:ring-[#0088cc]/5 transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              placeholder="Parol"
              className="w-full bg-white border border-slate-100 rounded-[18px] pl-11 pr-4 py-3.5 text-sm outline-none focus:border-[#0088cc] focus:ring-4 focus:ring-[#0088cc]/5 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            className="w-full bg-[#0088cc] text-white py-3.5 rounded-[18px] font-bold text-sm shadow-lg shadow-[#0088cc]/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Yuklanmoqda...
              </>
            ) : (
              'Tizimga kirish'
            )}
          </button>
        </form>
        
        <p className="text-center mt-8 text-xs text-slate-400">
          © {new Date().getFullYear()} Asatullayev Support Booking System
        </p>
      </div>
    </div>
  );
}