import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  className?: string;
}

export interface DropdownGroup {
  label: string;
  options: DropdownOption[];
}

interface CyberDropdownProps {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  options: (DropdownOption | DropdownGroup)[];
  color?: 'cyan' | 'pink';
}

export const CyberDropdown: React.FC<CyberDropdownProps> = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  options,
  color = 'cyan' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const getDisplayLabel = () => {
    for (const item of options) {
      if ('options' in item) {
        const found = item.options.find(opt => opt.value === value);
        if (found) return found.label;
      } else {
        if (item.value === value) return item.label;
      }
    }
    return value;
  };

  const focusRing = color === 'cyan' ? 'ring-neon-cyan' : 'ring-neon-pink';
  const activeBg = color === 'cyan' ? 'bg-neon-cyan/20' : 'bg-neon-pink/20';
  const activeText = color === 'cyan' ? 'text-neon-cyan' : 'text-neon-pink';
  const borderColorClass = isOpen ? (color === 'cyan' ? 'border-neon-cyan ring-1 ring-neon-cyan' : 'border-neon-pink ring-1 ring-neon-pink') : 'border-white/10';

  return (
    // Dynamic z-index: z-50 when open ensures it floats ABOVE the next dropdown in the DOM order
    <div className={`relative group ${isOpen ? 'z-50' : 'z-20'}`} ref={dropdownRef}>
        <div className={`absolute inset-0 bg-white/5 rounded-xl blur-sm ${isOpen ? 'bg-white/10' : ''} transition`}></div>
        
        <div className="relative bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col gap-2 transition-colors duration-300">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Icon className={`w-4 h-4 ${activeText}`} />
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/5 text-left text-white border rounded-lg px-4 py-3 text-sm flex items-center justify-between transition-all duration-200 hover:bg-white/10 ${borderColorClass}`}
            >
                <span className="truncate font-medium">{getDisplayLabel()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0a0a] border border-white/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-slide-up max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {options.map((item, index) => {
                        // Render Group
                        if ('options' in item) {
                            return (
                                <div key={index}>
                                    <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold bg-white/5 border-b border-white/5">
                                        {item.label}
                                    </div>
                                    {item.options.map((opt) => (
                                        <div
                                            key={opt.value}
                                            onClick={() => handleSelect(opt.value)}
                                            className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors border-l-2 ${opt.value === value ? `${activeBg} ${activeText} border-${color === 'cyan' ? 'neon-cyan' : 'neon-pink'} font-bold` : 'border-transparent text-gray-300 hover:bg-white/10 hover:border-white/20'}`}
                                        >
                                            <span className={opt.className}>{opt.label}</span>
                                            {opt.value === value && <Check className="w-4 h-4" />}
                                        </div>
                                    ))}
                                </div>
                            );
                        } 
                        // Render Single Option
                        else {
                            return (
                                <div
                                    key={index}
                                    onClick={() => handleSelect(item.value)}
                                    className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors border-l-2 ${item.value === value ? `${activeBg} ${activeText} border-${color === 'cyan' ? 'neon-cyan' : 'neon-pink'} font-bold` : 'border-transparent text-gray-300 hover:bg-white/10 hover:border-white/20'}`}
                                >
                                    <span className={item.className}>{item.label}</span>
                                    {item.value === value && <Check className="w-4 h-4" />}
                                </div>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    </div>
  );
};