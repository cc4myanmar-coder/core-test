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

  const t = translations[language] || translations.en;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl transition-all duration-500 p-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900 shadow-2xl shadow-emerald-500/10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img 
              src="https://ccsgfqstofavjjxjuxkk.supabase.co/storage/v1/object/public/assets/core.jpg" 
              alt="CORE Logo" 
              className="h-8 w-8 rounded-lg object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wide flex items-center gap-1.5">
                CORE Mentorship Program
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  Intro
                </span>
              </h3>
              <p className="text-xs text-slate-400">Futures Prop Firm Account Management System</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-all shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95"
          >
            <span>{language === 'mm' ? 'စနစ်သို့ ဝင်ရောက်မည်' : 'Enter Platform'}</span>
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center group overflow-hidden">
          <video
            ref={videoRef}
            src="https://ccsgfqstofavjjxjuxkk.supabase.co/storage/v1/object/public/assets/Videos/CORE%20Intro.mp4"
            className="h-full w-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={onClose}
            playsInline
          />

          {/* Video Overlay Controls on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-300 border border-slate-700/50 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                NQ / MNQ / ES Futures Engine
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="rounded-full bg-emerald-500 p-3 text-slate-950 hover:bg-emerald-400 transition-all shadow-lg hover:scale-110 active:scale-95"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-5 w-5 fill-slate-950" /> : <Play className="h-5 w-5 fill-slate-950 ml-0.5" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="rounded-full bg-slate-800/80 p-3 text-slate-200 hover:bg-slate-700 transition-all backdrop-blur-md"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-300 font-semibold">CORE SECURE MANAGEMENT</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/90 px-6 py-3 text-xs text-slate-400">
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            {language === 'mm' ? 'CORE Mentorship - ပရော်ဖက်ရှင်နယ် Futures Trading သင်တန်း' : 'CORE Mentorship Program — Professional Futures Prop Firm System'}
          </p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-emerald-400 transition-colors font-medium flex items-center gap-1"
          >
            {language === 'mm' ? 'ကျော်သွားမည် (Skip)' : 'Skip Video'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default VideoIntroModal;
