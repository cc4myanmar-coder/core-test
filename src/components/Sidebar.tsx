import React, { useState } from 'react';
import { 
  Database, LayoutDashboard, Briefcase, 
  Users, TrendingUp, Coins, User, LogOut, Globe, Sun, Moon
} from 'lucide-react';
import { Profile } from '../types';
import { Language, translations } from '../lib/translations';
import { COLOR_THEMES } from '../lib/themes';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: 'admin' | 'student';
  setCurrentRole: (role: 'admin' | 'student') => void;
  profiles: Profile[];
  onLogOut: () => void;
  userEmail?: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  colorThemeId: string;
  onColorThemeChange: (id: string) => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  profiles,
  onLogOut,
  userEmail,
  language,
  onLanguageChange,
  colorThemeId,
  onColorThemeChange,
  isLightMode,
  onToggleLightMode
}: SidebarProps) {
  
  const t = translations[language];
  const [sidebarLangDropdownOpen, setSidebarLangDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'overview', name: t.navOverview, icon: LayoutDashboard },
    { id: 'sql', name: t.navSqlSandbox, icon: Database, accent: true },
    { id: 'firms', name: t.navPropFirms, icon: Briefcase },
    { id: 'accounts', name: t.navAccounts, icon: Users },
    { id: 'trading', name: t.navTradingDesk, icon: TrendingUp },
    { id: 'payouts', name: t.navPayouts, icon: Coins }
  ];

  const currentProfile = profiles.find(p => p.role === currentRole);

  return (
    <aside className="w-full lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-5 min-h-screen" id="split-sidebar">
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          {/* Seamless logo wrapper with active slow-spin border and pulse */}
          <div className="w-11 h-11 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center relative p-1 overflow-hidden shadow-lg shadow-cyan-500/5">
            <div className="absolute inset-0 border border-dashed border-cyan-500/40 rounded-full animate-spin-slow pointer-events-none" />
            <img 
              src="https://ccsgfqstofavjjxjuxkk.supabase.co/storage/v1/object/public/assets/core.jpg" 
              alt="CORE logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full relative z-10"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-lg bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] animate-pulse">CORE</span>
              <span className="text-white text-xs font-bold font-sans tracking-wide">
                {language === 'mm' ? 'သင်တန်း' : language === 'th' ? 'แนะแนว' : 'Mentorship'}
              </span>
            </div>
            <p className="text-[9px] text-bull font-bold font-mono tracking-wider uppercase">{t.brandTagline}</p>
          </div>
        </div>

        {/* Global Controls Panel: Language & Color Theme */}
        <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850 space-y-3.5 shadow-inner">
          {/* Language Selector */}
          <div className="flex flex-col gap-1.5 relative">
            <button
              type="button"
              onClick={() => setSidebarLangDropdownOpen(!sidebarLangDropdownOpen)}
              className="w-full relative flex items-center bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 shadow-md text-slate-100 text-xs font-black uppercase text-left cursor-pointer transition-colors select-none"
            >
              <Globe size={13} className="text-cyan-400 mr-2 flex-shrink-0 animate-pulse" />
              <span className="mr-auto">{language}</span>
              <span className="text-slate-400 text-[8px] font-bold">▼</span>
            </button>

            {sidebarLangDropdownOpen && (
              <>
                {/* Click outside backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setSidebarLangDropdownOpen(false)} 
                />
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-950 border border-slate-800 rounded-lg py-1 shadow-xl z-50 animate-fade-in backdrop-blur-md overflow-hidden">
                  {(['en', 'mm', 'th'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang);
                        setSidebarLangDropdownOpen(false);
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

          {/* Color Theme Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse" />
              Theme / အရောင်တွဲ
            </span>
            <select
              value={colorThemeId}
              onChange={(e) => onColorThemeChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 px-2 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors"
            >
              {COLOR_THEMES.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {language === 'mm' ? theme.nameMm : language === 'th' ? theme.nameTh : theme.name}
                </option>
              ))}
            </select>
          </div>

          {/* Day / Night Mode Toggler */}
          <div className="flex flex-col gap-1.5 pt-0.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse" />
              Theme Mode / အလင်းအမှောင်
            </span>
            <button
              type="button"
              onClick={onToggleLightMode}
              className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-cyan-400 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                {isLightMode ? (
                  <Sun size={13} className="text-yellow-400 animate-spin-slow" />
                ) : (
                  <Moon size={13} className="text-amber-500" />
                )}
                <span>
                  {isLightMode 
                    ? (language === 'mm' ? 'နေ့ဘက် စနစ်' : language === 'th' ? 'โหมดกลางวัน' : 'Day Mode') 
                    : (language === 'mm' ? 'ညဘက် စနစ်' : language === 'th' ? 'โหมดกลางคืน' : 'Night Mode')}
                </span>
              </div>
              <span className="text-[8px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest font-extrabold font-mono">
                {isLightMode ? 'Day' : 'Night'}
              </span>
            </button>
          </div>
        </div>

        <hr className="border-slate-800/80" />

        {/* Tab Selection menu */}
        <nav className="space-y-1.5">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-250 text-left cursor-pointer ${
                  isActive 
                    ? 'bg-slate-850 text-bull font-extrabold border-l-2 border-bull shadow-md shadow-cyan-500/5' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <IconComponent size={16} className={isActive ? 'text-bull' : ''} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Switcher Section */}
      <div className="mt-8 space-y-4">
        <hr className="border-slate-800/80" />
        
        <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-2xl space-y-3 shadow-inner">
          <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider font-bold">
            {t.activeSession}
          </span>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
              <User size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-slate-100 block truncate">
                {currentRole === 'admin' ? t.headRisk : t.traderStudent}
              </span>
              <span className="text-[9px] text-slate-400 font-mono block truncate" title={userEmail || currentProfile?.email}>
                {userEmail || currentProfile?.email}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              onClick={() => setCurrentRole('admin')}
              className={`py-1.5 px-2 text-[10px] rounded-lg font-bold transition-all border cursor-pointer ${currentRole === 'admin' ? 'bg-bull-alpha text-bull border-bull-alpha' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400'}`}
            >
              {t.headRisk}
            </button>
            <button
              onClick={() => setCurrentRole('student')}
              className={`py-1.5 px-2 text-[10px] rounded-lg font-bold transition-all border cursor-pointer ${currentRole === 'student' ? 'bg-bull-alpha text-bull border-bull-alpha' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400'}`}
            >
              {t.traderStudent}
            </button>
          </div>

          <button
            onClick={onLogOut}
            className="w-full mt-2 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold rounded-lg text-[10px] uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors border border-red-500/25 cursor-pointer"
          >
            <LogOut size={12} />
            <span>{t.signOutBtn}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
