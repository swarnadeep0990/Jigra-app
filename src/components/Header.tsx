import { useSimulation } from '../context/SimulationContext';

export function Header() {
  const { isRunning } = useSimulation();

  return (
    <header className="p-[20px_20px_10px_20px] flex justify-between items-center bg-[rgba(15,17,21,0.8)] backdrop-blur-[10px] z-10">
      <div className="text-[20px] font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text">
        PulseGuard
      </div>
      <div className="bg-[var(--surface-light)] py-[5px] px-[12px] rounded-[20px] text-[12px] font-semibold flex items-center gap-[5px]">
        <div 
          className="w-[8px] h-[8px] rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: isRunning ? 'var(--primary)' : 'var(--warning)',
            boxShadow: isRunning ? '0 0 10px var(--primary)' : '0 0 8px var(--warning)'
          }} 
        />
        <span>{isRunning ? 'Streaming Data...' : 'Ready to Connect'}</span>
      </div>
    </header>
  );
}
