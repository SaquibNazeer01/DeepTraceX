
import React from 'react';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

const ResultDisplay: React.FC<Props> = ({ result }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const score = result.confidenceScore;
  const offset = circumference - (score / 100) * circumference;
  const mainColor = result.isAI ? '#ef4444' : '#10b981';

  return (
    <div className="space-y-6 md:space-y-8 animate-in">
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {/* Main Verdict Card */}
        <div className="glass rounded-[2rem] p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 -z-10 ${result.isAI ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          
          <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-6 md:mb-8">Scan Result</h3>
          
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 scale-100 md:scale-125">
              <circle stroke="rgba(255,255,255,0.05)" fill="transparent" strokeWidth={strokeWidth} r={normalizedRadius} cx={radius} cy={radius} />
              <circle
                stroke={mainColor} fill="transparent" strokeWidth={strokeWidth} strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset: offset }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">{Math.round(score)}%</span>
              <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1 ${result.isAI ? 'text-red-400' : 'text-emerald-400'}`}>
                {result.isAI ? 'Likely AI' : 'Likely Real'}
              </span>
            </div>
          </div>

          <div className="mt-8 md:mt-10 text-center">
            <div className={`inline-block px-6 md:px-8 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border mb-3 ${result.isAI ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              Verdict: {result.isAI ? 'AI Detected' : 'No AI Found'}
            </div>
          </div>
        </div>

        {/* Simple Summary */}
        <div className="glass rounded-[2rem] p-6 md:p-8">
          <h3 className="text-base md:text-lg font-black text-white mb-4 flex items-center">
            <i className="fas fa-info-circle text-indigo-400 mr-2"></i>
            Summary
          </h3>
          <p className="text-zinc-400 leading-relaxed text-xs md:text-sm font-medium mb-6">
            {result.detailedReasoning}
          </p>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Key Clues Found</h4>
            {result.artifacts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.artifacts.map((artifact, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${getSeverityColor(artifact.severity)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-[10px] uppercase tracking-wider">{artifact.type}</span>
                    </div>
                    <p className="text-[11px] opacity-80 leading-snug font-medium">{artifact.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-white/5 bg-white/2 text-zinc-500 italic text-[11px] text-center font-medium">
                No major AI clues were found in this photo.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
