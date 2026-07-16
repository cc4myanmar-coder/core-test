import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Key, Mail, AlertTriangle, Info, Globe, Eye, EyeOff, LogIn, Sun, Moon } from 'lucide-react';
import { Language, translations } from '../lib/translations';
import { motion } from 'motion/react';

interface LoginProps {
  onLoginSuccess: (session: any) => void;
  onNavigateToReset: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
}

export default function Login({ 
  onLoginSuccess, 
  onNavigateToReset, 
  language, 
  onLanguageChange,
  isLightMode,
  onToggleLightMode
}: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Custom UI interactive states
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data?.session) {
        onLoginSuccess(data.session);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-x-hidden overflow-y-auto py-8 lg:py-12 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Immersive Animated Background Particles & Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Decorative Floating Tech Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Compact Custom Language Selector & Theme Toggle with slide-down animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md mb-6 flex justify-between items-center z-30"
      >
        {/* Toggle Day/Night Mode Button */}
        <button
          type="button"
          onClick={onToggleLightMode}
          className="flex items-center justify-center bg-slate-900/95 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 shadow-lg backdrop-blur-md cursor-pointer transition-colors text-slate-100 hover:text-cyan-400"
          title={isLightMode ? "Switch to Night Mode" : "Switch to Day Mode"}
        >
          {isLightMode ? (
            <Moon size={15} className="text-amber-500 animate-bounce" />
          ) : (
            <Sun size={15} className="text-yellow-400 animate-spin-slow" />
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center bg-slate-900/95 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-colors text-slate-100 text-xs font-black uppercase select-none relative"
          >
            <Globe size={13} className="text-cyan-400 animate-spin-slow mr-1.5 flex-shrink-0" />
            <span className="mr-4">{language}</span>
            <span className="absolute right-2.5 text-slate-400 text-[8px] font-bold">▼</span>
          </button>

          {langDropdownOpen && (
            <>
              {/* Invisible overlay backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setLangDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-32 bg-slate-950/95 border border-slate-800 rounded-xl py-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 animate-fade-in backdrop-blur-md overflow-hidden">
                {(['en', 'mm', 'th'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold transition-all flex items-center justify-between hover:bg-slate-900 cursor-pointer ${
                      language === lang ? 'text-cyan-400 bg-slate-900/60' : 'text-slate-300'
                    }`}
                  >
                    <span>{lang === 'en' ? 'English' : lang === 'mm' ? 'မြန်မာ' : 'ไทย'}</span>
                    <span className="text-[10px] opacity-65 uppercase font-mono">{lang}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Main Login Card - Glassmorphic high-fidelity with bouncy zoom & animated running border */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-md relative group p-[1.5px] rounded-2xl overflow-visible"
      >
        {/* Animated Running Border Background Track and Sweeping laser */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_20%,#06b6d4_40%,#3b82f6_60%,transparent_80%)] animate-[spin_4s_linear_infinite]" />
        </div>

        {/* Inner Card Content */}
        <div className="relative w-full bg-slate-900/95 rounded-[15px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl z-10 overflow-visible">
          {/* Outer Glow on hover */}
          <div className="absolute inset-0 rounded-[15px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/0 to-cyan-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Brand Header with Logo */}
        <div className="p-8 pb-5 text-center border-b border-slate-800/60 relative z-10">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            
            {/* Seamless, dynamic animated Logo */}
            <motion.div 
              animate={{ 
                rotate: [0, 2, 0, -2, 0],
                x: [0, -5, 0, 5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 bg-slate-950 border border-slate-800/80 rounded-full flex items-center justify-center relative p-1 overflow-hidden group shadow-xl"
            >
              {/* Sleek rotating tech border outline */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-cyan-500/40 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-dotted border-blue-500/30 rounded-full"
              />
              
              <img 
                src="https://ccsgfqstofavjjxjuxkk.supabase.co/storage/v1/object/public/assets/core.jpg" 
                alt="CORE logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full relative z-10"
              />
            </motion.div>
            
            {/* Highly highlighted program name */}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-black tracking-tight uppercase font-sans flex items-center gap-1.5"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(6,182,212,0.65)] font-black text-3xl tracking-widest animate-pulse">CORE</span>
              <span className="text-slate-100 text-xl font-semibold tracking-wide">
                {language === 'mm' ? 'သင်တန်း' : language === 'th' ? 'แนะแนว' : 'Mentorship'}
              </span>
            </motion.span>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-slate-300 text-sm font-medium"
          >
            {t.loginTitle}
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-cyan-400/80 text-xs font-mono tracking-wider uppercase font-bold mt-1.5"
          >
            {t.brandTagline}
          </motion.p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6 relative z-10">
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-400 font-semibold flex items-center gap-2.5 shadow-md shadow-rose-950/20"
            >
              <AlertTriangle size={15} className="flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <div className="space-y-5">
            {/* Email Field with staggered lift and custom rainbow border container */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.emailLabel}</label>
              
              <div className={`rainbow-input-wrapper ${emailFocused ? 'focused' : ''}`}>
                <div className="input-content-inner flex items-center">
                  <span className="absolute left-3.5 flex items-center text-slate-500 pointer-events-none">
                    <Mail size={16} className={`${emailFocused ? 'text-cyan-400' : 'text-slate-500'} transition-colors`} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="student@propfirm.com"
                    value={email}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none transition-colors text-sm border-none ring-0 outline-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Password Field with staggered lift, custom rainbow border, eye toggle (Reset Test link removed) */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-2"
            >
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.passwordLabel}</label>
              
              <div className={`rainbow-input-wrapper ${passwordFocused ? 'focused' : ''}`}>
                <div className="input-content-inner flex items-center relative">
                  <span className="absolute left-3.5 flex items-center text-slate-500 pointer-events-none">
                    <Key size={16} className={`${passwordFocused ? 'text-cyan-400' : 'text-slate-500'} transition-colors`} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none transition-colors text-sm border-none ring-0 outline-none"
                  />
                  {/* Eye Toggle Icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Button - Fully Interactive 3D Entry Door Icon replacement (No text as requested) */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs tracking-widest transition-all uppercase flex items-center justify-center shadow-[0_12px_24px_rgba(6,182,212,0.25)] hover:shadow-[0_16px_32px_rgba(6,182,212,0.45)] cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <motion.div 
                className="flex items-center justify-center"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 350, damping: 12 }}
              >
                <LogIn size={22} strokeWidth={3} className="text-slate-950" />
              </motion.div>
            )}
          </motion.button>
        </form>

        {/* Configuration Notice (Demo State Indicator) */}
        {!isSupabaseConfigured && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="p-5 bg-slate-950/60 border-t border-slate-800/60 text-[11px] text-amber-300/90 leading-relaxed flex gap-3 items-start px-8"
          >
            <Info size={15} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-400 block mb-0.5">Simulated Supabase Auth Active</span>
              <p className="text-slate-400">
                မိတ်ဆွေ၊ Real Supabase config မရှိသေးသဖြင့် Demo စနစ်ဖြင့် အလုပ်လုပ်နေပါသည်။ <br />
                <span className="text-[#38bdf8] font-bold font-mono">student@propfirm.com</span> (သို့) <br />
                <span className="text-[#38bdf8] font-bold font-mono">admin@propfirm.com</span> (စကားဝှက်မလို သို့မဟုတ် အနည်းဆုံး ၆ လုံး ရိုက်ပါ) ကို ရိုက်ထည့်၍ အလွယ်တကူ စမ်းသပ်နိုင်ပါသည်။
              </p>
            </div>
          </motion.div>
        )}
        </div> {/* Close Inner Card Content */}
      </motion.div>
    </div>
  );
}

