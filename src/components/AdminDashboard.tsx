import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit2, ShieldAlert, UserPlus, 
  Settings, Check, X, Briefcase, Award, 
  TrendingUp, Percent, DollarSign, ListFilter,
  Mail, Send, AlertTriangle, Key, ArrowRight
} from 'lucide-react';
import { PropFirm, PropFirmRule, StudentAccount } from '../types';
import { Language } from '../lib/translations';
import ScrollReveal from './ScrollReveal';

interface AdminDashboardProps {
  firms: PropFirm[];
  rules: PropFirmRule[];
  accounts: StudentAccount[];
  language: Language;
  onAddFirm: (name: string, logoUrl?: string) => void;
  onUpdateFirm: (id: string, name: string, logoUrl?: string) => void;
  onDeleteFirm: (id: string) => void;
  onAddRule: (rule: Omit<PropFirmRule, 'id'>) => void;
  onUpdateRule: (id: string, rule: Omit<PropFirmRule, 'id'>) => void;
  onDeleteRule: (id: string) => void;
  onAddAccountSimulated: (email: string) => void; // Helper to add student account to local simulation state automatically
}

export default function AdminDashboard({
  firms,
  rules,
  accounts,
  language,
  onAddFirm,
  onUpdateFirm,
  onDeleteFirm,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  onAddAccountSimulated
}: AdminDashboardProps) {
  // Translate helper
  const tAdmin = {
    en: {
      title: "Admin Control Center",
      subtitle: "Provision student accounts & manage evaluation prop firm rules",
      studentCreatorTitle: "Student Creator Setup",
      studentCreatorSub: "Register a new student email. This will execute a back-end server action invoking Supabase Admin Auth API to automatically dispatch a secure password definition link.",
      emailPlaceholder: "student@propfirm.com",
      btnInvite: "Invite & Provision Account",
      statusHeader: "Response Terminal",
      statusWaiting: "Awaiting administrator action...",
      statusLoading: "Executing back-end Supabase action...",
      addSimulatedLabel: "Also add to active simulated student database",
      propFirmManagerTitle: "Prop Firms & Rules CRUD Engine",
      propFirmManagerSub: "Directly create, update, and remove prop firm definitions, contract sizes, commissions, drawdown limits, and NQ/MNQ rules.",
      addFirmBtn: "Add New Prop Firm",
      addRuleBtn: "Add New Rule Set",
      firmNameLabel: "Prop Firm Name",
      logoUrlLabel: "Logo URL (Optional)",
      saveBtn: "Save",
      cancelBtn: "Cancel",
      editFirmTitle: "Edit Prop Firm",
      deleteConfirmFirm: "Warning: Deleting this Prop Firm will permanently destroy all linked evaluation rule sets. Proceed?",
      deleteConfirmRule: "Are you sure you want to delete this rule set?",
      accountSize: "Account Size",
      accountType: "Account Type",
      profitTarget: "Profit Target",
      maxDrawdown: "Max Drawdown",
      dailyLoss: "Daily Loss Limit",
      maxContracts: "Max Contracts",
      commission: "Commission Per Contract",
      consistency: "Consistency %"
    },
    mm: {
      title: "အုပ်ချုပ်သူ အဆင့်မြင့် ထိန်းချုပ်ခန်း",
      subtitle: "ကျောင်းသားအကောင့်များ ဖန်တီးပေးခြင်းနှင့် စည်းမျဉ်းသတ်မှတ်ချက်များကို ဤနေရာတွင် စီမံနိုင်ပါသည်",
      studentCreatorTitle: "ကျောင်းသားအကောင့်အသစ် ဖန်တီးသူ",
      studentCreatorSub: "ကျောင်းသား၏ အီးမေးလ်ကို ရိုက်ထည့်ပြီး ဝင်ရောက်ခွင့် ဖန်တီးပါ။ ၎င်းသည် Supabase Admin Auth API ကို လှမ်းခေါ်ပြီး စကားဝှက်သတ်မှတ်ရန် လုံခြုံရေးဖိတ်ခေါ်စာ လင့်ခ်ကို အလိုအလျောက် ပေးပို့ပေးပါမည်။",
      emailPlaceholder: "student@propfirm.com",
      btnInvite: "အကောင့်ဖွင့်ပြီး ဖိတ်ခေါ်စာပို့မည်",
      statusHeader: "ထိန်းချုပ်ခန်း တုံ့ပြန်မှုရလဒ်",
      statusWaiting: "အုပ်ချုပ်သူ၏ လုပ်ဆောင်ချက်ကို စောင့်ဆိုင်းနေပါသည်...",
      statusLoading: "Supabase Back-end စနစ်ကို ချိတ်ဆက်ဆောင်ရွက်နေပါသည်...",
      addSimulatedLabel: "လက်ရှိ စမ်းသပ်စနစ် ကျောင်းသားအကောင့်စာရင်းထဲသို့ တစ်ပါတည်း ထည့်သွင်းမည်",
      propFirmManagerTitle: "စည်းမျဉ်းများနှင့် ကုမ္ပဏီများ CRUD စီမံခန်း",
      propFirmManagerSub: "သတ်မှတ်ကုမ္ပဏီများ၊ NQ/MNQ စည်းမျဉ်းများ၊ ကန်ထရိုက်အရေအတွက်၊ ကော်မရှင်ခများနှင့် အရှုံးခံနိုင်သည့် ကန့်သတ်ချက်များကို စိတ်ကြိုက် ဖြည့်သွင်း/ပြင်ဆင်/ဖျက်ပစ် နိုင်ပါသည်။",
      addFirmBtn: "ကုမ္ပဏီအသစ်ထည့်မည်",
      addRuleBtn: "စည်းမျဉ်းအသစ် သတ်မှတ်မည်",
      firmNameLabel: "ကုမ္ပဏီအမည်",
      logoUrlLabel: "လိုဂိုပုံလင့်ခ် (မထည့်လည်းရသည်)",
      saveBtn: "သိမ်းဆည်းမည်",
      cancelBtn: "ပယ်ဖျက်မည်",
      editFirmTitle: "ကုမ္ပဏီအချက်အလက် ပြင်ဆင်မည်",
      deleteConfirmFirm: "သတိပေးချက် - ဤကုမ္ပဏီကို ဖျက်လိုက်ပါက ၎င်းနှင့် ဆက်စပ်နေသော စည်းမျဉ်းသတ်မှတ်ချက်များအားလုံး အပြီးတိုင် ပျက်ပြယ်သွားပါမည်။ ဆက်လုပ်မလား?",
      deleteConfirmRule: "ဤစည်းမျဉ်းသတ်မှတ်ချက်ကို အပြီးဖျက်ရန် သေချာပါသလား?",
      accountSize: "အကောင့်အရွယ်အစား",
      accountType: "အကောင့်အမျိုးအစား",
      profitTarget: "ရည်မှန်းထားသော အမြတ်ပမာဏ",
      maxDrawdown: "အများဆုံး အရှုံးခံနိုင်မှု",
      dailyLoss: "တစ်ရက် အများဆုံးအရှုံးခံနိုင်မှု",
      maxContracts: "အများဆုံး ကန်ထရိုက်စောင်ရေ",
      commission: "ကော်မရှင်ခ (၁ စောင်လျှင်)",
      consistency: "ညီညွတ်မှု ရာခိုင်နှုန်း %"
    },
    th: {
      title: "ศูนย์ควบคุมผู้ดูแลระบบ (Admin)",
      subtitle: "จัดเตรียมบัญชีนักเรียนและจัดการกฎเกณฑ์ประเมินความเสี่ยงทั้งหมด",
      studentCreatorTitle: "ระบบสร้างบัญชีนักเรียน",
      studentCreatorSub: "ลงทะเบียนอีเมลของนักเรียนใหม่ ระบบหลังบ้านจะเรียกใช้ Supabase Admin Auth API เพื่อจัดส่งลิงก์กำหนดรหัสผ่านความปลอดภัยสูงไปยังกล่องข้อความโดยอัตโนมัติ",
      emailPlaceholder: "student@propfirm.com",
      btnInvite: "เชิญและสร้างบัญชีจำลอง",
      statusHeader: "หน้าต่างแสดงผลการทำงาน",
      statusWaiting: "กำลังรอการดำเนินการจากผู้ดูแลระบบ...",
      statusLoading: "กำลังเรียกใช้ Supabase API หลังบ้าน...",
      addSimulatedLabel: "เพิ่มเข้าในฐานข้อมูลนักเรียนจำลองปัจจุบันด้วย",
      propFirmManagerTitle: "การจัดการกองทุนและกฎเกณฑ์ (CRUD)",
      propFirmManagerSub: "เพิ่ม แก้ไข อัปเดต และลบข้อมูลกองทุนจำลอง ขนาดบัญชีเป้าหมาย ค่าคอมมิชชันจำลอง และสัญญา NQ/MNQ",
      addFirmBtn: "เพิ่มกองทุนใหม่",
      addRuleBtn: "กำหนดกฎเกณฑ์ใหม่",
      firmNameLabel: "ชื่อกองทุน",
      logoUrlLabel: "ลิงก์รูปโลโก้ (ถ้ามี)",
      saveBtn: "บันทึก",
      cancelBtn: "ยกเลิก",
      editFirmTitle: "แก้ไขข้อมูลกองทุน",
      deleteConfirmFirm: "คำเตือน: การลบกองทุนนี้จะลบชุดกฎเกณฑ์ประเมินที่เกี่ยวข้องทั้งหมดด้วยอย่างถาวร ดำเนินการต่อหรือไม่?",
      deleteConfirmRule: "คุณแน่ใจหรือไม่ว่าต้องการลบชุดกฎเกณฑ์นี้?",
      accountSize: "ขนาดบัญชี ($)",
      accountType: "ประเภทบัญชี",
      profitTarget: "เป้าหมายกำไร ($)",
      maxDrawdown: "ขาดทุนสูงสุดสะสม ($)",
      dailyLoss: "ขาดทุนสูงสุดรายวัน ($)",
      maxContracts: "จำนวนสัญญาเทรดสูงสุด",
      commission: "ค่าคอมมิชชันต่อสัญญา ($)",
      consistency: "% ความสม่ำเสมอ"
    }
  }[language] || {
    title: "Admin Control Center",
    subtitle: "Provision student accounts & manage evaluation prop firm rules",
    studentCreatorTitle: "Student Creator Setup",
    studentCreatorSub: "Register a new student email. This will execute a back-end server action invoking Supabase Admin Auth API to automatically dispatch a secure password definition link.",
    emailPlaceholder: "student@propfirm.com",
    btnInvite: "Invite & Provision Account",
    statusHeader: "Response Terminal",
    statusWaiting: "Awaiting administrator action...",
    statusLoading: "Executing back-end Supabase action...",
    addSimulatedLabel: "Also add to active simulated student database",
    propFirmManagerTitle: "Prop Firms & Rules CRUD Engine",
    propFirmManagerSub: "Directly create, update, and remove prop firm definitions, contract sizes, commissions, drawdown limits, and NQ/MNQ rules.",
    addFirmBtn: "Add New Prop Firm",
    addRuleBtn: "Add New Rule Set",
    firmNameLabel: "Prop Firm Name",
    logoUrlLabel: "Logo URL (Optional)",
    saveBtn: "Save",
    cancelBtn: "Cancel",
    editFirmTitle: "Edit Prop Firm",
    deleteConfirmFirm: "Warning: Deleting this Prop Firm will permanently destroy all linked evaluation rule sets. Proceed?",
    deleteConfirmRule: "Are you sure you want to delete this rule set?",
    accountSize: "Account Size",
    accountType: "Account Type",
    profitTarget: "Profit Target",
    maxDrawdown: "Max Drawdown",
    dailyLoss: "Daily Loss Limit",
    maxContracts: "Max Contracts",
    commission: "Commission Per Contract",
    consistency: "Consistency %"
  };

  // --- Student Creator Form State ---
  const [studentEmail, setStudentEmail] = useState('');
  const [alsoAddSimulated, setAlsoAddSimulated] = useState(true);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');
  const [isSimulatedResponse, setIsSimulatedResponse] = useState(false);

  // --- Prop Firm & Rules Form/Edit State ---
  const [showFirmForm, setShowFirmForm] = useState(false);
  const [editingFirm, setEditingFirm] = useState<PropFirm | null>(null);
  const [firmName, setFirmName] = useState('');
  const [firmLogo, setFirmLogo] = useState('');

  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<PropFirmRule | null>(null);
  const [ruleFirmId, setRuleFirmId] = useState('');
  const [accountSize, setAccountSize] = useState(50000);
  const [accountType, setAccountType] = useState('Evaluation');
  const [profitTarget, setProfitTarget] = useState(3000);
  const [maxDrawdown, setMaxDrawdown] = useState(2500);
  const [dailyLoss, setDailyLoss] = useState(1250);
  const [maxContracts, setMaxContracts] = useState(10);
  const [commission, setCommission] = useState(1.50);
  const [consistency, setConsistency] = useState(40);

  // Handle invite submission
  const handleInviteStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;

    setInviteStatus('loading');
    setResponseMsg('');

    try {
      const response = await fetch('/api/admin/invite-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: studentEmail.trim() })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setInviteStatus('success');
        setResponseMsg(result.message);
        setIsSimulatedResponse(!!result.simulated);

        // Optionally add to simulated student database for complete user feedback loop
        if (alsoAddSimulated) {
          onAddAccountSimulated(studentEmail.trim());
        }
        setStudentEmail('');
      } else {
        setInviteStatus('error');
        setResponseMsg(result.error || "Failed to invite user.");
      }
    } catch (err: any) {
      setInviteStatus('error');
      setResponseMsg(err.message || "Network error. Make sure the server is fully started.");
    }
  };

  // Handle firm submit (Create / Update)
  const handleFirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName.trim()) return;

    if (editingFirm) {
      onUpdateFirm(editingFirm.id, firmName.trim(), firmLogo.trim() || undefined);
    } else {
      onAddFirm(firmName.trim(), firmLogo.trim() || undefined);
    }

    // Reset State
    setFirmName('');
    setFirmLogo('');
    setEditingFirm(null);
    setShowFirmForm(false);
  };

  // Handle rule submit (Create / Update)
  const handleRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleFirmId) return;

    const ruleData = {
      prop_firm_id: ruleFirmId,
      account_size: Number(accountSize),
      account_type: accountType.trim(),
      profit_target: Number(profitTarget),
      max_trailing_drawdown: Number(maxDrawdown),
      daily_loss_limit: Number(dailyLoss),
      max_contracts_allowed: Number(maxContracts),
      commission_per_contract: Number(commission),
      consistency_percentage: Number(consistency)
    };

    if (editingRule) {
      onUpdateRule(editingRule.id, ruleData);
    } else {
      onAddRule(ruleData);
    }

    // Reset State
    setEditingRule(null);
    setShowRuleForm(false);
  };

  // Start editing a firm
  const startEditFirm = (firm: PropFirm) => {
    setEditingFirm(firm);
    setFirmName(firm.name);
    setFirmLogo(firm.logo_url || '');
    setShowFirmForm(true);
  };

  // Start editing a rule
  const startEditRule = (rule: PropFirmRule) => {
    setEditingRule(rule);
    setRuleFirmId(rule.prop_firm_id);
    setAccountSize(rule.account_size);
    setAccountType(rule.account_type);
    setProfitTarget(rule.profit_target);
    setMaxDrawdown(rule.max_trailing_drawdown);
    setDailyLoss(rule.daily_loss_limit);
    setMaxContracts(rule.max_contracts_allowed);
    setCommission(rule.commission_per_contract);
    setConsistency(rule.consistency_percentage);
    setShowRuleForm(true);
  };

  // Open Add Rule with default firm
  const openAddRule = (firmId: string) => {
    setEditingRule(null);
    setRuleFirmId(firmId);
    setAccountSize(50000);
    setAccountType('Evaluation');
    setProfitTarget(3000);
    setMaxDrawdown(2500);
    setDailyLoss(1250);
    setMaxContracts(10);
    setCommission(1.50);
    setConsistency(40);
    setShowRuleForm(true);
  };

  return (
    <div className="space-y-8" id="admin-dashboard-container">
      {/* Title block */}
      <ScrollReveal>
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-cyan-400">
            <Settings size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{tAdmin.title}</h1>
            <p className="text-slate-400 text-xs font-semibold">{tAdmin.subtitle}</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Grid Layout: Left is Student Creator Setup, Right is Info & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Student Creator Setup Form Panel */}
        <div className="lg:col-span-8">
          <ScrollReveal delay={0.1}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-lg">
              {/* Card Accent */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500" />

              <div className="space-y-1.5">
                <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <UserPlus size={18} className="text-cyan-400" />
                  <span>{tAdmin.studentCreatorTitle}</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {tAdmin.studentCreatorSub}
                </p>
              </div>

              <form onSubmit={handleInviteStudent} className="space-y-4" id="student-creator-form">
                <div className="space-y-2">
                  <label htmlFor="student-email" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                    {language === 'mm' ? 'ကျောင်းသား အီးမေးလ်' : language === 'th' ? 'ที่อยู่อีเมลนักเรียน' : 'Student Email Address'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <Mail size={15} />
                    </span>
                    <input
                      id="student-email"
                      type="email"
                      required
                      placeholder={tAdmin.emailPlaceholder}
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white placeholder-slate-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Simulated Local Option */}
                <div className="flex items-center gap-2.5 select-none py-1">
                  <input
                    id="checkbox-also-add-simulated"
                    type="checkbox"
                    checked={alsoAddSimulated}
                    onChange={(e) => setAlsoAddSimulated(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950 bg-slate-950 cursor-pointer"
                  />
                  <label htmlFor="checkbox-also-add-simulated" className="text-xs text-slate-400 cursor-pointer font-semibold">
                    {tAdmin.addSimulatedLabel}
                  </label>
                </div>

                <button
                  id="btn-submit-student-invite"
                  type="submit"
                  disabled={inviteStatus === 'loading'}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs tracking-wider transition-all uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  {inviteStatus === 'loading' ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={14} strokeWidth={2.5} />
                      <span>{tAdmin.btnInvite}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>

        {/* Response terminal block / credentials setup info */}
        <div className="lg:col-span-4">
          <ScrollReveal delay={0.2}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold block">
                  {tAdmin.statusHeader}
                </span>

                <div className="bg-slate-950 border border-slate-850/80 rounded-xl p-4 font-mono text-[11px] leading-relaxed min-h-[140px] flex flex-col justify-between">
                  {inviteStatus === 'idle' && (
                    <div className="text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-750 animate-pulse" />
                      <span>{tAdmin.statusWaiting}</span>
                    </div>
                  )}

                  {inviteStatus === 'loading' && (
                    <div className="text-cyan-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>{tAdmin.statusLoading}</span>
                    </div>
                  )}

                  {inviteStatus === 'success' && (
                    <div className="space-y-2">
                      <div className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                        <Check size={14} strokeWidth={3} />
                        <span>PROVISION SUCCESSFUL</span>
                      </div>
                      <p className="text-slate-300 text-[10px]">{responseMsg}</p>
                      {isSimulatedResponse && (
                        <div className="mt-2 p-2 bg-yellow-950/20 border border-yellow-800/25 rounded text-[9px] text-amber-300 leading-normal flex gap-1.5">
                          <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />
                          <span>
                            {language === 'mm' 
                              ? 'အီးမေးလ် ပေးပို့ခြင်းကို ပုံဖော်ထားပါသည်။ တကယ့်အီးမေးလ် ပေးပို့လိုပါက Developer Settings ထဲတွင် SUPABASE_SERVICE_ROLE_KEY ကို သတ်မှတ်ထည့်သွင်းပေးရပါမည်။' 
                              : 'Simulation active. To dispatch genuine invitation emails, define SUPABASE_SERVICE_ROLE_KEY in your Cloud applet environment variables.'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {inviteStatus === 'error' && (
                    <div className="space-y-2">
                      <div className="text-red-400 font-extrabold flex items-center gap-1.5">
                        <X size={14} strokeWidth={3} />
                        <span>PROVISION FAILED</span>
                      </div>
                      <p className="text-slate-400 text-[10px]">{responseMsg}</p>
                    </div>
                  )}


                </div>
              </div>

              {/* Developer Environment Alert */}
              <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-850/60 text-[10px] text-slate-400 leading-normal flex gap-2">
                <Key size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300 block mb-0.5">Admin Configuration note:</strong>
                  {language === 'mm' 
                    ? 'ကျောင်းသားသည် ဖိတ်ခေါ်စာရရှိပြီးနောက် ၎င်းတို့၏ browser တွင် password ကို သတ်မှတ်ပြီး အောင်မြင်စွာ စတင်ဝင်ရောက်နိုင်ပါမည်။' 
                    : 'Invited students will receive a link to securely define their login credentials. Simulated accounts will appear instantly.'}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* Prop Firms & Rules CRUD engine */}
      <ScrollReveal delay={0.25}>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Settings size={18} className="text-cyan-400" />
                <span>{tAdmin.propFirmManagerTitle}</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {tAdmin.propFirmManagerSub}
              </p>
            </div>

            <button
              id="btn-admin-add-firm"
              onClick={() => {
                setEditingFirm(null);
                setFirmName('');
                setFirmLogo('');
                setShowFirmForm(true);
              }}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black transition-all hover:scale-[1.01] flex items-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer active:scale-95"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>{tAdmin.addFirmBtn}</span>
            </button>
          </div>

          {/* Prop Firm Creation/Modification Modal Overlay */}
          {showFirmForm && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">
                    {editingFirm ? tAdmin.editFirmTitle : tAdmin.addFirmBtn}
                  </h3>
                  <button onClick={() => setShowFirmForm(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleFirmSubmit} className="space-y-4" id="firm-crud-form">
                  <div className="space-y-1.5">
                    <label htmlFor="firm-name-input" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                      {tAdmin.firmNameLabel}
                    </label>
                    <input
                      id="firm-name-input"
                      type="text"
                      required
                      placeholder="e.g. Apex, MyFundedFutures"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="firm-logo-input" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                      {tAdmin.logoUrlLabel}
                    </label>
                    <input
                      id="firm-logo-input"
                      type="url"
                      placeholder="e.g. https://example.com/logo.png"
                      value={firmLogo}
                      onChange={(e) => setFirmLogo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      id="btn-firm-cancel"
                      type="button"
                      onClick={() => setShowFirmForm(false)}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {tAdmin.cancelBtn}
                    </button>
                    <button
                      id="btn-firm-save"
                      type="submit"
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs cursor-pointer"
                    >
                      {tAdmin.saveBtn}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Rule Sets Creation/Modification Modal Overlay */}
          {showRuleForm && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">
                    {editingRule ? (language === 'mm' ? 'စည်းမျဉ်းပြင်ဆင်ရန်' : 'Edit Rule Set') : tAdmin.addRuleBtn}
                  </h3>
                  <button onClick={() => setShowRuleForm(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleRuleSubmit} className="space-y-4" id="rule-crud-form">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="rule-firm-select" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        Prop Firm Target
                      </label>
                      <select
                        id="rule-firm-select"
                        value={ruleFirmId}
                        onChange={(e) => setRuleFirmId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      >
                        {firms.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="rule-account-type" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        {tAdmin.accountType}
                      </label>
                      <input
                        id="rule-account-type"
                        type="text"
                        required
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="rule-account-size" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        {tAdmin.accountSize} ($)
                      </label>
                      <input
                        id="rule-account-size"
                        type="number"
                        required
                        value={accountSize}
                        onChange={(e) => setAccountSize(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="rule-profit-target" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        {tAdmin.profitTarget} ($)
                      </label>
                      <input
                        id="rule-profit-target"
                        type="number"
                        required
                        value={profitTarget}
                        onChange={(e) => setProfitTarget(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="rule-max-drawdown" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        {tAdmin.maxDrawdown} ($)
                      </label>
                      <input
                        id="rule-max-drawdown"
                        type="number"
                        required
                        value={maxDrawdown}
                        onChange={(e) => setMaxDrawdown(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="rule-daily-loss" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        {tAdmin.dailyLoss} ($)
                      </label>
                      <input
                        id="rule-daily-loss"
                        type="number"
                        required
                        value={dailyLoss}
                        onChange={(e) => setDailyLoss(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="rule-max-contracts" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        {tAdmin.maxContracts}
                      </label>
                      <input
                        id="rule-max-contracts"
                        type="number"
                        required
                        value={maxContracts}
                        onChange={(e) => setMaxContracts(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="rule-commission" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        Comm. / Contract ($)
                      </label>
                      <input
                        id="rule-commission"
                        type="number"
                        step="0.01"
                        required
                        value={commission}
                        onChange={(e) => setCommission(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="rule-consistency" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                        Consistency %
                      </label>
                      <input
                        id="rule-consistency"
                        type="number"
                        required
                        value={consistency}
                        onChange={(e) => setConsistency(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      id="btn-rule-cancel"
                      type="button"
                      onClick={() => setShowRuleForm(false)}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {tAdmin.cancelBtn}
                    </button>
                    <button
                      id="btn-rule-save"
                      type="submit"
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs cursor-pointer"
                    >
                      {tAdmin.saveBtn}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table View of Prop Firms and their linked rules */}
          <div className="space-y-6">
            {firms.map((firm) => {
              const firmRules = rules.filter(r => r.prop_firm_id === firm.id);

              return (
                <div key={firm.id} className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4">
                  {/* Firm header card row */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                        {firm.logo_url ? (
                          <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase size={16} className="text-slate-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-xs tracking-wide">{firm.name}</h4>
                        <p className="text-[9px] text-slate-500 font-mono">ID: {firm.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-add-rule-to-${firm.id}`}
                        onClick={() => openAddRule(firm.id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-cyan-400 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={12} strokeWidth={3} />
                        <span>Add Rule Set</span>
                      </button>

                      <button
                        id={`btn-edit-firm-${firm.id}`}
                        onClick={() => startEditFirm(firm)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg cursor-pointer"
                        title="Edit Firm"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        id={`btn-delete-firm-${firm.id}`}
                        onClick={() => {
                          if (confirm(tAdmin.deleteConfirmFirm)) {
                            onDeleteFirm(firm.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg cursor-pointer"
                        title="Delete Firm"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Rules Sub-Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-900">
                    <table className="w-full border-collapse text-left text-[11px] font-medium text-slate-400">
                      <thead>
                        <tr className="bg-slate-900/60 border-b border-slate-900 text-[10px] font-mono text-slate-500 uppercase">
                          <th className="py-2.5 px-4 font-bold">Type</th>
                          <th className="py-2.5 px-4 font-bold">Size</th>
                          <th className="py-2.5 px-4 font-bold">Profit Target</th>
                          <th className="py-2.5 px-4 font-bold">Max Drawdown</th>
                          <th className="py-2.5 px-4 font-bold">Daily Loss</th>
                          <th className="py-2.5 px-4 font-bold">Contracts</th>
                          <th className="py-2.5 px-4 font-bold">Comm./Cont.</th>
                          <th className="py-2.5 px-4 font-bold">Consistency %</th>
                          <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {firmRules.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-4 text-center text-slate-600 font-mono">
                              No evaluation rules configured for this firm. Click "Add Rule Set" above to provision.
                            </td>
                          </tr>
                        ) : (
                          firmRules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-slate-900/30 transition-colors">
                              <td className="py-2.5 px-4 text-slate-200 font-bold font-mono uppercase">{rule.account_type}</td>
                              <td className="py-2.5 px-4 text-slate-200 font-bold">${rule.account_size.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-emerald-400 font-bold">${rule.profit_target.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-amber-500 font-bold">${rule.max_trailing_drawdown.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-amber-600 font-bold">${rule.daily_loss_limit.toLocaleString()}</td>
                              <td className="py-2.5 px-4 text-slate-300 font-mono">{rule.max_contracts_allowed} Max</td>
                              <td className="py-2.5 px-4 text-slate-400 font-mono">${rule.commission_per_contract.toFixed(2)}</td>
                              <td className="py-2.5 px-4 text-slate-300 font-mono">{rule.consistency_percentage}%</td>
                              <td className="py-2.5 px-4 text-right space-x-1 whitespace-nowrap">
                                <button
                                  id={`btn-edit-rule-${rule.id}`}
                                  onClick={() => startEditRule(rule)}
                                  className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded cursor-pointer inline-flex"
                                  title="Edit Rule"
                                >
                                  <Edit2 size={11} />
                                </button>
                                <button
                                  id={`btn-delete-rule-${rule.id}`}
                                  onClick={() => {
                                    if (confirm(tAdmin.deleteConfirmRule)) {
                                      onDeleteRule(rule.id);
                                    }
                                  }}
                                  className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded cursor-pointer inline-flex"
                                  title="Delete Rule"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              );
            })}

            {firms.length === 0 && (
              <div className="p-8 text-center bg-slate-950 border border-slate-850 rounded-2xl font-mono text-xs text-slate-600">
                No prop firms registered in system database. Provision your first firm above.
              </div>
            )}
          </div>

        </div>
      </ScrollReveal>
    </div>
  );
}
