import QRCode from "react-qr-code";
import { 
  FiMapPin, 
  FiTrendingUp, 
  FiShoppingCart, 
  FiStar, 
  FiBell, 
  FiUser,
  FiAward,
  FiPackage
} from "react-icons/fi";
import { motion } from "framer-motion";

type SidebarProps = {
  Users: any;
  component: (name: string) => void;
};

export default function Sidebar({ Users, component }: SidebarProps) {
  const menuItems = [
    { id: 'locate customer', label: 'Smart Routing', icon: FiMapPin, color: 'text-blue-500 dark:text-blue-400' },
    { id: 'leaderboard', label: 'Leaderboard', icon: FiTrendingUp, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'preorder', label: 'Pre-Order Stock', icon: FiPackage, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'update', label: 'Update Inventory', icon: FiShoppingCart, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'reviews', label: 'Customer Reviews', icon: FiStar, color: 'text-amber-500 dark:text-yellow-400' },
    { id: 'demand alerts', label: 'Demand Alerts', icon: FiBell, color: 'text-rose-600 dark:text-red-400' },
  ];

  return (
    <aside className="w-full h-full flex flex-col gap-3 sm:gap-4 md:gap-6 ">
      {/* Profile Section Card */}
      <div className="bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl dark:shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 transition-all duration-500"></div>
        
        <div className="flex flex-col items-center gap-3 sm:gap-4 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 blur-xl rounded-full scale-125"></div>
            <img
              className="h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 rounded-full border-4 border-white dark:border-emerald-500/30 object-cover relative z-10 shadow-lg"
              src={Users.image || "/assets/man.png"}
              alt="Profile"
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 border-4 border-white dark:border-[#1E293B] rounded-full"></div>
          </div>

          <div className="text-center">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-white tracking-tight">{Users.phone}</h2>
            <p className="text-[8px] sm:text-[10px] text-slate-500 dark:text-gray-400 font-mono mt-1 opacity-70 uppercase tracking-widest">Vendor Account</p>
          </div>

          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl py-2 px-3 sm:px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiAward className="text-amber-500 text-sm sm:text-base" />
                <span className="text-[8px] sm:text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Credits</span>
              </div>
              <span className="text-base sm:text-lg md:text-xl font-black text-amber-600 dark:text-amber-500">689</span>
            </div>
            
            <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-2xl flex justify-center shadow-md dark:shadow-inner hover:scale-105 transition-transform duration-300">
              <QRCode 
                value={`https://tech-thela-ai.vercel.app/Customer?id=${Users._id}`} 
                size={typeof window !== 'undefined' ? Math.min(70, Math.floor((window.innerWidth - 40) / 5)) : 70} 
                level="H"
                fgColor="#0F172A"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1.5 sm:gap-2">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => component(item.id)}
            className="flex items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-2xl cursor-pointer bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-emerald-200 dark:hover:border-white/20 hover:shadow-lg transition-all group"
          >
            <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10 ${item.color} transition-colors shadow-sm`}>
              <item.icon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-white transition-colors">
              {item.label}
            </span>
          </motion.div>
        ))}
      </nav>

      {/* Quick Setup / Help Card */}
      <div className="mt-auto bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest mb-2">Pro Vendor Tips</h4>
          <p className="text-[10px] sm:text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
            Keep your inventory updated to get <span className="text-emerald-600 dark:text-emerald-400 font-bold">2x more demand alerts</span> in your area.
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 text-emerald-500/10 rotate-12">
          <FiTrendingUp size={80} />
        </div>
      </div>
    </aside>
  );
}
