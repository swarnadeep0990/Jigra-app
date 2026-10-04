import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import html2pdf from 'html2pdf.js';

interface AIModalProps {
  onClose: () => void;
}

export function AIModal({ onClose }: AIModalProps) {
  const { aiData, metrics, simPathology } = useSimulation();
  const [isProcessing, setIsProcessing] = React.useState(true);
  const [showPdfBtn, setShowPdfBtn] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setShowPdfBtn(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleExportPDF = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    // Update PDF DOM values before printing
    document.getElementById('pdf-time')!.innerText = new Date().toLocaleString();
    document.getElementById('pdf-bpm')!.innerText = String(metrics.bpm);
    document.getElementById('pdf-pep')!.innerText = String(metrics.pep);
    document.getElementById('pdf-lvet')!.innerText = String(metrics.lvet);
    document.getElementById('pdf-ratio')!.innerText = String(metrics.ratio);
    
    const verdictBox = document.getElementById('pdf-verdict-box');
    if (verdictBox && aiData) {
      verdictBox.style.borderLeftColor = aiData.color;
      verdictBox.style.background = simPathology === 'normal' ? '#f1f8e9' : (simPathology === 'murmur' ? '#fff8e1' : '#ffebee');
      document.getElementById('pdf-verdict')!.innerHTML = `<strong>${aiData.title}</strong><br>${aiData.desc}`;
    }

    element.style.display = 'block';
    
    html2pdf().set({
      margin: 0.5,
      filename: 'Patient_Report_PG.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(element).save().then(() => {
      element.style.display = 'none';
    });
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-[5px] flex justify-center items-center z-[100] p-5">
      <div className="bg-[var(--surface)] w-full rounded-[20px] p-5 border border-[#333] text-center shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        {isProcessing ? (
          <div>
            <div className="w-[80px] h-[80px] border-4 border-[#333] border-t-[var(--secondary)] rounded-full mx-auto mb-5 animate-[spin_1s_linear_infinite]" />
            <h3 className="m-0 text-lg font-bold">Edge AI Processing...</h3>
            <p className="text-[12px] text-[var(--text-muted)] mt-2">Running TinyML TensorFlow Model</p>
          </div>
        ) : (
          <div>
            {simPathology === 'normal' ? (
              <CheckCircle2 size={48} className="mx-auto" style={{ color: aiData?.color }} />
            ) : (
              <AlertTriangle size={48} className="mx-auto" style={{ color: aiData?.color }} />
            )}
            <h2 className="my-[10px] text-xl font-bold" style={{ color: aiData?.color }}>
              {aiData?.title}
            </h2>
            <p className="text-[14px] text-[#ccc] mb-5">
              {aiData?.desc}
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                className="w-full p-4 rounded-xl font-bold border-none cursor-pointer flex justify-center items-center gap-2 transition-transform active:scale-95 bg-[var(--primary)] text-black shadow-[0_4px_15px_rgba(0,230,118,0.3)]"
                onClick={onClose}
              >
                Acknowledge & Close
              </button>
              
              {showPdfBtn && (
                <button 
                  className="w-full p-4 rounded-xl font-bold border border-[#555] cursor-pointer flex justify-center items-center gap-2 transition-transform active:scale-95 bg-[#333] text-white"
                  onClick={handleExportPDF}
                >
                  Export Referral PDF
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden PDF Template */}
      <div id="pdf-content" className="hidden bg-white text-black p-[30px] w-[600px]">
        <h1 className="text-[#212121] border-b-2 border-[#e0e0e0] pb-2.5">PulseGuard Clinical Report</h1>
        <p><strong>Device Operator:</strong> Frontline Worker (Demo Unit)</p>
        <p><strong>Timestamp:</strong> <span id="pdf-time"></span></p>
        <table className="w-full border-collapse mt-5">
          <tbody>
            <tr className="bg-[#f5f5f5]">
              <th className="p-2.5 border border-[#ddd] text-left">Metric</th>
              <th className="p-2.5 border border-[#ddd] text-left">Value</th>
            </tr>
            <tr>
              <td className="p-2.5 border border-[#ddd]">Heart Rate</td>
              <td id="pdf-bpm" className="p-2.5 border border-[#ddd] font-bold">--</td>
            </tr>
            <tr>
              <td className="p-2.5 border border-[#ddd]">PEP (Pre-Ejection)</td>
              <td id="pdf-pep" className="p-2.5 border border-[#ddd]">--</td>
            </tr>
            <tr>
              <td className="p-2.5 border border-[#ddd]">LVET (Ejection Time)</td>
              <td id="pdf-lvet" className="p-2.5 border border-[#ddd]">--</td>
            </tr>
            <tr className="bg-[#e3f2fd]">
              <td className="p-2.5 border border-[#ddd] font-bold">PEP/LVET Ratio</td>
              <td id="pdf-ratio" className="p-2.5 border border-[#ddd] font-bold">--</td>
            </tr>
          </tbody>
        </table>
        <div id="pdf-verdict-box" className="mt-5 p-[15px] border-l-[5px] bg-[#f1f8e9]">
          <h3 className="mt-0 text-lg font-bold">AI Triage Suggestion</h3>
          <p id="pdf-verdict" className="mb-0 text-sm"></p>
        </div>
      </div>
    </div>
  );
}
