import { useNavigate } from 'react-router';
import { ChevronRight, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  id: number;
  fullName: string;
  avatar?: string;
  branchTitle: string; // API dagi branch_title
  online: boolean;
}

export function TeacherCard({ id, fullName, avatar, branchTitle, online }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/teacher/${id}`)}
      className="w-full flex items-center justify-between p-4 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.03)] active:bg-gray-50 transition-all duration-300 rounded-[32px] group border border-white/50 mb-2 active:scale-[0.96]"
    >
      <div className="flex items-center gap-3">
        {/* AVATAR SECTION */}
        <div className="relative w-[68px] h-[68px] shrink-0">
          {/* Online nuri */}
          {online && (
            <div className="absolute -inset-1.5 bg-green-400/20 rounded-[26px] blur-lg animate-pulse" />
          )}
          
          <div className="relative w-full h-full overflow-hidden border-2 p-0.5 rounded-[50%] transition-transform duration-500 group-hover:scale-105">
            {avatar ? (
              <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-[#0088cc] text-2xl font-black">
                {fullName.charAt(0)}
              </div>
            )}
          </div>

          {/* STATUS DOT */}
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 w-5 h-5 border-[3.5px] border-white rounded-full shadow-md z-10 transition-colors",
            online ? "animate-ping bg-green-500" : "bg-gray-500"
          )} />
        </div>

        {/* INFO SECTION */}
        <div className="text-left">
          <h3 className="font-black text-gray-900 text-[18px] leading-tight tracking-tight group-hover:text-[#0088cc] transition-colors duration-300">
            {fullName}
          </h3>
          
          <div className="flex flex-col gap-2 mt-2">
            {/* FILIAL BADGE */}
            <div className="flex">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0088cc]/5 rounded-xl border border-[#0088cc]/10">
                <MapPin className="w-3.5 h-3.5 text-[#0088cc]" />
                <span className="text-[12px] font-bold text-[#0088cc]">
                  {branchTitle} filiali
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}