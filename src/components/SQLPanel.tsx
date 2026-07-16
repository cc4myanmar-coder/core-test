import React, { useState } from 'react';
import { Copy, Check, Terminal, Shield, Database, Sparkles } from 'lucide-react';
import { Language } from '../lib/translations';

interface SQLPanelProps {
  t: any;
  language: Language;
}

export default function SQLPanel({ t, language }: SQLPanelProps) {
  const [copied, setCopied] = useState(false);
  const [includeRLS, setIncludeRLS] = useState(true);
  const [includeTrigger, setIncludeTrigger] = useState(true);

  const sqlMigrationCode = `-- =========================================================================
-- FUTURES PROPFIRM MANAGEMENT SYSTEM - SUPABASE SQL MIGRATION
-- Generated on: ${new Date().toLocaleDateString()}
-- Target DB: PostgreSQL (Supabase)
-- =========================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'student')) DEFAULT 'student',
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. PROP FIRMS TABLE
CREATE TABLE IF NOT EXISTS public.prop_firms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. PROP FIRM RULES TABLE
CREATE TABLE IF NOT EXISTS public.prop_firm_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prop_firm_id UUID NOT NULL REFERENCES public.prop_firms(id) ON DELETE CASCADE,
    account_size NUMERIC(12, 2) NOT NULL CHECK (account_size > 0),
    account_type TEXT NOT NULL, -- e.g., 'Evaluation', 'Funded', 'Express'
    profit_target NUMERIC(12, 2) NOT NULL CHECK (profit_target > 0),
    max_trailing_drawdown NUMERIC(12, 2) NOT NULL CHECK (max_trailing_drawdown > 0),
    daily_loss_limit NUMERIC(12, 2) NOT NULL CHECK (daily_loss_limit > 0),
    max_contracts_allowed INTEGER NOT NULL CHECK (max_contracts_allowed > 0),
    commission_per_contract NUMERIC(6, 2) DEFAULT 0.00 CHECK (commission_per_contract >= 0),
    consistency_percentage NUMERIC(5, 2) NOT NULL CHECK (consistency_percentage BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. STUDENT ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.student_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES public.prop_firm_rules(id) ON DELETE CASCADE,
    account_number TEXT NOT NULL UNIQUE,
    current_balance NUMERIC(12, 2) NOT NULL,
    highest_balance NUMERIC(12, 2) NOT NULL, -- Tracked for trailing drawdown calculation
    status TEXT NOT NULL CHECK (status IN ('Active', 'Passed', 'Failed_at_Challenge', 'Failed_at_Funded', 'Failed_at_Payout')) DEFAULT 'Active',
    certificate_url TEXT,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TRADE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.trade_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.student_accounts(id) ON DELETE CASCADE,
    instrument TEXT NOT NULL CHECK (instrument IN ('NQ', 'MNQ', 'ES', 'MES')),
    action TEXT NOT NULL CHECK (action IN ('BUY', 'SELL')),
    contracts_traded INTEGER NOT NULL CHECK (contracts_traded > 0),
    open_price NUMERIC(10, 2) NOT NULL,
    close_price NUMERIC(10, 2) NOT NULL,
    gross_pnl NUMERIC(12, 2) NOT NULL,
    net_pnl NUMERIC(12, 2) NOT NULL,
    trade_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. PAYOUTS TABLE
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.student_accounts(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payout_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_accounts_profile ON public.student_accounts(profile_id);
CREATE INDEX IF NOT EXISTS idx_trade_logs_account ON public.trade_logs(account_id);
CREATE INDEX IF NOT EXISTS idx_payouts_account ON public.payouts(account_id);
CREATE INDEX IF NOT EXISTS idx_prop_firm_rules_firm ON public.prop_firm_rules(prop_firm_id);
${includeTrigger ? `
-- =========================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- Whenever a user signs up to Supabase Auth, automatically create a public profile.
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES (
      new.id, 
      new.email, 
      COALESCE(new.raw_user_meta_data->>'role', 'student'), 
      COALESCE(new.raw_user_meta_data->>'full_name', 'Alex Mercer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
` : ''}
${includeRLS ? `
-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures data security where students can only view/trade their own accounts,
-- while Admins have full read/write capabilities.
-- =========================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prop_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prop_firm_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Allow users to read their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow admins full control on profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 2. Prop Firms Policies (All authenticated users can read, only admins modify)
CREATE POLICY "Allow public select on prop firms" ON public.prop_firms
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins full write on prop_firms" ON public.prop_firms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Prop Firm Rules Policies
CREATE POLICY "Allow select on prop rules" ON public.prop_firm_rules
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins full write on prop_firm_rules" ON public.prop_firm_rules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 4. Student Accounts Policies
CREATE POLICY "Students see own accounts" ON public.student_accounts
    FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Admins full write on student_accounts" ON public.student_accounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Trade Logs Policies
CREATE POLICY "Students see own trade logs" ON public.trade_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.student_accounts
            WHERE id = trade_logs.account_id AND profile_id = auth.uid()
        )
    );

CREATE POLICY "Students insert trade logs" ON public.trade_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.student_accounts
            WHERE id = trade_logs.account_id AND profile_id = auth.uid() AND is_editable = true
        )
    );

CREATE POLICY "Admins full write on trade_logs" ON public.trade_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. Payouts Policies
CREATE POLICY "Students see own payouts" ON public.payouts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.student_accounts
            WHERE id = payouts.account_id AND profile_id = auth.uid()
        )
    );

CREATE POLICY "Admins full write on payouts" ON public.payouts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
` : ''}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlMigrationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dbConfigLabel = language === 'mm' ? 'စနစ်ဖွဲ့စည်းမှု ရွေးချယ်စရာများ' : language === 'th' ? 'กำหนดตัวเลือกไฟล์ SQL' : 'Migration Settings';
  const rlsTitle = language === 'mm' ? 'RLS လုံခြုံရေးစည်းမျဉ်းများ (Security)' : language === 'th' ? 'แนบนโยบายความปลอดภัย RLS' : 'Row Level Security (RLS)';
  const triggerTitle = language === 'mm' ? 'အလိုအလျောက် ပရိုဖိုင်တည်ဆောက်မှုစနစ်' : language === 'th' ? 'แนบ Trigger ตรวจจับสมัครสมาชิก' : 'On-Signup Auth Trigger';

  return (
    <div className="space-y-6" id="sql-panel">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal size={22} className="text-emerald-400" />
          {t.sqlTitle}
        </h2>
        <p className="text-slate-400 text-xs leading-relaxed">
          {language === 'mm' 
            ? 'သင်၏ Supabase PostgreSQL တွင် tables များနှင့် trigger များကို အလွယ်တကူ တည်ဆောက်ရန် ဤ SQL query ကုဒ်များကို ကူးယူ၍ Run ပေးပါ။' 
            : language === 'th' 
              ? 'รันโค้ด SQL ด้านล่างในระบบฐานข้อมูล Supabase PostgreSQL ของคุณ เพื่อสร้างโครงสร้างตารางและกฎความปลอดภัย RLS' 
              : 'Execute this fully-vetted migration script inside your Supabase SQL Editor to prepare database tables, trigger profiles, and setup proper Row Level Security.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings column */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              {dbConfigLabel}
            </h3>

            <div className="space-y-3.5">
              {/* Option 1: RLS Policies */}
              <label className="flex items-start gap-3 text-xs text-slate-300 hover:text-slate-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeRLS}
                  onChange={(e) => setIncludeRLS(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <div className="space-y-0.5">
                  <span className="font-medium text-slate-200 group-hover:text-white transition-colors flex items-center gap-1">
                    {rlsTitle}
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {language === 'mm' 
                      ? 'ကျောင်းသားသည် မိမိအကောင့်၏ အချက်အလက်များသာ မြင်နိုင်ပြီး Admin မှ အားလုံးထိန်းချုပ်နိုင်မည့် RLS Policies များ ပါဝင်သည်။' 
                      : language === 'th' 
                        ? 'รับประกันความปลอดภัยที่นักเรียนจะเห็นเฉพาะบัญชีตนเอง ส่วนแอดมินมีสิทธิ์ทั้งหมด' 
                        : 'Guarantees that students only access their own logs, while Admins retain full system scope.'}
                  </p>
                </div>
              </label>

              {/* Option 2: Signup Trigger */}
              <label className="flex items-start gap-3 text-xs text-slate-300 hover:text-slate-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeTrigger}
                  onChange={(e) => setIncludeTrigger(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <div className="space-y-0.5">
                  <span className="font-medium text-slate-200 group-hover:text-white transition-colors flex items-center gap-1">
                    {triggerTitle}
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {language === 'mm' 
                      ? 'ကျောင်းသား အကောင့်အသစ်ဖွင့်သည်နှင့် public.profiles ထဲသို့ profiles အချက်အလက်များကို အလိုအလျောက် ဖြည့်သွင်းပေးမည့် Trigger ပါဝင်သည်။' 
                      : language === 'th' 
                        ? 'เพิ่มข้อมูลลงตารางโปรไฟล์ทันทีเมื่อมีการสมัครสมาชิกผ่านอีเมล' 
                        : 'Creates a record in public.profiles automatically when users sign up via Supabase Auth.'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal size={16} className="text-emerald-400" />
              Schema Blueprint
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Designed with relational integrity using 6 linked tables:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span><strong className="text-slate-100">profiles</strong>: Linked to <code className="text-emerald-400 bg-slate-800 px-1 py-0.5 rounded">auth.users</code></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span><strong className="text-slate-100">prop_firms</strong>: Logos & Names</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span><strong className="text-slate-100">prop_firm_rules</strong>: Risk profiles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span><strong className="text-slate-100">student_accounts</strong>: Trade status & Balances</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span><strong className="text-slate-100">trade_logs</strong>: Auditable futures trades</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span><strong className="text-slate-100">payouts</strong>: Paid history</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Code Display */}
        <div className="lg:col-span-3">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[550px] shadow-2xl relative">
            {/* SQL Editor Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500/80 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500/80 rounded-full" />
                  <div className="w-3 h-3 bg-emerald-500/80 rounded-full" />
                </div>
                <span className="text-slate-400 font-mono text-xs ml-2 select-none">supabase_propfirm_migration.sql</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="Copy code to clipboard"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* SQL Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-emerald-300 leading-relaxed bg-slate-950 select-text selection:bg-emerald-500/35 selection:text-white">
              <pre className="whitespace-pre">{sqlMigrationCode}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
