import React, { useState } from 'react';
import { Key, Lock, ExternalLink, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setError('Access Token required for neural link.');
      return;
    }
    onSave(inputKey.trim());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-midnight border border-neon-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.1)] overflow-hidden animate-slide-up">
        
        {/* Header decoration */}
        <div className="h-1 w-full bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-purple" />
        
        <div className="p-8 flex flex-col gap-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Lock className="w-6 h-6 text-neon-cyan" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Authentication Required</h2>
            <p className="text-gray-400 text-sm">
              Enter your Gemini API Key to establish a secure connection with the neural synthesis engine.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-neon-pink uppercase tracking-widest ml-1">
                API Access Token
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => {
                      setInputKey(e.target.value);
                      setError('');
                  }}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all font-mono text-sm"
                  placeholder="AIzaSy..."
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
              </div>
              {error && <p className="text-red-400 text-xs pl-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-white/5 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/50 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <ShieldCheck className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan transition-colors" />
              <span>ESTABLISH LINK</span>
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
             <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-pink transition-colors"
             >
                <span>Get your API Key from Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
             </a>
             <p className="text-[10px] text-gray-600 mt-2 max-w-xs mx-auto">
                Your key is stored locally in your browser and is never sent to our servers.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
