import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { 
  TrendingUp, Users, Award, ShieldAlert, 
  ArrowUpRight, ArrowDownRight, 
  Flame, Receipt, Bot, FileSpreadsheet, Lock, Sparkles, Trophy, CheckCircle2, RefreshCw
} from 'lucide-react';
import { StudentAccount, TradeLog, Payout, PropFirmRule, ColorTheme, PropFirm } from '../types';
import { Language, translations } from '../lib/translations';
import ScrollReveal from './ScrollReveal';
import CsvTradeLogUploader from './CsvTradeLogUploader';
import AiAnalysisModal from './AiAnalysisModal';

interface DashboardOverviewProps {
  accounts: StudentAccount[];
  trades: TradeLog[];
  payouts: Payout[];
  rules: PropFirmRule[];
  firms?: PropFirm[];
  currentRole: 'admin' | 'student';
  onNavigateToTrades: () => void;
  onNavigateToAccounts: () => void;
  onNavigateToPayouts: () => void;
  onNavigateToGallery?: () => void;
  onTradesUploaded?: (trades: TradeLog[]) => void;
  t: any;
  language: Language;
  theme: ColorTheme;
}

export default function DashboardOverview({
  accounts,
  trades,
  payouts,
  rules,
  firms = [],
  currentRole,
  onNavigateToTrades,
  onNavigateToAccounts,
  onNavigateToPayouts,
  onNavigateToGallery,
  onTradesUploaded,
  t,
  language,
  theme
}: DashboardOverviewProps) {
  const isMm = language === 'mm';
  const [showCsvUploader, setShowCsvUploader] = useState(false);
  const [selectedAiAccount, setSelectedAiAccount] = useState<StudentAccount | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Calculate high level stats
  const totalEvaluated = accounts.length;
  const challengeAccounts = accounts.filter(a => a.status === 'Challenge' || a.status === 'Active');
  const passedAccounts = accounts.filter(a => a.status === 'Passed');
  const fundedAccounts = accounts.filter(a => a.status === 'Funded' || a.status === 'Payout_Active');
  const failedAccounts = accounts.filter(a => a.status.startsWith('Failed_at'));
  
  const passRate = totalEvaluated > 0 
    ? Math.round((passedAccounts.length / totalEvaluated) * 100) 
    : 0;

  const totalPayoutsSum = payouts.reduce((acc, p) => acc + Number(p.amount), 0);
  
  // Total Gross and Net PnL of all trades
  const netPnLTotal = trades.reduce((acc, t) => acc + Number(t.net_pnl), 0);
  const totalTradesCount = trades.length;
  const profitableTradesCount = trades.filter(t => t.net_pnl > 0).length;
  const winRate = totalTradesCount > 0 
    ? Math.round((profitableTradesCount / totalTradesCount) * 100) 
    : 0;

  // Filter accounts list for detailed view
  const filteredAccountsList = useMemo(() => {
    if (statusFilter === 'ALL') return accounts;
    if (statusFilter === 'CHALLENGE') return accounts.filter(a => a.status === 'Challenge' || a.status === 'Active');
    if (statusFilter === 'PASSED') return accounts.filter(a => a.status === 'Passed');
    if (statusFilter === 'FUNDED') return accounts.filter(a => a.status === 'Funded' || a.status === 'Payout_Active');
    if (statusFilter === 'FAILED') return accounts.filter(a => a.status.startsWith('Failed_at'));
    return accounts;
  }, [accounts, statusFilter]);

  // Prepare data for Equity Curve
  const equityCurveData = useMemo(() => {
    let sum = 0;
    const sortedTrades = [...trades].sort((a, b) => new Date(a.trade_time).getTime() - new Date(b.trade_time).getTime());
    return [
      { name: 'Start', pnl: 0, balance: 0 },
      ...sortedTrades.map((t, idx) => {
        sum += t.net_pnl;
        return {
          name: `Trade ${idx + 1}`,
          pnl: sum,
          instrument: t.instrument,
          net: t.net_pnl
        };
      })
    ];
  }, [trades]);

  // Status distribution bar chart
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      'Challenge': challengeAccounts.length,
      'Passed': passedAccounts.length,
      'Funded': fundedAccounts.length,
      'Failed': failedAccounts.length
    };

    return [
      { name: isMm ? 'Challenge' : 'Challenge', count: counts['Challenge'], color: '#38bdf8' },
      { name: isMm ? 'Passed' : 'Passed', count: counts['Passed'], color: '#f59e0b' },
      { name: isMm ? 'Funded' : 'Funded', count: counts['Funded'], color: theme.bullColor },
      { name: isMm ? 'Failed' : 'Failed', count: counts['Failed'], color: theme.bearColor }
    ];
  }, [challengeAccounts, passedAccounts, fundedAccounts, failedAccounts, isMm, theme]);

  // Find rules mapping
  const rulesMap = useMemo(() => {
    return new Map(rules.map(r => [r.id, r]));
  }, [rules]);

  // Find firms mapping
  const firmsMap = useMemo(() => {
    return new Map(firms.map(f => [f.id, f.name]));
  }, [firms]);

  return (
    <div className="space-y-6" id="dashboard-overview">
      {/* Welcome Banner */}
      <ScrollReveal>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 capitalize">
                  {currentRole === 'admin' ? (isMm ? 'အုပ်ချုပ်သူ Admin' : 'Admin Controller') : (isMm ? 'ကျောင်းသား Student' : 'Student Trader')}
                </span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-slate-400 text-xs font-mono">Futures Prop Firm System Active</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                CORE Mentorship Program
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                {isMm 
                  ? 'Futures Prop Firm အကောင့်များ၏ Challenge, Funded, Payout နှင့် Fail မှတ်တမ်းများကို တိကျစွာ Track လိုက်ပေးသော စနစ်ဖြစ်ပါသည်။'
                  : 'Comprehensive management dashboard for Futures Prop Firm accounts (NQ/MNQ/ES/MES). Track Challenge, Passed, Funded, and Payout lifecycles with AI trader analysis.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowCsvUploader(!showCsvUploader)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <FileSpreadsheet size={16} />
                <span>{isMm ? 'CSV Trade Logs တင်ရန်' : 'Import CSV Logs'}</span>
              </button>

              <button
                onClick={onNavigateToTrades}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 rounded-xl text-xs font-black transition-all hover:scale-[1.02] flex items-center gap-2 active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <TrendingUp size={16} strokeWidth={2.5} />
                <span>{t.launchSimDesk}</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* CSV Trade Log Uploader Modal/Drawer */}
      {showCsvUploader && (
        <ScrollReveal>
          <CsvTradeLogUploader
            accountId={accounts[0]?.id || 'acc-1'}
            accountNumber={accounts[0]?.account_number || 'CORE-1001'}
            commissionPerContract={rules[0]?.commission_per_contract || 1.5}
            language={language}
            onTradesUploaded={(uploaded) => {
              if (onTradesUploaded) onTradesUploaded(uploaded);
            }}
          />
        </ScrollReveal>
      )}

      {/* KPI Stats Grid */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.totalAccounts}</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Users size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white">{totalEvaluated}</div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-emerald-400 font-bold">{challengeAccounts.length} Challenge</span>
                <span>/ {fundedAccounts.length} Funded</span>
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isMm ? 'Passed Rate' : 'Pass Rate'}</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white">{passRate}%</div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-amber-400 font-bold">{passedAccounts.length} passed</span>
                <span>certificates</span>
              </p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isMm ? 'Win Rate' : 'Win Rate'}</span>
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Flame size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white">{winRate}%</div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-teal-400 font-bold">{profitableTradesCount} wins</span>
                <span>of {totalTradesCount} trades</span>
              </p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isMm ? 'ထုတ်ယူငွေ' : 'Total Payouts'}</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Receipt size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white">
                ${totalPayoutsSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-purple-400 font-bold">{payouts.length} payouts</span>
                <span>disbursed</span>
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Main Charts Row */}
      <ScrollReveal delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cumulative Equity Curve Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-emerald-400" />
                  {t.cumulativePnl}
                </h3>
                <p className="text-slate-400 text-xs">{t.cumulativePnlSub}</p>
              </div>
              <div className={`px-2.5 py-1 text-xs font-bold rounded-full border ${netPnLTotal >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                {netPnLTotal >= 0 ? '+' : ''}${netPnLTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={netPnLTotal >= 0 ? theme.bullColor : theme.bearColor} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={netPnLTotal >= 0 ? theme.bullColor : theme.bearColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px' }}
                    itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Cumulative P&L']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke={netPnLTotal >= 0 ? theme.bullColor : theme.bearColor} 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorPnL)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-0.5 mb-4">
              <h3 className="text-sm font-semibold text-slate-200">{isMm ? 'အကောင့်အမျိုးအစား ဖြန့်ကျက်မှု' : 'Account Status Lifecycle'}</h3>
              <p className="text-slate-400 text-xs">{isMm ? 'Challenge, Passed, Funded နှင့် Fail ခွဲခြားမှု' : 'Challenge vs Passed vs Funded vs Failed'}</p>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} barSize={28}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                  />
                  <Bar dataKey="count">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <span>Challenge: {challengeAccounts.length}</span>
              <span className="text-amber-400">Passed: {passedAccounts.length}</span>
              <span className="text-emerald-400">Funded: {fundedAccounts.length}</span>
              <span className="text-rose-400">Failed: {failedAccounts.length}</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Account Lifecycle Management Table & AI Detail Inspector */}
      <ScrollReveal delay={0.25}>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>{isMm ? 'Prop Firm Account စာရင်း နှင့် AI Detail Analysis' : 'Prop Firm Student Accounts & AI Inspector'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isMm ? 'သီးသန့် အကောင့်တစ်ခုချင်းစီကို Gemini AI ဖြင့် သုံးသပ်နိုင်ပါသည်' : 'Inspect individual accounts, view drawdown status, or run Gemini AI analysis.'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
              {['ALL', 'CHALLENGE', 'PASSED', 'FUNDED', 'FAILED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === tab ? 'bg-emerald-500 text-slate-950 font-extrabold shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <tr>
                  <th className="p-3">Account No</th>
                  <th className="p-3">Prop Firm</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Current Balance</th>
                  <th className="p-3 text-right">Target / Buffer</th>
                  <th className="p-3 text-center">Editable State</th>
                  <th className="p-3 text-right">AI Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                {filteredAccountsList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 font-sans text-xs">
                      {isMm ? 'ဤအခြေအနေတွင် ရှိသော အကောင့်မရှိသေးပါ' : 'No accounts match the selected status filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredAccountsList.map((acc) => {
                    const rule = rulesMap.get(acc.rule_id);
                    const firmName = rule ? firmsMap.get(rule.prop_firm_id) : 'Prop Firm';
                    const isFailed = acc.status.startsWith('Failed_at');

                    return (
                      <tr key={acc.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-bold text-slate-200">{acc.account_number}</td>
                        <td className="p-3 text-slate-400">{firmName || 'Futures Firm'}</td>
                        <td className="p-3 text-slate-300">${rule?.account_size ? rule.account_size.toLocaleString() : '50,000'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            acc.status === 'Passed' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            acc.status === 'Funded' || acc.status === 'Payout_Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            isFailed ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          }`}>
                            {acc.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-100">
                          ${acc.current_balance.toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-slate-400">
                          {rule?.profit_target ? `$${rule.profit_target.toLocaleString()}` : '$3,000'}
                        </td>
                        <td className="p-3 text-center">
                          {!acc.is_editable || isFailed ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-sans border border-slate-700">
                              <Lock className="h-3 w-3 text-rose-400" />
                              <span>ReadOnly</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 font-sans border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Active</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedAiAccount(acc)}
                            className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3 py-1.5 text-[11px] font-bold text-white transition-all shadow active:scale-95 font-sans"
                          >
                            <Bot className="h-3.5 w-3.5" />
                            <span>{isMm ? 'AI သုံးသပ်ရန်' : 'Run AI Analysis'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

      {/* AI Analysis Modal Popup */}
      {selectedAiAccount && (
        <AiAnalysisModal
          isOpen={!!selectedAiAccount}
          onClose={() => setSelectedAiAccount(null)}
          account={selectedAiAccount}
          rule={rulesMap.get(selectedAiAccount.rule_id)}
          firmName={rulesMap.get(selectedAiAccount.rule_id) ? firmsMap.get(rulesMap.get(selectedAiAccount.rule_id)!.prop_firm_id) : 'Prop Firm'}
          trades={trades.filter(t => t.account_id === selectedAiAccount.id)}
          language={language}
        />
      )}

    </div>
  );
}

