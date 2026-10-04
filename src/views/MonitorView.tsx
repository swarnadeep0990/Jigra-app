import React, { useEffect, useRef } from 'react';
import { Wifi, Cpu, HeartPulse, Activity } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

export function MonitorView({ onOpenModal }: { onOpenModal: () => void }) {
  const { isRunning, startSimulation, metrics, subscribeToData } = useSimulation();
  
  const ecgCanvasRef = useRef<HTMLCanvasElement>(null);
  const pcgCanvasRef = useRef<HTMLCanvasElement>(null);
  const ecgChartRef = useRef<Chart | null>(null);
  const pcgChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const chartOpts: any = {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      elements: { point: { radius: 0 }, line: { borderWidth: 2.5 } },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false, min: -2, max: 4 } }
    };

    if (ecgCanvasRef.current && !ecgChartRef.current) {
      ecgChartRef.current = new Chart(ecgCanvasRef.current, {
        type: 'line',
        data: {
          labels: Array(100).fill(''),
          datasets: [{ data: Array(100).fill(0), borderColor: '#00e676', tension: 0.3 }]
        },
        options: chartOpts
      });
    }

    if (pcgCanvasRef.current && !pcgChartRef.current) {
      pcgChartRef.current = new Chart(pcgCanvasRef.current, {
        type: 'line',
        data: {
          labels: Array(100).fill(''),
          datasets: [{ data: Array(100).fill(0), borderColor: '#00b0ff', tension: 0.2 }]
        },
        options: { ...chartOpts, scales: { y: { display: false, min: -1.5, max: 1.5 } } }
      });
    }

    return () => {
      if (ecgChartRef.current) { ecgChartRef.current.destroy(); ecgChartRef.current = null; }
      if (pcgChartRef.current) { pcgChartRef.current.destroy(); pcgChartRef.current = null; }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      const unsubscribe = subscribeToData((ecgVal, pcgVal) => {
        if (ecgChartRef.current && pcgChartRef.current) {
          const ecgData = ecgChartRef.current.data.datasets[0].data;
          const pcgData = pcgChartRef.current.data.datasets[0].data;
          
          ecgData.push(ecgVal);
          ecgData.shift();
          
          pcgData.push(pcgVal);
          pcgData.shift();
          
          ecgChartRef.current.update();
          pcgChartRef.current.update();
        }
      });
      return unsubscribe;
    }
  }, [isRunning, subscribeToData]);

  const ratioNum = Number(metrics.ratio);
  const isDangerRatio = !isNaN(ratioNum) && ratioNum > 0.40;

  return (
    <div className="flex flex-col gap-4">
      {!isRunning ? (
        <button 
          onClick={startSimulation}
          className="w-full p-4 rounded-xl text-[16px] font-bold border-none cursor-pointer flex justify-center items-center gap-2 transition-transform active:scale-98 bg-[var(--primary)] text-black shadow-[0_4px_15px_rgba(0,230,118,0.3)]"
        >
          <Wifi size={20} /> Connect & Start Patch
        </button>
      ) : (
        <button 
          onClick={onOpenModal}
          className="w-full p-4 rounded-xl text-[16px] font-bold border-none cursor-pointer flex justify-center items-center gap-2 transition-transform active:scale-98 bg-[var(--secondary)] text-black shadow-[0_4px_15px_rgba(0,176,255,0.3)]"
        >
          <Cpu size={20} /> Run AI Triage Analysis
        </button>
      )}

      <div className="bg-[var(--surface)] rounded-2xl p-[15px] border border-[rgba(255,255,255,0.05)]">
        <div className="flex justify-between items-center mb-2.5">
          <div className="text-[14px] font-semibold text-[var(--text-muted)] flex items-center gap-[5px]">
            <HeartPulse size={18} color="var(--primary)" /> ECG Lead I
          </div>
        </div>
        <div className="h-[120px] w-full">
          <canvas ref={ecgCanvasRef} className="w-full h-full" />
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-2xl p-[15px] border border-[rgba(255,255,255,0.05)]">
        <div className="flex justify-between items-center mb-2.5">
          <div className="text-[14px] font-semibold text-[var(--text-muted)] flex items-center gap-[5px]">
            <Activity size={18} color="var(--secondary)" /> PCG Audio Envelope
          </div>
        </div>
        <div className="h-[120px] w-full">
          <canvas ref={pcgCanvasRef} className="w-full h-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-2">
        <div className="bg-[var(--surface-light)] p-3 rounded-xl flex flex-col justify-center">
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">Heart Rate</div>
          <div className="text-[22px] font-bold">{metrics.bpm} <span className="text-[12px] font-normal text-[var(--text-muted)]">bpm</span></div>
        </div>
        <div className="bg-[var(--surface-light)] p-3 rounded-xl flex flex-col justify-center">
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">Pre-Ejection (PEP)</div>
          <div className="text-[22px] font-bold">{metrics.pep} <span className="text-[12px] font-normal text-[var(--text-muted)]">ms</span></div>
        </div>
        <div className="bg-[var(--surface-light)] p-3 rounded-xl flex flex-col justify-center">
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">Ejection (LVET)</div>
          <div className="text-[22px] font-bold">{metrics.lvet} <span className="text-[12px] font-normal text-[var(--text-muted)]">ms</span></div>
        </div>
        <div 
          className="p-3 rounded-xl flex flex-col justify-center transition-colors"
          style={{ 
            backgroundColor: isDangerRatio ? 'rgba(255, 61, 0, 0.2)' : 'var(--surface-light)',
            color: isDangerRatio ? 'var(--danger)' : 'var(--text-main)'
          }}
        >
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">STI Ratio (PEP/LVET)</div>
          <div className="text-[22px] font-bold">{metrics.ratio}</div>
        </div>
      </div>
    </div>
  );
}
