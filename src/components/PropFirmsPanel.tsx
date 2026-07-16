import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, Briefcase } from 'lucide-react';
import { PropFirm, PropFirmRule } from '../types';
import { Language } from '../lib/translations';
import ScrollReveal from './ScrollReveal';

interface PropFirmsPanelProps {
  firms: PropFirm[];
  rules: PropFirmRule[];
  currentRole: 'admin' | 'student';
  onAddFirm: (name: string, logoUrl?: string) => void;
  onAddRule: (rule: Omit<PropFirmRule, 'id'>) => void;
  onDeleteFirm: (id: string) => void;
  onDeleteRule: (id: string) => void;
  t: any;
  language: Language;
}

export default function PropFirmsPanel({
  firms,
  rules,
  currentRole,
  onAddFirm,
  onAddRule,
  onDeleteFirm,
  onDeleteRule,
  t,
  language
}: PropFirmsPanelProps) {
  // Modal toggles & states
  const [showFirmModal, setShowFirmModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);

  // New Firm States
  const [firmName, setFirmName] = useState('');
  const [firmLogo, setFirmLogo] = useState('');

  // New Rule States
  const [selectedFirmId, setSelectedFirmId] = useState('');
  const [accountSize, setAccountSize] = useState(50000);
  const [accountType, setAccountType] = useState('Evaluation');
  const [profitTarget, setProfitTarget] = useState(3000);
  const [maxDrawdown, setMaxDrawdown] = useState(2500);
  const [dailyLoss, setDailyLoss] = useState(1250);
  const [maxContracts, setMaxContracts] = useState(10);
  const [commission, setCommission] = useState(1.50);
  const [consistency, setConsistency] = useState(40);

  const handleAddFirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName.trim()) return;
    onAddFirm(firmName.trim(), firmLogo.trim() || undefined);
    setFirmName('');
    setFirmLogo('');
    setShowFirmModal(false);
  };

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFirmId) return;
    onAddRule({
      prop_firm_id: selectedFirmId,
      account_size: Number(accountSize),
      account_type: accountType.trim(),
      profit_target: Number(profitTarget),
      max_trailing_drawdown: Number(maxDrawdown),
      daily_loss_limit: Number(dailyLoss),
      max_contracts_allowed: Number(maxContracts),
      commission_per_contract: Number(commission),
      consistency_percentage: Number(consistency)
    });
    setShowRuleModal(false);
  };

  const panelTitle = language === 'mm' ? 'စည်းမျဉ်း သတ်မှတ်ချက်များနှင့် သတ်မှတ်ကုမ္ပဏီများ' : language === 'th' ? 'ข้อมูลกองทุนจำลองและกฎเกณฑ์' : 'Prop Firms & Evaluation Rules';
  const panelSub = language === 'mm' ? 'ကျောင်းသားများ စောင့်ထိန်းရမည့် ဘေးအန္တရာယ် စောင့်ကြည့်မှု ညွှန်းကိန်းများနှင့် သတ်မှတ်ချက်များကို ဤနေရာတွင် စီမံနိုင်ပါသည်။' : language === 'th' ? 'กำหนดค่าพารามิเตอร์กองทุนจำลองและกฎข้อตกลง' : 'Define, view, and inspect risk assessment parameters for funded traders.';
  const addFirmLabel = language === 'mm' ? 'ကုမ္ပဏီအသစ်ထည့်မည်' : language === 'th' ? 'เพิ่มบริษัทใหม่' : 'Add Firm';
  const addRuleLabel = language === 'mm' ? 'စည်းမျဉ်းအသစ် သတ်မှတ်မည်' : language === 'th' ? 'สร้างกฎข้อบังคับ' : 'Create Rule Set';

  return (
    <div className="space-y-6" id="prop-firms-panel">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">{panelTitle}</h1>
            <p className="text-slate-400 text-sm font-medium">{panelSub}</p>
          </div>
          
          {currentRole === 'admin' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFirmModal(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Briefcase size={14} />
                <span>{addFirmLabel}</span>
              </button>
              <button
                onClick={() => {
                  if (firms.length > 0) {
                    setSelectedFirmId(firms[0].id);
                    setShowRuleModal(true);
                  } else {
                    alert(language === 'mm' ? 'ပထမဦးစွာ ကုမ္ပဏီအသစ် တခု ထည့်ပေးပါဦး!' : language === 'th' ? 'กรุณาเพิ่มบริษัทกองทุนก่อน!' : 'Please add a prop firm first!');
                  }
                }}
                className="px-4 py-2 bg-bull hover:opacity-90 text-slate-950 rounded-xl text-xs font-black transition-all hover:scale-[1.01] flex items-center gap-1.5 active:scale-95 shadow-md shadow-cyan-500/10 cursor-pointer"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>{addRuleLabel}</span>
              </button>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Prop Firms List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {firms.map((firm, idx) => {
          const firmRules = rules.filter(r => r.prop_firm_id === firm.id);

          return (
            <div key={firm.id} className="h-full">
              <ScrollReveal delay={0.1 * idx}>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between relative overflow-hidden shadow-lg h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                          {firm.logo_url ? (
                            <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-cover" />
                          ) : (
                            <Briefcase size={18} className="text-slate-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-100 text-sm font-sans">{firm.name}</h3>
                          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-wider font-bold">
                            {firmRules.length} {language === 'mm' ? 'စည်းမျဉ်း သတ်မှတ်ချက်များ' : language === 'th' ? 'โปรไฟล์กฎเกณฑ์' : 'rules defined'}
                          </p>
                        </div>
                      </div>

                      {currentRole === 'admin' && (
                        <button
                          onClick={() => onDeleteFirm(firm.id)}
                          className="p-1.5 text-slate-500 hover:text-bear transition-colors rounded-lg hover:bg-bear-alpha cursor-pointer"
                          title="Delete Firm"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <hr className="border-slate-800/80" />

                    {/* Firm Rules Sub-list */}
                    <div className="space-y-3">
                      {firmRules.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-4 text-center font-bold">No rules configured for this firm.</p>
                      ) : (
                        firmRules.map(rule => (
                          <div key={rule.id} className="p-3 bg-slate-950 border border-slate-800/60 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200">{rule.account_type}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-bull font-bold">${(rule.account_size / 1000).toFixed(0)}k Size</span>
                                {currentRole === 'admin' && (
                                  <button
                                    onClick={() => onDeleteRule(rule.id)}
                                    className="text-slate-500 hover:text-bear transition-colors p-0.5 rounded cursor-pointer"
                                    title="Delete Rule Profile"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Rules Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-400 pt-1 font-mono">
                              <div className="flex justify-between border-b border-slate-900 pb-1">
                                <span>Profit Target:</span>
                                <span className="text-bull font-bold">${rule.profit_target.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-900 pb-1">
                                <span>Max Drawdown:</span>
                                <span className="text-bear font-bold">${rule.max_trailing_drawdown.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-900 pb-1">
                                <span>Daily Loss Limit:</span>
                                <span className="text-bear font-bold">${rule.daily_loss_limit.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-900 pb-1">
                                <span>Contracts Limit:</span>
                                <span className="text-cyan-400 font-bold">{rule.max_contracts_allowed} Max</span>
                              </div>
                              <div className="flex justify-between pt-0.5">
                                <span>Commission/Ctr:</span>
                                <span className="text-slate-300">${rule.commission_per_contract.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between pt-0.5">
                                <span>Consistency:</span>
                                <span className="text-slate-300">{rule.consistency_percentage}%</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          );
        })}

        {firms.length === 0 && (
          <div className="col-span-full">
            <ScrollReveal>
              <div className="py-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-500 text-sm font-bold shadow-inner">
                No prop firms registered. Add a firm to begin establishing rules.
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>

      {/* Info Notice card */}
      <ScrollReveal delay={0.2}>
        <div className="p-4 bg-bull-alpha border border-bull-alpha rounded-xl flex items-start gap-3 shadow-md">
          <HelpCircle size={18} className="text-bull mt-0.5 flex-shrink-0 animate-pulse" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-bull uppercase tracking-wider text-[10px]">
              {language === 'mm' ? 'ဤစည်းမျဉ်းများသည် အဘယ်နည်း။' : language === 'th' ? 'กฎเกณฑ์เหล่านี้คืออะไร?' : 'What are these rules?'}
            </h4>
            <p className="text-slate-300/95 leading-relaxed font-medium">
              {language === 'mm' 
                ? 'ကျောင်းသားများသည် သတ်မှတ်ထားသော Drawdown နှင့် Daily Loss limits များကို ကျော်လွန်ခြင်းမရှိစေရန် တိုက်ရိုက် စောင့်ကြည့်စစ်ဆေးပါသည်။ စည်းမျဉ်းတစ်ခုခုကို ချိုးဖောက်ပါက စနစ်မှ အလိုအလျောက် အကောင့်ကို Failed ဟု သတ်မှတ်ပေးပါမည်။' 
                : language === 'th' 
                  ? 'ระบบประเมินจะควบคุมระดับการขาดทุนสะสม (Trailing Drawdown) และเกณฑ์ขาดทุนรายวัน (Daily Loss Limit) หากขาดทุนเกินที่กำหนดไว้ บัญชีจะล้มเหลวโดยอัตโนมัติ' 
                  : 'Prop firms require traders to stay within strict limits. Trailing Drawdown tracks the distance from your highest recorded balance. If any rule is violated, the status changes to Failed automatically.'}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Firm Modal */}
      {showFirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-white">Add New Prop Firm</h3>
            <form onSubmit={handleAddFirmSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Firm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Apex Trader Funding"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Logo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={firmLogo}
                  onChange={(e) => setFirmLogo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFirmModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-bull hover:opacity-90 text-slate-950 rounded-lg text-sm font-black transition-colors shadow-md shadow-cyan-500/10 cursor-pointer"
                >
                  Save Firm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-auto shadow-2xl">
            <h3 className="text-lg font-bold text-white font-sans">Create Prop Firm Rule Profile</h3>
            <form onSubmit={handleAddRuleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Prop Firm</label>
                <select
                  value={selectedFirmId}
                  onChange={(e) => setSelectedFirmId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                >
                  {firms.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Account Size ($)</label>
                  <input
                    type="number"
                    required
                    value={accountSize}
                    onChange={(e) => setAccountSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Account Type</label>
                  <input
                    type="text"
                    required
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    placeholder="e.g., Express, Evaluation"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Profit Target ($)</label>
                  <input
                    type="number"
                    required
                    value={profitTarget}
                    onChange={(e) => setProfitTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Max Trailing Drawdown ($)</label>
                  <input
                    type="number"
                    required
                    value={maxDrawdown}
                    onChange={(e) => setMaxDrawdown(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Daily Loss Limit ($)</label>
                  <input
                    type="number"
                    required
                    value={dailyLoss}
                    onChange={(e) => setDailyLoss(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Max Contracts Allowed</label>
                  <input
                    type="number"
                    required
                    value={maxContracts}
                    onChange={(e) => setMaxContracts(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Commission ($ / contract)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Consistency Rules (%)</label>
                  <input
                    type="number"
                    required
                    value={consistency}
                    onChange={(e) => setConsistency(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-bull hover:opacity-90 text-slate-950 rounded-lg text-sm font-black transition-colors shadow-md shadow-cyan-500/10 cursor-pointer"
                >
                  Save Rule Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
