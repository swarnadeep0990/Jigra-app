export function HistoryView() {
  return (
    <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease]">
      <h2 className="text-[18px] mt-0 font-bold">Recent Screenings</h2>
      
      <div className="bg-[var(--surface)] rounded-2xl p-[15px] border border-[rgba(255,255,255,0.05)] border-l-[4px] border-l-[var(--primary)]">
        <div className="flex justify-between mb-[5px]">
          <strong>Patient #A-449</strong> 
          <span className="text-[var(--primary)]">Normal</span>
        </div>
        <div className="text-[12px] text-[var(--text-muted)]">Today, 09:15 AM | ASHA Worker: Meera</div>
      </div>
      
      <div className="bg-[var(--surface)] rounded-2xl p-[15px] border border-[rgba(255,255,255,0.05)] border-l-[4px] border-l-[var(--danger)]">
        <div className="flex justify-between mb-[5px]">
          <strong>Patient #A-448</strong> 
          <span className="text-[var(--danger)]">Ischemia Alert</span>
        </div>
        <div className="text-[12px] text-[var(--text-muted)]">Yesterday, 14:30 PM | Referred to District Hosp.</div>
      </div>
    </div>
  );
}
