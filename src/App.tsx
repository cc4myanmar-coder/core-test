import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Users, LayoutDashboard, Terminal, RefreshCw, Briefcase, Award, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import SQLPanel from './components/SQLPanel';
import DashboardOverview from './components/DashboardOverview';
import PropFirmsPanel from './components/PropFirmsPanel';
import AccountsPanel from './components/AccountsPanel';
import TradingDeskPanel from './components/TradingDeskPanel';
import PayoutsPanel from './components/PayoutsPanel';
import { supabase } from './lib/supabase';
import { translations, Language } from './lib/translations';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import { 
  mockProfiles, 
  mockPropFirms, 
  mockPropFirmRules, 
  mockStudentAccounts, 
  mockTradeLogs, 
  mockPayouts 
} from './mockData';
import { PropFirm, PropFirmRule, StudentAccount, TradeLog, Payout, ColorTheme } from './types';
import { COLOR_THEMES } from './lib/themes';

export default function App() {
  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core application states
  const [currentTab, setCurrentTab] = useState('overview');
  const [currentRole, setCurrentRole] = useState<'admin' | 'student'>('student');

  // Dynamic Theme state
  const [colorThemeId, setColorThemeId] = useState<string>(() => {
    return localStorage.getItem('core_bull_bear_theme') || 'neon-slate';
  });

  const currentTheme = COLOR_THEMES.find(th => th.id === colorThemeId) || COLOR_THEMES[0];

  const changeTheme = (themeId: string) => {
    setColorThemeId(themeId);
    localStorage.setItem('core_bull_bear_theme', themeId);
  };

  // Sync theme variables to CSS root custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-bull', currentTheme.bullColor);
    root.style.setProperty('--color-bear', currentTheme.bearColor);
    root.style.setProperty('--bg-bull-alpha', `${currentTheme.bullColor}15`);
    root.style.setProperty('--bg-bear-alpha', `${currentTheme.bearColor}15`);
    root.style.setProperty('--border-bull-alpha', `${currentTheme.bullColor}25`);
    root.style.setProperty('--border-bear-alpha', `${currentTheme.bearColor}25`);
  }, [colorThemeId]);

  // Light/Dark theme mode state
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem('core_theme_mode') === 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isLightMode) {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
    localStorage.setItem('core_theme_mode', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);


  // Multi-language localization state (EN, MM, TH)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('core_language');
    return (saved === 'en' || saved === 'mm' || saved === 'th') ? saved : 'mm'; // Default to MM as user queried in MM
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('core_language', lang);
  };

  const t = translations[language];

  // Supabase Auth states
  const [session, setSession] = useState<any>(null);
  const [authView, setAuthView] = useState<'login' | 'reset-password'>('login');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Parse URL hash/path to determine active Auth view
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (
        path.includes('/auth/reset-password') || 
        hash.includes('/auth/reset-password') || 
        hash.includes('type=recovery') || 
        window.location.search.includes('type=recovery')
      ) {
        setAuthView('reset-password');
      } else {
        setAuthView('login');
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);

    // Subscribe to auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setIsAuthLoading(false);

      if (currentSession?.user?.user_metadata?.role) {
        setCurrentRole(currentSession.user.user_metadata.role);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []);

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Simulated Database states loaded from LocalStorage
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [rules, setRules] = useState<PropFirmRule[]>([]);
  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [trades, setTrades] = useState<TradeLog[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  // Initialize data on load
  useEffect(() => {
    const savedFirms = localStorage.getItem('prop_firms');
    const savedRules = localStorage.getItem('prop_firm_rules');
    const savedAccounts = localStorage.getItem('student_accounts');
    const savedTrades = localStorage.getItem('trade_logs');
    const savedPayouts = localStorage.getItem('payouts');

    if (savedFirms) setFirms(JSON.parse(savedFirms));
    else {
      setFirms(mockPropFirms);
      localStorage.setItem('prop_firms', JSON.stringify(mockPropFirms));
    }

    if (savedRules) setRules(JSON.parse(savedRules));
    else {
      setRules(mockPropFirmRules);
      localStorage.setItem('prop_firm_rules', JSON.stringify(mockPropFirmRules));
    }

    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    else {
      setAccounts(mockStudentAccounts);
      localStorage.setItem('student_accounts', JSON.stringify(mockStudentAccounts));
    }

    if (savedTrades) setTrades(JSON.parse(savedTrades));
    else {
      setTrades(mockTradeLogs);
      localStorage.setItem('trade_logs', JSON.stringify(mockTradeLogs));
    }

    if (savedPayouts) setPayouts(JSON.parse(savedPayouts));
    else {
      setPayouts(mockPayouts);
      localStorage.setItem('payouts', JSON.stringify(mockPayouts));
    }
  }, []);

  // Sync to local storage helper
  const syncState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Actions
  const handleAddFirm = (name: string, logoUrl?: string) => {
    const newFirm: PropFirm = {
      id: `firm-${Date.now()}`,
      name,
      logo_url: logoUrl
    };
    const updated = [...firms, newFirm];
    setFirms(updated);
    syncState('prop_firms', updated);
  };

  const handleAddRule = (rule: Omit<PropFirmRule, 'id'>) => {
    const newRule: PropFirmRule = {
      ...rule,
      id: `rule-${Date.now()}`
    };
    const updated = [...rules, newRule];
    setRules(updated);
    syncState('prop_firm_rules', updated);
  };

  const handleDeleteFirm = (id: string) => {
    const updatedFirms = firms.filter(f => f.id !== id);
    const updatedRules = rules.filter(r => r.prop_firm_id !== id);
    setFirms(updatedFirms);
    setRules(updatedRules);
    syncState('prop_firms', updatedFirms);
    syncState('prop_firm_rules', updatedRules);
  };

  const handleDeleteRule = (id: string) => {
    const updated = rules.filter(r => r.id !== id);
    setRules(updated);
    syncState('prop_firm_rules', updated);
  };

  const handleAddAccount = (acc: Omit<StudentAccount, 'id' | 'highest_balance'>) => {
    const newAcc: StudentAccount = {
      ...acc,
      id: `acc-${Date.now()}`,
      highest_balance: acc.current_balance
    };
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    syncState('student_accounts', updated);
  };

  const handleUpdateAccount = (id: string, updates: Partial<StudentAccount>) => {
    const updated = accounts.map(acc => {
      if (acc.id === id) {
        const next = { ...acc, ...updates };
        if (updates.current_balance !== undefined) {
          next.highest_balance = Math.max(acc.highest_balance, updates.current_balance);
        }
        return next;
      }
      return acc;
    });
    setAccounts(updated);
    syncState('student_accounts', updated);
  };

  const handleDeleteAccount = (id: string) => {
    const updated = accounts.filter(acc => acc.id !== id);
    setAccounts(updated);
    syncState('student_accounts', updated);
  };

  const handleAddTrade = (trade: Omit<TradeLog, 'id'>) => {
    const newTrade: TradeLog = {
      ...trade,
      id: `trade-${Date.now()}`
    };
    const updated = [...trades, newTrade];
    setTrades(updated);
    syncState('trade_logs', updated);
  };

  const handleAddPayout = (payout: Omit<Payout, 'id'>) => {
    const newPayout: Payout = {
      ...payout,
      id: `payout-${Date.now()}`
    };
    const updated = [...payouts, newPayout];
    setPayouts(updated);
    syncState('payouts', updated);
  };

  const handleUpdateAccountStatus = (id: string, status: any, isEditable: boolean) => {
    const updated = accounts.map(acc => {
      if (acc.id === id) {
        return { ...acc, status, is_editable: isEditable };
      }
      return acc;
    });
    setAccounts(updated);
    syncState('student_accounts', updated);
  };

  const handleUpdateAccountBalance = (id: string, newBalance: number, highestBalance: number) => {
    const updated = accounts.map(acc => {
      if (acc.id === id) {
        return { ...acc, current_balance: newBalance, highest_balance: highestBalance };
      }
      return acc;
    });
    setAccounts(updated);
    syncState('student_accounts', updated);
  };

  const resetAllMockData = () => {
    if (confirm('Are you sure you want to restore the simulation database to standard default parameters? All customized items will be reset.')) {
      localStorage.clear();
      setFirms(mockPropFirms);
      setRules(mockPropFirmRules);
      setAccounts(mockStudentAccounts);
      setTrades(mockTradeLogs);
      setPayouts(mockPayouts);
      setCurrentTab('overview');
      setIsMobileMenuOpen(false);
    }
  };

  // Switch content renderer
  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <DashboardOverview
            accounts={accounts}
            trades={trades}
            payouts={payouts}
            rules={rules}
            currentRole={currentRole}
            onNavigateToTrades={() => setCurrentTab('trading')}
            onNavigateToAccounts={() => setCurrentTab('accounts')}
            onNavigateToPayouts={() => setCurrentTab('payouts')}
            t={t}
            language={language}
            theme={currentTheme}
          />
        );
      case 'sql':
        return <SQLPanel t={t} language={language} />;
      case 'firms':
        return (
          <PropFirmsPanel
            firms={firms}
            rules={rules}
            currentRole={currentRole}
            onAddFirm={handleAddFirm}
            onAddRule={handleAddRule}
            onDeleteFirm={handleDeleteFirm}
            onDeleteRule={handleDeleteRule}
            t={t}
            language={language}
          />
        );
      case 'accounts':
        return (
          <AccountsPanel
            accounts={accounts}
            rules={rules}
            profiles={mockProfiles}
            currentRole={currentRole}
            onAddAccount={handleAddAccount}
            onUpdateAccount={handleUpdateAccount}
            onDeleteAccount={handleDeleteAccount}
            t={t}
            language={language}
          />
        );
      case 'trading':
        return (
          <TradingDeskPanel
            accounts={accounts}
            rules={rules}
            trades={trades}
            onAddTrade={handleAddTrade}
            onUpdateAccountStatus={handleUpdateAccountStatus}
            onUpdateAccountBalance={handleUpdateAccountBalance}
            t={t}
            language={language}
          />
        );
      case 'payouts':
        return (
          <PayoutsPanel
            accounts={accounts}
            payouts={payouts}
            rules={rules}
            currentRole={currentRole}
            onAddPayout={handleAddPayout}
            onUpdateAccountBalance={handleUpdateAccountBalance}
            t={t}
            language={language}
          />
        );
      default:
        return <div className="text-white text-xs">View Not Found</div>;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-xs font-semibold mt-4 tracking-wider uppercase animate-pulse">
          {language === 'en' ? 'Please wait...' : language === 'th' ? 'กรุณารอสักครู่...' : 'ခဏစောင့်ဆိုင်းပေးပါ...'}
        </span>
      </div>
    );
  }

  if (!session) {
    if (authView === 'reset-password') {
      return (
        <ResetPassword 
          language={language}
          onLanguageChange={changeLanguage}
          onNavigateToLogin={() => {
            window.location.hash = '/login';
            setAuthView('login');
          }} 
        />
      );
    }
    return (
      <Login 
        language={language}
        onLanguageChange={changeLanguage}
        onLoginSuccess={(newSession) => {
          setSession(newSession);
        }} 
        onNavigateToReset={() => {
          window.location.hash = '/auth/reset-password';
          setAuthView('reset-password');
        }}
        isLightMode={isLightMode}
        onToggleLightMode={() => setIsLightMode(!isLightMode)}
      />
    );
  }

  const mobileMenuItems = [
    { id: 'overview', name: t.navOverview },
    { id: 'sql', name: t.navSqlSandbox },
    { id: 'firms', name: t.navPropFirms },
    { id: 'accounts', name: t.navAccounts },
    { id: 'trading', name: t.navTradingDesk },
    { id: 'payouts', name: t.navPayouts }
  ];

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-slate-950 flex flex-col lg:flex-row font-sans text-slate-300 antialiased selection:bg-emerald-500 selection:text-slate-950" id="main-root">
      
      {/* Mobile Top Navigation bar */}
      <header className="lg:hidden bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-center justify-between sticky top-0 z-40 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 p-1.5 overflow-hidden">
            <img 
              src="https://ccsgfqstofavjjxjuxkk.supabase.co/storage/v1/object/public/assets/Core.png" 
              alt="CORE logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-tight">{t.brandName}</h1>
            <p className="text-[9px] text-bull font-mono tracking-wider uppercase font-semibold">{t.brandTagline}</p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-slate-900 border-b border-slate-800 z-30 p-5 space-y-4 max-h-[calc(100vh-65px)] overflow-y-auto">
          {/* Mobile Language & Theme Chooser */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider">Language / ဘာသာစကား</span>
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as Language)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 px-2 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="mm">မြန်မာဘာသာ (MM)</option>
                <option value="th">ภาษาไทย (TH)</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider">Theme / အရောင်</span>
              <select
                value={colorThemeId}
                onChange={(e) => changeTheme(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 px-2 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {COLOR_THEMES.map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {language === 'mm' ? theme.nameMm : language === 'th' ? theme.nameTh : theme.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-slate-800" />

          <nav className="flex flex-col gap-2">
            {mobileMenuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-3 text-left rounded-lg text-xs font-semibold ${currentTab === item.id ? 'bg-slate-850 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:text-white hover:bg-slate-850/50'}`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <hr className="border-slate-800" />

          {/* Quick switcher in mobile menu */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 font-mono block uppercase">{t.switchSandboxRole}</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setCurrentRole('admin');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 px-3 rounded-lg border text-center font-bold ${currentRole === 'admin' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                {t.headRisk}
              </button>
              <button
                onClick={() => {
                  setCurrentRole('student');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 px-3 rounded-lg border text-center font-bold ${currentRole === 'student' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                {t.traderStudent}
              </button>
            </div>
          </div>

          <button
            onClick={resetAllMockData}
            className="w-full py-2 bg-red-900/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold hover:bg-red-950/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Restore Default DB Params</span>
          </button>

          <button
            onClick={handleLogOut}
            className="w-full py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold hover:bg-red-950/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={12} />
            <span>{t.signOutBtn}</span>
          </button>
        </div>
      )}

      {/* Left Panel / Sidebar (Desktop View) */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          profiles={mockProfiles}
          onLogOut={handleLogOut}
          userEmail={session?.user?.email}
          language={language}
          onLanguageChange={changeLanguage}
          colorThemeId={colorThemeId}
          onColorThemeChange={changeTheme}
          isLightMode={isLightMode}
          onToggleLightMode={() => setIsLightMode(!isLightMode)}
        />
      </div>

      {/* Right Panel / Main scrolling space */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-6">
        
        {/* Top desktop title row with db status indicator */}
        <div className="hidden lg:flex items-center justify-between select-none border-b border-slate-900 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">
              {language === 'en' 
                ? 'CORE Mentorship Live Database Node Connected' 
                : language === 'th' 
                  ? 'เชื่อมต่อฐานข้อมูล CORE Mentorship สดแล้ว' 
                  : 'CORE Mentorship Live Database Node ချိတ်ဆက်ထားပြီးဖြစ်သည်'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetAllMockData}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
              title="Reset Simulated Database to Defaults"
            >
              <RefreshCw size={13} />
              <span>Restore DB Default Params</span>
            </button>
          </div>
        </div>

        {/* Content viewport area */}
        <div className="relative">
          {renderContent()}
        </div>

      </main>

    </div>
  );
}
