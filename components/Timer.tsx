
import React, { useState, useEffect } from 'react';

interface TimerProps {
  t: any;
}

const Timer: React.FC<TimerProps> = ({ t }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) setSeconds(seconds - 1);
        else if (minutes > 0) { setMinutes(minutes - 1); setSeconds(59); }
        else { setIsActive(false); alert("Time complete!"); }
      }, 1000);
    } else clearInterval(interval);
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setMinutes(mode === 'study' ? 25 : 5); setSeconds(0); };
  const switchMode = (m: 'study' | 'break') => { setMode(m); setMinutes(m === 'study' ? 25 : 5); setSeconds(0); setIsActive(false); };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in zoom-in-95 duration-500">
      <div className="bg-white border-2 border-brand-gray rounded-[60px] p-16 shadow-2xl text-center w-full max-w-xl">
        <div className="flex justify-center gap-6 mb-12">
          <button 
            onClick={() => switchMode('study')}
            className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${mode === 'study' ? 'bg-brand-blue text-white shadow-xl scale-105' : 'bg-gray-100 text-gray-500'}`}
          >
            {t.study}
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${mode === 'break' ? 'bg-brand-red text-white shadow-xl scale-105' : 'bg-gray-100 text-gray-500'}`}
          >
            {t.break}
          </button>
        </div>

        <div className="text-[120px] font-black tabular-nums tracking-tighter mb-12 text-black leading-none">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex gap-8 justify-center">
          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-4xl shadow-xl transition-all hover:scale-110 active:scale-95 ${isActive ? 'bg-gray-200 text-black' : 'bg-brand-blue text-white'}`}
          >
            <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button 
            onClick={resetTimer}
            className="w-24 h-24 bg-white border-4 border-brand-gray rounded-[32px] flex items-center justify-center text-3xl shadow-lg transition-all hover:scale-110 active:scale-95 text-black"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <div className="mt-16 space-y-6">
          <p className="text-lg font-black text-gray-500 flex items-center justify-center gap-4 italic">
            <i className="fa-solid fa-quote-left text-brand-blue opacity-30"></i>
            {t.focusTitle}
            <i className="fa-solid fa-quote-right text-brand-blue opacity-30"></i>
          </p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`w-5 h-5 rounded-lg transition-all ${i <= 2 ? 'bg-brand-blue shadow-lg' : 'bg-gray-200'}`}></div>
            ))}
          </div>
          <p className="text-sm font-black text-black uppercase tracking-[0.2em]">{t.session} 2 / 4</p>
        </div>
      </div>
    </div>
  );
};

export default Timer;
