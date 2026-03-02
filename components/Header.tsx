
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const closeModal = () => {
    setActiveModal(null);
    setRating(0);
    setFeedbackStatus('idle');
  };

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedbackStatus('sending');

    const formData = new FormData(e.currentTarget);
    formData.append('stars', rating.toString());

    try {
      const response = await fetch('https://formspree.io/f/xkogqjne', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFeedbackStatus('success');
      } else {
        setFeedbackStatus('error');
      }
    } catch (error) {
      setFeedbackStatus('error');
    }
  };

  const NavItem = ({ label, onClick }: { label: string, onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors px-2 py-1"
    >
      {label}
    </button>
  );

  return (
    <>
      <header className="border-b border-white/5 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl rotate-45 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="-rotate-45">
                <i className="fas fa-fingerprint text-white text-sm md:text-lg"></i>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-xl font-extrabold tracking-tight text-white leading-none">
                DEEP<span className="text-indigo-400 font-black">TRACE</span>X
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-6">
            <NavItem label="Support" onClick={() => setActiveModal('support')} />
            <NavItem label="Developer" onClick={() => setActiveModal('developer')} />
            <NavItem label="Help" onClick={() => setActiveModal('help')} />
            <NavItem label="Privacy" onClick={() => setActiveModal('privacy')} />
          </nav>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              version 1.0.20 Free
            </span>
            <div className="lg:hidden flex space-x-2">
              <button onClick={() => setActiveModal('menu')} className="text-zinc-400"><i className="fas fa-bars"></i></button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative glass border border-white/10 w-full max-w-lg rounded-[2rem] p-8 md:p-10 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>

            {activeModal === 'support' && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-2">
                  <i className="fas fa-headset text-2xl text-indigo-400"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Support & Feedback</h2>
                  <p className="text-zinc-500 text-sm">How can we help you today?</p>
                </div>

                <div className="grid gap-4 mb-6">
                  <a href="mailto:domainastrill@gmail.com" className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all group">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block mb-1">Direct Support</span>
                      <span className="text-white font-bold">domainastrill@gmail.com</span>
                    </div>
                    <i className="fas fa-external-link-alt text-zinc-600 group-hover:text-indigo-400 transition-colors"></i>
                  </a>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-lg font-bold text-white mb-4">Send Feedback</h3>

                  {feedbackStatus === 'success' ? (
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center space-y-3">
                      <i className="fas fa-check-circle text-4xl text-green-400"></i>
                      <p className="text-white font-bold">Feedback Sent!</p>
                      <p className="text-zinc-400 text-sm">Thank you for helping us improve.</p>
                      <button onClick={closeModal} className="text-indigo-400 text-xs font-bold uppercase tracking-widest pt-2">Close</button>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div className="flex justify-center space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl transition-all ${star <= rating ? 'text-yellow-400 scale-110' : 'text-zinc-700 hover:text-zinc-500'}`}
                          >
                            <i className="fas fa-star"></i>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <textarea
                          name="message"
                          required
                          placeholder="Your thoughts, suggestions or bug reports..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 min-h-[100px] transition-all"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={feedbackStatus === 'sending' || rating === 0}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-3
                          ${feedbackStatus === 'sending' || rating === 0
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'}`}
                      >
                        {feedbackStatus === 'sending' ? (
                          <><i className="fas fa-spinner fa-spin"></i><span>Sending...</span></>
                        ) : (
                          <span>Submit Feedback</span>
                        )}
                      </button>

                      {feedbackStatus === 'error' && (
                        <p className="text-red-400 text-[10px] text-center font-bold uppercase tracking-widest">Something went wrong. Please try again.</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            )}

            {activeModal === 'developer' && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-2">
                  <i className="fas fa-code text-2xl text-indigo-400"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Developer Details</h2>
                  <p className="text-zinc-500 text-sm">The mind behind DeepTraceX</p>
                </div>
                <div className="grid gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block mb-1">Full Name</span>
                    <span className="text-white font-bold">Saquib Nazeer</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block mb-1">Contact</span>
                    <a href="tel:+918899779073" className="text-indigo-400 font-bold hover:underline">+91 8899779073</a>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block mb-1">Portfolio</span>
                    <a href="https://saquibnazeer.vercel.app" target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-bold hover:underline">saquibnazeer.vercel.app</a>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'help' && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-2">
                  <i className="fas fa-question-circle text-2xl text-indigo-400"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">How to Use</h2>
                  <p className="text-zinc-500 text-sm">Step-by-step verification guide</p>
                </div>
                <div className="space-y-4">
                  {[
                    "Select a photo from your device using the upload box.",
                    "Click the 'Start Forensics' button to begin.",
                    "Wait for our neural engine to process pixel artifacts.",
                    "Review the detailed report and confidence score."
                  ].map((step, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">{i + 1}</div>
                      <p className="text-zinc-300 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-2">
                  <i className="fas fa-shield-alt text-2xl text-indigo-400"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Privacy & Policy</h2>
                  <p className="text-zinc-500 text-sm">Your data security is our priority</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/5">
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    DeepTraceX is committed to protecting your privacy. We do not store, copy, or distribute the images you upload for analysis.
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    All images are processed in real-time via secure API calls to Google's Gemini infrastructure and are discarded immediately after the analysis report is generated.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'menu' && (
              <div className="flex flex-col space-y-4 pt-4">
                <h2 className="text-xl font-black text-white mb-4">Nav Menu</h2>
                <button onClick={() => setActiveModal('support')} className="p-4 bg-white/5 rounded-2xl text-white font-bold flex items-center justify-between text-left">
                  Support <i className="fas fa-headset text-indigo-400"></i>
                </button>
                <button onClick={() => setActiveModal('developer')} className="p-4 bg-white/5 rounded-2xl text-white font-bold flex items-center justify-between text-left">
                  Developer <i className="fas fa-user text-indigo-400"></i>
                </button>
                <button onClick={() => setActiveModal('help')} className="p-4 bg-white/5 rounded-2xl text-white font-bold flex items-center justify-between text-left">
                  Help <i className="fas fa-question text-indigo-400"></i>
                </button>
                <button onClick={() => setActiveModal('privacy')} className="p-4 bg-white/5 rounded-2xl text-white font-bold flex items-center justify-between text-left">
                  Privacy <i className="fas fa-shield-alt text-indigo-400"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
