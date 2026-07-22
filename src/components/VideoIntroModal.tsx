import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, Sparkles, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface VideoIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VideoIntroModal: React.FC<VideoIntroModalProps> = ({ isOpen, onClose, language }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play policy handling if browser restricts unmuted autoplay
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-950 flex flex-col justify-between overflow-hidden animate-fade-in">
      {/* Full screen background video - seamlessly fills 100% viewport */}
      <div className="absolute inset-0 z-0 w-full h-full bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src="https://ccsgfqstofavjjxjuxkk.supabase.co/storage/v1/object/public/assets/Videos/CORE%20Intro.mp4"
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={onClose}
          playsInline
          autoPlay
        />
        {/* Subtle top/bottom dark gradient vignette for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none" />
      </div>

      {/* Top Floating Header Overlay */}
      <div className="relative z-10 flex items-center justify-between p-6 md:px-10 md:py-6 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-slate-950 border border-emerald-500/40 p-0.5 overflow-hidden shadow-lg shadow-emerald-500/20">
            <img 
              src="https://ccsgfqstofavjjxjuxkk.supabase.co/storage/v1/object/public/assets/core.jpg" 
              alt="CORE Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
              CORE Mentorship
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30 font-mono">
                Futures Prop Firm
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-mono">NQ / MNQ / ES Trading Evaluation Platform</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-6 py-3 text-xs font-black text-slate-950 transition-all shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          <span>{language === 'mm' ? 'စနစ်သို့ ဝင်ရောက်မည်' : 'Enter Platform'}</span>
          <SkipForward className="h-4 w-4 stroke-[3]" />
        </button>
      </div>

      {/* Bottom Floating Controls Bar */}
      <div className="relative z-10 p-6 md:px-10 md:py-6 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="rounded-full bg-emerald-500 p-3.5 text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95 cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-slate-950" /> : <Play className="h-5 w-5 fill-slate-950 ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="rounded-full bg-slate-900/80 p-3.5 text-slate-200 hover:bg-slate-800 transition-all border border-slate-700/60 backdrop-blur-md cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5 text-amber-400" /> : <Volume2 className="h-5 w-5 text-emerald-400" />}
            </button>

            <div className="text-xs font-mono text-slate-300 hidden sm:block">
              {language === 'mm' ? 'CORE Intro Video မိတ်ဆက်' : 'CORE Mentorship Video Presentation'}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="h-4 w-4" />
              <span>CORE Mentorship Futures System</span>
            </div>

            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 hover:bg-slate-800 cursor-pointer"
            >
              <span>{language === 'mm' ? 'ကျော်သွားမည် (Skip)' : 'Skip Video'}</span>
            </button>
          </div>
        </div>

        {/* Edge-to-edge full width progress bar */}
        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoIntroModal;

