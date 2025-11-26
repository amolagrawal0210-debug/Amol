import React, { useState } from 'react';
import { Mic, Zap, Sparkles, AlertCircle, Settings2, User, Globe, Loader2 } from 'lucide-react';
import { generateSpeech, AccentType } from './services/geminiService';
import { AudioPlayer } from './components/AudioPlayer';
import { CyberDropdown, DropdownOption, DropdownGroup } from './components/CyberDropdown';

const App = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [accent, setAccent] = useState<AccentType>('Hinglish');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voiceOptions: (DropdownOption | DropdownGroup)[] = [
    {
      label: "Standard Voices",
      options: [
        { value: "Kore", label: "Kore (Female | Professional)" },
        { value: "Fenrir", label: "Fenrir (Male | Deep & Calm)" },
        { value: "Zephyr", label: "Zephyr (Female | Soft & Airy)" },
      ]
    },
    {
      label: "Characters & Personas",
      options: [
        { value: "Puck", label: "Puck (Child-like | Playful)" },
        { value: "Charon", label: "Charon (Alien/Villain | Deep)" },
        { value: "RaviShastri", label: "Ravi Shastri (Commentator)", className: "text-neon-cyan font-semibold" },
        { value: "AakashChopra", label: "Aakash Chopra (Hindi Poet)", className: "text-neon-pink font-semibold" },
      ]
    }
  ];

  const accentOptions: DropdownOption[] = [
    { value: "Hinglish", label: "Hinglish (Casual Mixed)" },
    { value: "Indian", label: "Indian English (Formal)" },
    { value: "Hindi", label: "Indian Hindi (Formal)" },
    { value: "American", label: "American English (General)" },
    { value: "British", label: "British English (RP)" },
    { value: "Cybernetic", label: "Cybernetic (Robotic/Flat)" },
  ];

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
                  placeholder="Type your text here in Hindi, English, or Hinglish... e.g., 'What a shot! That went like a tracer bullet!'"
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
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 z-20">
             
             {/* Voice Selection */}
             <CyberDropdown 
                label="Voice Identity" 
                icon={User} 
                value={voice} 
                onChange={setVoice} 
                options={voiceOptions} 
                color="pink"
             />

             {/* Accent Selection */}
             <CyberDropdown 
                label="Accent Modality" 
                icon={Globe} 
                value={accent} 
                onChange={(val) => setAccent(val as AccentType)} 
                options={accentOptions} 
                color="cyan"
             />

          </section>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !text.trim()}
            className={`
              relative group w-full min-h-[70px] overflow-hidden rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg
              ${isLoading ? 'cursor-wait' : 'hover:scale-[1.01] cursor-pointer hover:shadow-neon-cyan/20'}
            `}
          >
            {/* Button Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r from-neon-cyan via-purple-600 to-neon-pink opacity-90 transition-all duration-500 
                ${isLoading ? 'bg-[length:200%_200%] animate-pulse' : 'group-hover:opacity-100'}`} 
            />
            
            {/* Cyber Grid Overlay (Optional texture) */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

            {/* Content Container */}
            <div className="relative flex items-center gap-3 z-10">
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 text-black animate-spin" />
                  <span className="text-black font-bold uppercase tracking-widest text-lg pl-1">
                    Synthesizing<span className="animate-pulse">...</span>
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 text-black fill-black group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-black font-bold uppercase tracking-widest text-lg group-hover:tracking-[0.15em] transition-all duration-300">
                    Initialize Synthesis
                  </span>
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