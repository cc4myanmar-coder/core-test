import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Key, AlertTriangle, CheckCircle, ArrowLeft, Globe } from 'lucide-react';
import { Language, translations } from '../lib/translations';
import { motion } from 'motion/react';

interface ResetPasswordProps {
  onNavigateToLogin: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function ResetPassword({ onNavigateToLogin, language, onLanguageChange }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = translations[language];

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage(language === 'en' 
        ? 'Password must be at least 6 characters long.' 
        : language === 'th' 
          ? 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' 
          : 'Password သည် အနည်းဆုံး စာလုံး ၆ လုံး ရှိရပါမည်။');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(language === 'en' 
        ? 'New passwords do not match.' 
        : language === 'th' 
          ? 'รหัสผ่านใหม่ไม่ตรงกัน' 
          : 'စကားဝှက်အသစ် နှစ်ခု တူညီမှု မရှိပါ။ ပြန်လည်စစ်ဆေးပါ။');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during password update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] flex flex-col justify-center items-center p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Top Language Select Box with slide-down animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mb-6 flex justify-end items-center gap-2.5 z-20"
      >
        <span className="text-slate-400 text-xs flex items-center gap-1.5 font-mono">
          <Globe size={13} className="text-cyan-400" />
          Choose Language:
        </span>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="bg-slate-900/90 border border-slate-800 text-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:border-cyan-500 transition-colors shadow-lg cursor-pointer backdrop-blur-md"
        >
          <option value="en">English (EN)</option>
          <option value="mm">မြန်မာဘာသာ (MM)</option>
          <option value="th">ภาษาไทย (TH)</option>
        </select>
      </motion.div>

      {/* Card Wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden relative group hover:border-slate-700/50 transition-colors duration-500"
      >
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

        {/* Brand Header */}
        <div className="p-8 pb-5 text-center border-b border-slate-800/60 relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 mb-4"
          >
            <div className="w-16 h-16 bg-[#0c1226]/90 rounded-2xl flex items-center justify-center shadow-2xl border border-slate-800 p-2 transform transition-transform group-hover:scale-105 duration-300 relative">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 rounded-tl" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 rounded-br" />
              
              <img 
                src="https://ccsgfqstofavjjxjuxkk.supabase.co/storage/v1/object/public/assets/core.jpg" 
                alt="CORE logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            
            <span className="text-2xl font-black tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent uppercase font-sans">
              {t.brandName}
            </span>
          </motion.div>
          
          <h2 className="text-lg font-bold text-white tracking-tight">{t.resetNoticeTitle}</h2>
          <p className="text-cyan-400/80 font-mono text-[10px] uppercase font-bold tracking-widest mt-1">/auth/reset-password</p>
        </div>

        <div className="p-8 relative z-10">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/35 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                <CheckCircle size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">{t.resetSuccessTitle}</h3>
                <p className="text-sm text-slate-400">{t.resetSuccessText}</p>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNavigateToLogin}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#070b19] font-black rounded-xl text-xs tracking-widest transition-all uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer"
              >
                <ArrowLeft size={16} strokeWidth={3} />
                <span>{t.backToLoginBtn}</span>
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-400 font-semibold flex items-center gap-2.5 shadow-md"
                >
                  <AlertTriangle size={15} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <div className="p-4 bg-[#0a101f] border border-slate-800/80 rounded-xl text-xs text-slate-300 leading-relaxed font-sans">
                {t.resetNoticeText}
              </div>

              <div className="space-y-4">
                {/* New Password */}
                <motion.div 
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.newPasswordLabel}</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <Key size={16} />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#0a101f] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300 text-sm shadow-inner"
                    />
                  </div>
                </motion.div>

                {/* Confirm Password */}
                <motion.div 
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.confirmPasswordLabel}</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <Key size={16} />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#0a101f] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300 text-sm shadow-inner"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#070b19] font-black rounded-xl text-xs tracking-widest transition-all uppercase flex items-center justify-center gap-2 shadow-[0_12px_24px_rgba(6,182,212,0.2)] hover:shadow-[0_16px_32px_rgba(6,182,212,0.35)] cursor-pointer"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-[#070b19] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{t.resetConfirmBtn}</span>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="w-full py-2.5 bg-transparent hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={13} strokeWidth={2.5} />
                  <span>{t.backToLoginBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
