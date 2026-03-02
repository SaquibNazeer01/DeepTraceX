import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ResultDisplay from './components/ResultDisplay';
import { AnalysisResult, AnalysisStatus } from './types';
import { analyzeImage } from './services/geminiService';

const SCAN_MESSAGES = [
  "Initializing Forensic Engine...",
  "Analyzing Pixel Geometry...",
  "Detecting Neural Artifacts...",
  "Checking Lighting Consistency...",
  "Verifying Metadata Integrity...",
  "Finalizing DeepTrace Report..."
];

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: number;
    if (status === AnalysisStatus.LOADING) {
      interval = window.setInterval(() => {
        setScanStep(prev => (prev < SCAN_MESSAGES.length - 1 ? prev + 1 : prev));
      }, 1200);
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 12 * 1024 * 1024) {
        setError("That photo is too big. Please use one smaller than 12MB.");
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const startAnalysis = async () => {
    if (!preview || !file) return;
    setStatus(AnalysisStatus.LOADING);
    setScanStep(0);
    setError(null);
    try {
      const base64Data = preview.split(',')[1];
      const mimeType = file.type;
      const analysisResult = await analyzeImage(base64Data, mimeType);
      setResult(analysisResult);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your internet and try again.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setError(null);
    setScanStep(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 md:py-16 relative">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-600/10 blur-[100px] rounded-full -z-10"></div>

        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 md:mb-6 animate-in">
            <span className={`w-2 h-2 rounded-full ${status === AnalysisStatus.LOADING ? 'bg-indigo-400 animate-pulse' : 'bg-green-400'}`}></span>
            <span className="text-[10px] uppercase tracking-widest font-black text-indigo-400">
              {status === AnalysisStatus.LOADING ? 'Scanning Image In Progress' : 'Forensic Engine Active'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight leading-tight text-white">
            Is this photo <span className="text-indigo-400">Real or AI?</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Uncover the digital truth. DeepTraceX uses pixel-level forensics to detect synthetic artifacts in any image.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
          {/* Uploader Section */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <div
              className={`relative group glass rounded-[2rem] overflow-hidden transition-all duration-500 min-h-[350px] md:min-h-[450px] flex flex-col items-center justify-center p-2
                ${preview ? 'ring-2 ring-indigo-500/30' : 'hover:border-zinc-700/50'}`}
            >
              {preview ? (
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-black/40">
                  <img src={preview} alt="Upload Preview" className={`w-full h-[340px] md:h-[430px] object-contain transition-all duration-700 ${status === AnalysisStatus.LOADING ? 'scale-105 blur-[2px] opacity-70' : 'scale-100 blur-0 opacity-100'}`} />

                  {status === AnalysisStatus.LOADING && (
                    <>
                      <div className="scanning-line"></div>
                      <div className="scanning-grid"></div>
                      <div className="scanning-dots">
                        {[...Array(15)].map((_, i) => (
                          <div
                            key={i}
                            className="dot"
                            style={{
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              '--duration': `${1 + Math.random() * 2}s`
                            } as React.CSSProperties}
                          ></div>
                        ))}
                      </div>
                    </>
                  )}

                  {status !== AnalysisStatus.LOADING && (
                    <button
                      onClick={reset}
                      className="absolute top-3 right-3 bg-black/60 hover:bg-red-500/80 text-white w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all z-20"
                    >
                      <i className="fas fa-times text-sm"></i>
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className="w-full h-full p-8 md:p-12 text-center cursor-pointer flex flex-col items-center justify-center space-y-4 md:space-y-6 group/box"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-800/80 rounded-2xl md:rounded-3xl flex items-center justify-center border border-white/5 group-hover/box:border-indigo-500/30 group-hover/box:bg-zinc-800 transition-all">
                    <i className="fas fa-cloud-upload-alt text-2xl md:text-3xl text-indigo-400"></i>
                  </div>
                  <div>
                    <h3 className="text-white text-lg md:text-xl font-bold mb-1">Select Photo</h3>
                    <p className="text-zinc-500 text-xs md:text-sm font-medium">Click to upload or drag image here</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <button
              onClick={startAnalysis}
              disabled={!file || status === AnalysisStatus.LOADING}
              className={`w-full py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] font-black uppercase tracking-widest text-xs md:text-sm transition-all flex items-center justify-center space-x-3
                ${!file || status === AnalysisStatus.LOADING
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-95'}`}
            >
              {status === AnalysisStatus.LOADING ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Analysis In Progress</span>
                </>
              ) : (
                <>
                  <i className="fas fa-search-plus"></i>
                  <span>Start Forensics</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-400 animate-in">
                <i className="fas fa-exclamation-triangle flex-shrink-0"></i>
                <p className="text-xs md:text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {result ? (
              <ResultDisplay result={result} />
            ) : status === AnalysisStatus.LOADING ? (
              <div className="glass rounded-[2rem] p-8 md:p-12 text-center h-full min-h-[400px] flex flex-col items-center justify-center space-y-8 animate-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
                  <div
                    className="h-full bg-indigo-500 progress-bar-inner shadow-[0_0_10px_#6366f1]"
                    style={{ width: `${((scanStep + 1) / SCAN_MESSAGES.length) * 100}%` }}
                  ></div>
                </div>

                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 border-[2px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-microscope text-2xl text-indigo-400/50"></i>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <div className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Stage {scanStep + 1} of {SCAN_MESSAGES.length}</div>
                    <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                    <div className="text-xs font-black text-white tracking-[0.2em]">{Math.round(((scanStep + 1) / SCAN_MESSAGES.length) * 100)}%</div>
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-white tracking-tight h-8">{SCAN_MESSAGES[scanStep]}</h2>
                  <p className="text-zinc-500 text-xs md:text-sm font-medium max-w-sm mx-auto">
                    Our AI is inspecting pixel consistency and looking for generative artifacts that are invisible to the human eye.
                  </p>
                </div>

                <div className="flex space-x-2">
                  {SCAN_MESSAGES.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= scanStep ? 'bg-indigo-500 scale-125' : 'bg-zinc-800'}`}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-[2rem] p-10 md:p-16 text-center h-full min-h-[400px] flex flex-col items-center justify-center border-dashed border-2 border-white/5 hover:border-indigo-500/20 transition-colors">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fas fa-dna text-3xl md:text-4xl text-zinc-700"></i>
                </div>
                <h2 className="text-lg md:text-xl font-black text-zinc-300 mb-2">Awaiting Forensic Input</h2>
                <p className="text-zinc-500 max-w-xs text-xs md:text-sm font-medium leading-relaxed">
                  Upload an image to trigger the DeepTraceX neural verification engine.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-10 md:mt-20 border-t border-white/5 bg-[#09090b] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="flex items-center space-x-2 justify-center md:justify-start mb-2">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center rotate-45">
                  <i className="fas fa-fingerprint text-white text-[10px] -rotate-45"></i>
                </div>
                <span className="text-sm font-black text-white uppercase tracking-tighter">DeepTraceX Forensic Engine</span>
              </div>
              <p className="text-zinc-500 text-xs font-medium">Protecting Digital Integrity through Advanced AI Verification.</p>
            </div>

            <div className="text-center md:text-right">
              <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest block mb-1">Developer Signature</span>
              <span className="text-lg font-black text-white hover:text-indigo-400 transition-colors cursor-default">Saquib Nazeer</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;