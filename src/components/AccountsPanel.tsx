import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit3, ShieldAlert, Award, 
  CheckCircle2, XCircle, Search, 
  Trash2, ToggleLeft, ToggleRight, X, Printer
} from 'lucide-react';
import { StudentAccount, PropFirmRule, Profile, AccountStatus } from '../types';
import { Language } from '../lib/translations';
import ScrollReveal from './ScrollReveal';

interface AccountsPanelProps {
  accounts: StudentAccount[];
  rules: PropFirmRule[];
  profiles: Profile[];
  currentRole: 'admin' | 'student';
  onAddAccount: (acc: Omit<StudentAccount, 'id' | 'highest_balance'>) => void;
  onUpdateAccount: (id: string, updates: Partial<StudentAccount>) => void;
  onDeleteAccount: (id: string) => void;
  t: any;
  language: Language;
}

export default function AccountsPanel({
  accounts,
  rules,
  profiles,
  currentRole,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  t,
  language
}: AccountsPanelProps) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [selectedCertificateAcc, setSelectedCertificateAcc] = useState<StudentAccount | null>(null);

  // New Account fields
  const [profileId, setProfileId] = useState('');
  const [ruleId, setRuleId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [initialBalance, setInitialBalance] = useState(50000);

  // Edit fields
  const [editBalance, setEditBalance] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<AccountStatus>('Active');

  const rulesMap = useMemo(() => new Map(rules.map(r => [r.id, r])), [rules]);
  const profilesMap = useMemo(() => new Map(profiles.map(p => [p.id, p])), [profiles]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const student = profilesMap.get(acc.profile_id);
      const rule = rulesMap.get(acc.rule_id);
      const searchLower = search.toLowerCase();
      
      return (
        acc.account_number.toLowerCase().includes(searchLower) ||
        (student?.full_name ?? '').toLowerCase().includes(searchLower) ||
        (student?.email ?? '').toLowerCase().includes(searchLower) ||
        (rule?.account_type ?? '').toLowerCase().includes(searchLower) ||
        acc.status.toLowerCase().includes(searchLower)
      );
    });
  }, [accounts, search, profilesMap, rulesMap]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId || !ruleId || !accountNumber.trim()) return;

    onAddAccount({
      profile_id: profileId,
      rule_id: ruleId,
      account_number: accountNumber.trim(),
      current_balance: Number(initialBalance),
      status: 'Active',
      is_editable: true,
      initial_balance: Number(initialBalance)
    });

    setAccountNumber('');
    setShowAddModal(false);
  };

  const startEdit = (acc: StudentAccount) => {
    setEditingAccountId(acc.id);
    setEditBalance(acc.current_balance);
    setEditStatus(acc.status);
  };

  const handleEditSave = (id: string) => {
    onUpdateAccount(id, {
      current_balance: Number(editBalance),
      status: editStatus
    });
    setEditingAccountId(null);
  };

  const toggleEditable = (acc: StudentAccount) => {
    onUpdateAccount(acc.id, { is_editable: !acc.is_editable });
  };

  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            {t.statusActive || 'Active'}
          </span>
        );
      case 'Passed':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-bull-alpha text-bull rounded-full border border-bull-alpha flex items-center gap-1.5 w-fit">
            <CheckCircle2 size={12} />
            {t.statusPassed || 'Passed'}
          </span>
        );
      case 'Failed_at_Challenge':
      case 'Failed_at_Funded':
      case 'Failed_at_Payout':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-bear-alpha text-bear rounded-full border border-bear-alpha flex items-center gap-1.5 w-fit">
            <XCircle size={12} />
            {t.statusFailed || 'Failed'} ({status.split('_')[2]})
          </span>
        );
    }
  };

  const titleText = language === 'mm' ? 'ကျောင်းသားများ၏ စာရင်းဇယားအကောင့်များ' : language === 'th' ? 'ข้อมูลบัญชีของนักเรียน' : 'Student Trader Accounts';
  const subText = language === 'mm' ? 'လက်ရှိ အရောင်းအဝယ် စွမ်းဆောင်ရည်စစ်ဆေးမှုများ၊ ရရှိသော အမြတ်အစွန်းများနှင့် အောင်လက်မှတ်များကို ဤနေရာတွင် ကြည့်နိုင်သည်။' : language === 'th' ? 'ตรวจสอบสิทธิ์ประเมินจำลอง ผลกำไร และความก้าวหน้า' : 'Monitor ongoing evaluations, review profit progress, and reward credentials.';
  const searchPlh = language === 'mm' ? 'အကောင့် ရှာဖွေရန်...' : language === 'th' ? 'ค้นหาบัญชี...' : 'Search accounts...';

  return (
    <div className="space-y-6" id="accounts-panel">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">{titleText}</h1>
            <p className="text-slate-400 text-sm font-medium">{subText}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder={searchPlh}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 max-w-xs transition-colors"
              />
            </div>

            {currentRole === 'admin' && (
              <button
                onClick={() => {
                  if (profiles.length > 0 && rules.length > 0) {
                    setProfileId(profiles[0].id);
                    setRuleId(rules[0].id);
                    setAccountNumber(`ACC-${Math.floor(1000 + Math.random() * 9000)}`);
                    setShowAddModal(true);
                  } else {
                    alert('Please configure profiles and rules first.');
                  }
                }}
                className="px-4 py-2 bg-bull hover:opacity-90 text-slate-950 rounded-xl text-xs font-black transition-all hover:scale-[1.01] flex items-center gap-1.5 active:scale-95 shadow-md shadow-cyan-500/10 cursor-pointer"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>{t.createAccount || 'Create Account'}</span>
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Grid Accounts */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">{t.accountNo || 'Account No'}</th>
                    <th className="p-4">{language === 'mm' ? 'စည်းမျဉ်း သတ်မှတ်ချက်' : language === 'th' ? 'กลุ่มกฎข้อบังคับ' : 'Rule Package'}</th>
                    <th className="p-4">{language === 'mm' ? 'စတင်ငွေ' : language === 'th' ? 'บาลานซ์เริ่ม' : 'Starting Bal'}</th>
                    <th className="p-4">{t.currentBalance || 'Current Balance'}</th>
                    <th className="p-4">{t.targetStatus || 'Target Status'}</th>
                    <th className="p-4">{language === 'mm' ? 'သော့ခတ်မှု' : language === 'th' ? 'การล็อกเทรด' : 'Sim Lock'}</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300 font-sans">
                  {filteredAccounts.map(acc => {
                    const student = profilesMap.get(acc.profile_id);
                    const rule = rulesMap.get(acc.rule_id);
                    const isEditing = editingAccountId === acc.id;

                    // Compute profit progress
                    const startingBal = acc.initial_balance;
                    const currentBal = acc.current_balance;
                    const profit = currentBal - startingBal;
                    const target = rule?.profit_target ?? 3000;
                    const progressPercent = Math.max(0, Math.min(100, Math.round((profit / target) * 100)));

                    return (
                      <tr key={acc.id} className="hover:bg-slate-850/40 transition-colors">
                        {/* Account details */}
                        <td className="p-4 space-y-1">
                          <div className="font-mono font-bold text-white text-sm">{acc.account_number}</div>
                          <div className="text-slate-400 text-xs font-medium">
                            {student?.full_name ?? 'Alex Mercer'} ({student?.email ?? 'student@propfirm.com'})
                          </div>
                        </td>

                        {/* Rule */}
                        <td className="p-4 space-y-0.5">
                          <div className="font-bold text-slate-200">{rule?.account_type ?? 'Evaluation'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Target: ${rule?.profit_target.toLocaleString()} · Max DD: ${rule?.max_trailing_drawdown.toLocaleString()}
                          </div>
                        </td>

                        {/* Starting */}
                        <td className="p-4 font-mono text-slate-400 font-semibold">
                          ${startingBal.toLocaleString()}
                        </td>

                        {/* Current Balance */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editBalance}
                              onChange={(e) => setEditBalance(Number(e.target.value))}
                              className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-100 text-xs font-mono w-28 focus:outline-none focus:border-cyan-500"
                            />
                          ) : (
                            <div className="space-y-1">
                              <span className="font-mono font-extrabold text-white text-sm block">
                                ${currentBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <div className="text-[10px] text-slate-500 font-medium">
                                Highest: <span className="font-mono">${acc.highest_balance.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Profit Target Status / Status Badge */}
                        <td className="p-4 space-y-1.5">
                          {isEditing ? (
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value as AccountStatus)}
                              className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-100 text-xs focus:outline-none w-28"
                            >
                              <option value="Active">Active</option>
                              <option value="Passed">Passed</option>
                              <option value="Failed_at_Challenge">Failed at Challenge</option>
                              <option value="Failed_at_Funded">Failed at Funded</option>
                              <option value="Failed_at_Payout">Failed at Payout</option>
                            </select>
                          ) : (
                            <>
                              {getStatusBadge(acc.status)}
                              {acc.status === 'Active' && (
                                <div className="w-28 space-y-1">
                                  <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold">
                                    <span>Profit Progress:</span>
                                    <span>{progressPercent}%</span>
                                  </div>
                                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-bull h-full rounded-full transition-all" 
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </td>

                        {/* Editable check */}
                        <td className="p-4">
                          {currentRole === 'admin' ? (
                            <button
                              onClick={() => toggleEditable(acc)}
                              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title={acc.is_editable ? 'Lock Trading Operations' : 'Unlock Trading Operations'}
                            >
                              {acc.is_editable ? (
                                <ToggleLeft size={24} className="text-bull" />
                              ) : (
                                <ToggleRight size={24} className="text-bear" />
                              )}
                            </button>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${acc.is_editable ? 'bg-bull-alpha text-bull border border-bull-alpha' : 'bg-bear-alpha text-bear border border-bear-alpha'}`}>
                              {acc.is_editable ? 'Unlocked' : 'Read-Only'}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {acc.status === 'Passed' && (
                              <button
                                onClick={() => setSelectedCertificateAcc(acc)}
                                className="px-2.5 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all"
                                title="Award & Print Certificate"
                              >
                                <Award size={13} />
                                <span>{t.certificate || 'Certificate'}</span>
                              </button>
                            )}

                            {currentRole === 'admin' && (
                              <>
                                {isEditing ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleEditSave(acc.id)}
                                      className="px-2.5 py-1 bg-bull hover:opacity-90 text-slate-950 font-black rounded-lg text-[10px] cursor-pointer"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingAccountId(null)}
                                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => startEdit(acc)}
                                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                                      title="Edit Balance / Status"
                                    >
                                      <Edit3 size={13} />
                                    </button>
                                    <button
                                      onClick={() => onDeleteAccount(acc.id)}
                                      className="p-1.5 text-slate-400 hover:text-bear rounded-lg hover:bg-bear-alpha cursor-pointer transition-colors"
                                      title="Delete Account"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAccounts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-bold italic">
                        No matching student trader accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">{t.createAccount || 'Create Account'}</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">{language === 'mm' ? 'သင်တန်းသားရွေးချယ်ရန်' : language === 'th' ? 'เลือกนักเรียน' : 'Select Student Trader'}</label>
                <select
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">{language === 'mm' ? 'စည်းမျဉ်းအတွဲ ရွေးချယ်ရန်' : language === 'th' ? 'เลือกแพ็คเกจกฎเกณฑ์' : 'Select Target Rule Set'}</label>
                <select
                  value={ruleId}
                  onChange={(e) => setRuleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                >
                  {rules.map(r => {
                    return (
                      <option key={r.id} value={r.id}>
                        Size: ${(r.account_size/1000).toFixed(0)}k | Type: {r.account_type}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{t.accountNo || 'Account Number'}</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{language === 'mm' ? 'စတင်အသုံးပြုမည့်ငွေ ($)' : language === 'th' ? 'บาลานซ์เริ่มแรก ($)' : 'Initial Balance ($)'}</label>
                  <input
                    type="number"
                    required
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-bull hover:opacity-90 text-slate-950 rounded-lg text-sm font-black transition-colors shadow-md shadow-cyan-500/10 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Beautiful Certificate Modal */}
      {selectedCertificateAcc && (() => {
        const student = profilesMap.get(selectedCertificateAcc.profile_id);
        const rule = rulesMap.get(selectedCertificateAcc.rule_id);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 print:p-0">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-3xl w-full p-8 space-y-6 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:bg-white print:text-slate-950">
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-bull-alpha rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-bear-alpha rounded-full blur-2xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={() => setSelectedCertificateAcc(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors print:hidden cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Certificate Canvas */}
              <div className="border-4 border-double border-bull-alpha p-8 rounded-xl text-center space-y-6 relative print:border-cyan-500 print:text-slate-950 bg-slate-900/30">
                
                {/* Certificate Seals & Badges */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-bull-alpha border-2 border-dashed border-bull flex items-center justify-center text-bull animate-pulse">
                    <Award size={36} />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-bull font-bold uppercase">
                    CORE Mentorship Verification Seal
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white font-sans print:text-slate-950">
                    {language === 'mm' ? 'အောင်မြင်မှု ဂုဏ်ပြုမှတ်တမ်းလွှာ' : language === 'th' ? 'ประกาศนียบัตรแห่งความสำเร็จ' : 'Certificate of Competency'}
                  </h2>
                  <p className="text-slate-400 font-mono text-xs italic">
                    Awarded in Recognition of Outstanding Risk-Adjusted Futures Trading
                  </p>
                </div>

                <div className="h-0.5 w-24 bg-slate-850 mx-auto" />

                <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-medium">This certifies that student trader</p>
                  <p className="text-2xl font-bold font-sans text-bull underline decoration-double underline-offset-8">
                    {student?.full_name ?? 'Alex Mercer'}
                  </p>
                  <p className="text-slate-300 text-xs max-w-lg mx-auto leading-relaxed font-medium">
                    has successfully passed the comprehensive evaluation of <strong className="text-slate-100 font-mono">{rule?.account_type ?? '50K Evaluation'}</strong> challenge, registering a net audited trading account balance of <strong className="text-bull font-mono">${selectedCertificateAcc.current_balance.toLocaleString()}</strong> while completely adhering to all trailing drawdown, daily loss limit, and consistency protocols.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 max-w-md mx-auto text-[10px] font-mono text-slate-400 border-t border-slate-800/80">
                  <div className="text-center">
                    <span className="block font-bold text-slate-200">TS-ACCOUNT</span>
                    <span className="text-slate-400">{selectedCertificateAcc.account_number}</span>
                  </div>
                  <div className="text-center border-x border-slate-800/80">
                    <span className="block font-bold text-slate-200">COMPLETED ON</span>
                    <span className="text-slate-400">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-slate-200">VERIFIER KEY</span>
                    <span className="text-slate-400 font-bold text-bull">CORE-PASSED-OK</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 max-w-md mx-auto text-xs">
                  <div className="text-center space-y-1">
                    <div className="font-mono text-slate-400 italic font-bold">Alex Mercer</div>
                    <div className="h-px w-24 bg-slate-850 mx-auto" />
                    <span className="text-[10px] text-slate-500 uppercase">Trader Signature</span>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <div className="font-mono text-bull italic font-bold">Sarah Connor</div>
                    <div className="h-px w-24 bg-slate-850 mx-auto" />
                    <span className="text-[10px] text-slate-500 uppercase">Risk Director</span>
                  </div>
                </div>

              </div>

              {/* Footer print controls */}
              <div className="flex justify-between items-center print:hidden">
                <span className="text-slate-500 text-xs font-mono">ID: CORE-CERT-{selectedCertificateAcc.id.slice(0, 8)}</span>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-bull hover:opacity-90 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/10"
                >
                  <Printer size={14} />
                  <span>Print Certificate</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
