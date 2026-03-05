import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../lib/auth';
import { toast } from 'sonner';

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
      toast.error(
        error?.response?.data?.message ||
          'Login xatolik'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-semibold mb-6 text-center">
          Tizimga kirish
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border rounded-xl p-3 mb-4"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Parol"
          className="w-full border rounded-xl p-3 mb-6"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? 'Yuklanmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}