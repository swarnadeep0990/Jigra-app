import { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MonitorView } from './views/MonitorView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { AIModal } from './components/AIModal';
import { SimulationProvider } from './context/SimulationContext';

export type TabType = 'monitor' | 'history' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('monitor');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SimulationProvider>
      <div className="w-full max-w-[430px] h-full bg-[var(--bg-dark)] relative flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <Header />
        
        <main className="flex-1 overflow-y-auto px-[15px] pt-[10px] pb-[calc(var(--nav-height)+20px)]">
          <div className={activeTab === 'monitor' ? 'block animate-[fadeIn_0.3s_ease]' : 'hidden'}>
            <MonitorView onOpenModal={() => setIsModalOpen(true)} />
          </div>
          <div className={activeTab === 'history' ? 'block animate-[fadeIn_0.3s_ease]' : 'hidden'}>
            <HistoryView />
          </div>
          <div className={activeTab === 'settings' ? 'block animate-[fadeIn_0.3s_ease]' : 'hidden'}>
            <SettingsView />
          </div>
        </main>
        
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        {isModalOpen && <AIModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </SimulationProvider>
  );
}
