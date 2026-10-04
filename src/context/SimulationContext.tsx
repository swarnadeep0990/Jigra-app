import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

export type PathologyMode = 'normal' | 'murmur' | 'ischemia';

export interface AIData {
  color: string;
  title: string;
  desc: string;
}

interface SimulationState {
  isRunning: boolean;
  simPathology: PathologyMode;
  metrics: {
    bpm: number | string;
    pep: number | string;
    lvet: number | string;
    ratio: number | string;
  };
  aiData: AIData | null;
  startSimulation: () => void;
  setSimPathology: (mode: PathologyMode) => void;
  subscribeToData: (callback: (ecg: number, pcg: number) => void) => () => void;
}

const signals = {
  normal: {
    ecg: [0,0,0,0, 0.2,0.1,0, -0.2,3.0,-0.8, 0,0,0,0,0, 0.4,0.3,0, 0,0,0,0,0,0,0],
    pcg: [0,0,0,0, 0,0,0, 0,0,0, 0.9,-0.7,0.5,-0.2,0, 0,0,0, 0.6,-0.4,0.2,0, 0,0,0],
    bpm: 68, pep: 96, lvet: 285, ratio: 0.34, 
    ai: { color: 'var(--primary)', title: 'Normal Sinus Rhythm', desc: 'No murmurs detected. PEP/LVET ratio is within healthy bounds (0.34).' }
  },
  murmur: {
    ecg: [0,0,0,0, 0.2,0.1,0, -0.2,3.0,-0.8, 0,0,0,0,0, 0.4,0.3,0, 0,0,0,0,0,0,0],
    pcg: [0,0,0,0, 0,0,0, 0,0,0, 0.9,-0.7, 0.4,-0.3,0.3,-0.2,0.3,-0.1, 0.6,-0.4,0.2,0, 0,0,0],
    bpm: 72, pep: 98, lvet: 280, ratio: 0.35, 
    ai: { color: 'var(--warning)', title: 'Systolic Murmur Detected', desc: 'Acoustic anomaly between S1 and S2. Suggests possible Mitral Regurgitation.' }
  },
  ischemia: {
    ecg: [0,0,0,0, 0.2,0.1,0, -0.2,3.0,-0.8, 1.2,1.2,1.1,1.0,0.8, 0.5,0.3,0, 0,0,0,0,0,0,0],
    pcg: [0,0,0,0, 0,0,0, 0,0,0,0,0, 0.4,-0.3,0.2,-0.1,0, 0, 0.3,-0.2,0.1,0, 0,0,0],
    bpm: 92, pep: 145, lvet: 240, ratio: 0.60, 
    ai: { color: 'var(--danger)', title: 'Critical Ischemia Alert', desc: 'ST-Elevation detected. Severe electromechanical delay (Ratio > 0.50). Immediate referral required.' }
  }
};

const SimulationContext = createContext<SimulationState | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [simPathology, setSimPathology] = useState<PathologyMode>('normal');
  const [metrics, setMetrics] = useState({ bpm: '--', pep: '--', lvet: '--', ratio: '--' });
  const [aiData, setAiData] = useState<AIData | null>(null);

  const indexRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const subscribers = useRef<Set<(ecg: number, pcg: number) => void>>(new Set());

  const subscribeToData = (callback: (ecg: number, pcg: number) => void) => {
    subscribers.current.add(callback);
    return () => {
      subscribers.current.delete(callback);
    };
  };

  const playHeartSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(50, ctx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    if (isRunning && !audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const data = signals[simPathology];
      const loopIndex = indexRef.current % 25;
      
      const noise = () => (Math.random() * 0.06 - 0.03);
      const currentEcg = data.ecg[loopIndex] + noise();
      const currentPcg = data.pcg[loopIndex] + noise();

      subscribers.current.forEach(cb => cb(currentEcg, currentPcg));

      if (loopIndex === 10 || loopIndex === 18) {
        playHeartSound();
      }

      // Update metrics only when they change to avoid unnecessary re-renders
      setMetrics(prev => {
        if (prev.bpm !== data.bpm || prev.ratio !== data.ratio) {
          return {
            bpm: data.bpm,
            pep: data.pep,
            lvet: data.lvet,
            ratio: data.ratio
          };
        }
        return prev;
      });
      
      setAiData(data.ai);

      indexRef.current++;
    }, 40);

    return () => clearInterval(interval);
  }, [isRunning, simPathology]);

  const startSimulation = () => {
    setIsRunning(true);
  };

  return (
    <SimulationContext.Provider value={{
      isRunning,
      simPathology,
      metrics,
      aiData,
      startSimulation,
      setSimPathology,
      subscribeToData
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
