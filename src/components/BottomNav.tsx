import { Activity, History, Settings } from 'lucide-react';
import { TabType } from '../App';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="absolute bottom-0 w-full h-[var(--nav-height)] bg-[rgba(30,33,40,0.95)] backdrop-blur-[10px] flex justify-around items-center border-t border-[rgba(255,255,255,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div 
        className={`flex flex-col items-center gap-[4px] cursor-pointer p-[10px] transition-colors duration-200 ${activeTab === 'monitor' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
        onClick={() => onTabChange('monitor')}
      >
        <Activity size={26} strokeWidth={2} />
        <span className="text-[10px] font-semibold">Monitor</span>
      </div>
      
      <div 
        className={`flex flex-col items-center gap-[4px] cursor-pointer p-[10px] transition-colors duration-200 ${activeTab === 'history' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
        onClick={() => onTabChange('history')}
      >
        <History size={26} strokeWidth={2} />
        <span className="text-[10px] font-semibold">History</span>
      </div>
      
      <div 
        className={`flex flex-col items-center gap-[4px] cursor-pointer p-[10px] transition-colors duration-200 ${activeTab === 'settings' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
        onClick={() => onTabChange('settings')}
      >
        <Settings size={26} strokeWidth={2} />
        <span className="text-[10px] font-semibold">Settings</span>
      </div>
    </nav>
  );
}
