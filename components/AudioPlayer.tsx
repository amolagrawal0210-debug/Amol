import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Reset state when src changes
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    if(audioRef.current) {
        audioRef.current.load();
    }
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setDuration(total);
    setProgress((current / total) * 100);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `vocalvibe-output-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(0,255,255,0.15)] animate-slide-up">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Volume2 className="text-neon-cyan w-5 h-5 animate-pulse" />
          <span className="text-neon-cyan font-bold tracking-widest text-sm uppercase">Audio Generated</span>
        </div>
        <span className="text-xs text-gray-400 font-mono">.MP3 / 24KHZ</span>
      </div>

      {/* Visualizer / Progress Bar */}
      <div className="relative h-12 bg-black/40 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center group cursor-pointer" onClick={togglePlay}>
         {/* Fake waveform bars */}
         <div className="absolute inset-0 flex items-center justify-center gap-[2px] opacity-30">
            {Array.from({ length: 40 }).map((_, i) => (
                <div 
                    key={i} 
                    className="w-1 bg-neon-pink rounded-full transition-all duration-300"
                    style={{ 
                        height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%',
                        opacity: i / 40 > progress / 100 ? 0.2 : 1 
                    }}
                />
            ))}
         </div>
         
         <div className="relative z-10">
             {isPlaying ? <Pause className="w-8 h-8 text-white fill-white" /> : <Play className="w-8 h-8 text-white fill-white ml-1" />}
         </div>
         
         {/* Progress Overlay */}
         <div 
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-neon-cyan to-neon-pink transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
         />
      </div>

      <button
        onClick={handleDownload}
        className="group relative w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:border-neon-pink/50"
      >
        <Download className="w-4 h-4 text-gray-300 group-hover:text-neon-pink transition-colors" />
        <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">DOWNLOAD FILE</span>
        <div className="absolute inset-0 rounded-xl ring-2 ring-neon-pink/0 group-hover:ring-neon-pink/50 transition-all duration-500" />
      </button>
    </div>
  );
};
