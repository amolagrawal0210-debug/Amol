import React, { useState } from 'react';
import { Mic, Zap, Sparkles, AlertCircle, Settings2, ChevronDown, User, Globe } from 'lucide-react';
import { generateSpeech, AccentType } from './services/geminiService';
import { AudioPlayer } from './components/AudioPlayer';

const App = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [accent, setAccent] = useState<AccentType>('Hinglish');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const url = await generateSpeech(text, voice, accent);
      setAudioUrl(url);
    } catch (err: any) {
      setError(err.message || 'Transmission failed. Retrying grid connection...');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight text-white selection:bg-neon-pink selection:text-white overflow-x-hidden font-sans relative flex flex-col">
      
      {/* Ambient Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

      <main className="relative max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8 z-10 flex-grow w-full">
        
        {/* Header */}
        <header className="text-center space-y-4 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
            <span className="text-xs tracking-widest text-gray-400 uppercase">System Online v2.5</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Vocal<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">Vibe</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide max-w-lg mx-auto">
            Advanced Neural Speech Synthesis with Adaptive Accents
          </p>
        </header>

        {/* Control Grid */}
        <div className="grid gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          {/* Input Zone */}
          <section className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-2xl opacity-30 group-hover:opacity-100 blur transition duration-500"></div>
            <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl p-1">
              <div className="bg-white/5 rounded-xl p-4 md:p-6 border border-white/10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <label className="flex items-center gap-2 text-neon-cyan text-sm font-bold uppercase tracking-wider">
                    <Mic className="w-4 h-4" /> Text Input Stream
                  </label>
                  <Sparkles className={`w-4 h-4 text-neon-pink transition-opacity duration-300 ${text.length > 0 ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your text here in Hindi, English, or Hinglish... e.g., 'Hello world, kya scene hai aaj?'"
                  className="w-full h-32 bg-transparent text-lg md:text-xl text-white placeholder-gray-600 outline-none resize-none font-light leading-relaxed scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                  spellCheck={false}
                />
                
                <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/5">
                   <div className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-pink/50"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/50"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-purple/50"></span>
                   </div>
                  <span className="text-xs text-gray-500 font-mono">{text.length} CHARS</span>
                </div>
              </div>
            </div>
          </section>

          {/* Configuration Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
             {/* Voice Selection */}
             <div className="relative group">
                <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm group-hover:bg-white/10 transition"></div>
                <div className="relative bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                   <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <User className="w-4 h-4 text-neon-pink" />
                      <span className="text-xs font-bold uppercase tracking-wider">Voice Identity</span>
                   </div>
                   <div className="relative">
                      <select 
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                        className="w-full bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                      >
                         <option value="Kore" className="bg-gray-900">Kore (Female | Professional)</option>
                         <option value="Fenrir" className="bg-gray-900">Fenrir (Male | Deep & Calm)</option>
                         <option value="Puck" className="bg-gray-900">Puck (Child-like | Playful)</option>
                         <option value="Charon" className="bg-gray-900">Charon (Alien/Villain | Deep)</option>
                         <option value="Zephyr" className="bg-gray-900">Zephyr (Female | Soft & Airy)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                </div>
             </div>

             {/* Accent Selection */}
             <div className="relative group">
                <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm group-hover:bg-white/10 transition"></div>
                <div className="relative bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                   <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Globe className="w-4 h-4 text-neon-cyan" />
                      <span className="text-xs font-bold uppercase tracking-wider">Accent Modality</span>
                   </div>
                   <div className="relative">
                      <select 
                        value={accent}
                        onChange={(e) => setAccent(e.target.value as AccentType)}
                        className="w-full bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                      >
                         <option value="Hinglish" className="bg-gray-900">Hinglish (Casual Mixed)</option>
                         <option value="Indian" className="bg-gray-900">Indian English (Formal)</option>
                         <option value="American" className="bg-gray-900">American English (General)</option>
                         <option value="British" className="bg-gray-900">British English (RP)</option>
                         <option value="Cybernetic" className="bg-gray-900">Cybernetic (Robotic/Flat)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                </div>
             </div>

          </section>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !text.trim()}
            className={`
              relative group w-full min-h-[70px] overflow-hidden rounded-xl transition-all duration-300 flex items-center justify-center
              ${isLoading ? 'opacity-90 cursor-wait' : 'hover:scale-[1.01] cursor-pointer'}
            `}
          >
            {/* Button Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-purple-600 to-neon-pink opacity-90 group-hover:opacity-100 transition-opacity" />
            
            {/* Button Glow */}
            <div className={`absolute inset-0 blur-xl bg-neon-pink opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${isLoading ? 'animate-pulse opacity-50' : ''}`} />

            <div className="relative flex items-center gap-3">
              {isLoading ? (
                <>
                  <div className="flex gap-1.5">
                    <div className="w-1 h-6 bg-black/80 animate-[pulse_0.6s_ease-in-out_infinite] rounded-full"></div>
                    <div className="w-1 h-6 bg-black/80 animate-[pulse_0.6s_ease-in-out_0.2s_infinite] rounded-full"></div>
                    <div className="w-1 h-6 bg-black/80 animate-[pulse_0.6s_ease-in-out_0.4s_infinite] rounded-full"></div>
                  </div>
                  <span className="text-black font-bold uppercase tracking-widest text-sm md:text-base pl-2">Synthesizing Audio...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 text-black fill-black" />
                  <span className="text-black font-bold uppercase tracking-widest text-lg">Initialize Synthesis</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-slide-up backdrop-blur-sm shadow-[0_0_20px_rgba(255,0,0,0.1)]">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>{error}</span>
            </div>
        )}

        {/* Output Zone */}
        {audioUrl && (
          <section className="w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
             <div className="relative">
                <div className="absolute inset-0 bg-neon-cyan/5 blur-xl rounded-full"></div>
                <AudioPlayer src={audioUrl} />
             </div>
          </section>
        )}

      </main>
      
      {/* Footer Decoration */}
      <footer className="w-full text-center py-8 pointer-events-none z-10 bg-gradient-to-t from-midnight to-transparent mt-auto">
        <div className="flex flex-col items-center gap-3">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <div className="flex items-center gap-2">
                 <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">
                    Architecture by <span className="text-gray-300 font-bold text-neon-cyan">Amol Agrawal</span>
                </p>
            </div>
            <div className="flex gap-2 text-[9px] text-gray-700 font-mono uppercase">
               <span>Gemini 2.5 Flash</span>
               <span>•</span>
               <span>High Fidelity Audio</span>
               <span>•</span>
               <span>React 19</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
