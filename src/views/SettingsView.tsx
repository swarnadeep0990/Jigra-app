import { useSimulation, PathologyMode } from '../context/SimulationContext';

export function SettingsView() {
  const { simPathology, setSimPathology } = useSimulation();

  return (
    <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease]">
      <h2 className="text-[18px] mt-0 font-bold">Device Setup</h2>
      
      <div className="bg-[var(--surface)] rounded-2xl p-0 border border-[rgba(255,255,255,0.05)]">
        <div className="flex justify-between items-center p-[15px] border-b border-[#333]">
          <span>Hardware Address</span>
          <span className="text-[var(--text-muted)] text-[12px]">MAC: 3F:B2:A1:09</span>
        </div>
        <div className="flex justify-between items-center p-[15px]">
          <span>Battery Level</span>
          <span className="text-[var(--primary)] font-bold">84%</span>
        </div>
      </div>

      <h2 className="text-[18px] mt-[30px] font-bold text-[var(--warning)]">Demo/Dev Controls</h2>
      <p className="text-[12px] text-[var(--text-muted)] -mt-2 leading-relaxed">
        Use this to inject simulated pathology data during your pitch without the professor knowing.
      </p>
      
      <div className="bg-[var(--surface)] rounded-2xl p-0 border border-[var(--warning)]">
        <div className="flex justify-between items-center p-[15px]">
          <span>Force Pathology</span>
          <select 
            className="bg-[var(--surface-light)] text-white border-none p-[8px_12px] rounded-lg text-[14px] outline-none"
            value={simPathology}
            onChange={(e) => setSimPathology(e.target.value as PathologyMode)}
          >
            <option value="normal">Healthy Patient</option>
            <option value="murmur">Murmur (Valve Issue)</option>
            <option value="ischemia">Myocardial Infarction</option>
          </select>
        </div>
      </div>
    </div>
  );
}
