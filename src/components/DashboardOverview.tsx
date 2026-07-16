import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { 
  TrendingUp, Users, Award, ShieldAlert, 
  ArrowUpRight, ArrowDownRight, 
  Flame, Receipt
} from 'lucide-react';
import { StudentAccount, TradeLog, Payout, PropFirmRule, ColorTheme } from '../types';
import { Language, translations } from '../lib/translations';
import ScrollReveal from './ScrollReveal';

interface DashboardOverviewProps {
  accounts: StudentAccount[];
  trades: TradeLog[];
  payouts: Payout[];
  rules: PropFirmRule[];
  currentRole: 'admin' | 'student';
  onNavigateToTrades: () => void;
  onNavigateToAccounts: () => void;
  onNavigateToPayouts: () => void;
  t: any;
  language: Language;
  theme: ColorTheme;
}

export default function DashboardOverview({
  accounts,
  trades,
  payouts,
  rules,
  currentRole,
  onNavigateToTrades,
  onNavigateToAccounts,
  onNavigateToPayouts,
  t,
  language,
  theme
}: DashboardOverviewProps) {

  // Calculate high level stats
  const totalEvaluated = accounts.length;
  const activeAccounts = accounts.filter(a => a.status === 'Active');
  const passedAccounts = accounts.filter(a => a.status === 'Passed');
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

  // Prepare data for Equity Curve
  const equityCurveData = useMemo(() => {
    let sum = 0;
    // Sort trades by date
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

  // Compute status distribution for bar chart using active theme hex colors
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      'Active': 0,
      'Passed': 0,
      'Failed': 0
    };
    accounts.forEach(acc => {
      if (acc.status === 'Active') counts['Active']++;
      else if (acc.status === 'Passed') counts['Passed']++;
      else counts['Failed']++;
    });

    return [
      { name: language === 'mm' ? 'အသုံးပြုဆဲ' : language === 'th' ? 'กำลังใช้งาน' : 'Active', count: counts['Active'], color: '#0ea5e9' },
      { name: language === 'mm' ? 'အောင်မြင်ပြီး' : language === 'th' ? 'ผ่าน' : 'Passed', count: counts['Passed'], color: theme.bullColor },
      { name: language === 'mm' ? 'မအောင်မြင်ပါ' : language === 'th' ? 'ไม่ผ่าน' : 'Failed', count: counts['Failed'], color: theme.bearColor }
    ];
  }, [accounts, language, theme]);

  // Find rules mapping
  const rulesMap = useMemo(() => {
    return new Map(rules.map(r => [r.id, r]));
  }, [rules]);

  // Extra translated pieces
  const labelWelcome = language === 'mm' 
    ? `မင်္ဂလာပါ CORE Mentorship မှ ကြိုဆိုပါတယ်၊ ${currentRole === 'admin' ? 'ကြီးကြပ်သူ Admin' : 'သင်တန်းသား Student'}`
    : language === 'th'
      ? `ยินดีต้อนรับกลับสู่ CORE Mentorship, ${currentRole === 'admin' ? 'ผู้ดูแล Admin' : 'นักเรียน Student'}`
      : `Welcome back to CORE Mentorship, ${currentRole === 'admin' ? 'Admin User' : 'Student Trader'}`;

  const labelWelcomeSub = language === 'mm'
    ? "CORE Mentorship evaluation platform ဖြစ်သည်။ သင်၏ အရောင်းအဝယ်များကို စစ်ဆေးခြင်း၊ drawdowns စောင့်ကြည့်ခြင်း၊ metrics များနှင့် ငွေထုတ်ယူမှုများကို ဤနေရာတွင် စီမံခန့်ခွဲနိုင်ပါသည်။"
    : language === 'th'
      ? "ยินดีต้อนรับสู่แพลตฟอร์มการประเมินของ CORE Mentorship คุณสามารถตรวจสอบสถานะบัญชี ติดตาม drawdown และจัดการการเบิกเงินได้ที่นี่"
      : "Manage challenges, monitor real-time trailing drawdown violations, track compliance metrics, and distribute payouts within CORE Mentorship.";

  const winRateLabel = language === 'mm' ? 'အရောင်းအဝယ် နိုင်နှုန်း (Win Rate)' : language === 'th' ? 'อัตราการชนะ (Win Rate)' : 'Win Rate';
  const passRateLabel = language === 'mm' ? 'အောင်မြင်မှုနှုန်း (Pass Rate)' : language === 'th' ? 'อัตราการผ่าน (Pass Rate)' : 'Pass Rate';
  const totalPayoutsLabel = language === 'mm' ? 'စုစုပေါင်း ထုတ်ယူငွေ (Total Payouts)' : language === 'th' ? 'การเบิกเงินทั้งหมด (Total Payouts)' : 'Total Payouts';

  const labelFunnel = language === 'mm' ? 'အကောင့်များ၏ အခြေအနေ (Account Health)' : language === 'th' ? 'สถานะบัญชีและรายงาน' : 'Account Funnel & Health';
  const labelFunnelSub = language === 'mm' ? 'အောင်မြင်၊ ရှုံးနိမ့် နှင့် စစ်ဆေးဆဲ စာရင်းဇယား' : language === 'th' ? 'รายงานจำนวนบัญชีผ่านการประเมิน' : 'Current active vs failed and certificate status.';

  const labelViolations = language === 'mm' ? 'စည်းမျဉ်း ချိုးဖောက်မှုနှင့် သတိပေးချက်များ' : language === 'th' ? 'การแจ้งเตือนกฎและข้อกำหนด' : 'Real-Time Risk Violations & Warnings';
  const labelViolationsSub = language === 'mm' ? 'စောင့်ကြည့်ရေး စနစ်မှ ထုတ်ပြန်သော သတိပေးချက်များ' : language === 'th' ? 'ระบบตรวจพบการทำผิดกฎจำลองตามเวลาจริง' : 'Simulated live RLS system monitoring status.';

  return (
    <div className="space-y-6" id="dashboard-overview">
      {/* Welcome Banner */}
      <ScrollReveal>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-bull-alpha rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-40 h-40 bg-bear-alpha rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-bold bg-bull-alpha text-bull rounded-full border border-bull-alpha capitalize">
                  {language === 'en' ? 'Workspace Role' : language === 'th' ? 'บทบาท' : 'အသုံးပြုသူအမျိုးအစား'}: {currentRole === 'admin' ? t.headRisk : t.traderStudent}
                </span>
                <span className="w-1.5 h-1.5 bg-bull rounded-full animate-ping" />
                <span className="text-slate-400 text-xs">Simulated Database Connection Active</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                {labelWelcome}
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                {labelWelcomeSub}
              </p>
            </div>
            <button
              onClick={onNavigateToTrades}
              className="px-5 py-2.5 bg-bull hover:opacity-95 text-slate-950 rounded-lg text-sm font-black transition-all hover:scale-[1.02] flex items-center gap-2 active:scale-95 shadow-lg shadow-cyan-500/15 cursor-pointer"
            >
              <TrendingUp size={16} strokeWidth={2.5} />
              <span>{t.launchSimDesk}</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* KPI Stats Grid */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.totalAccounts}</span>
              <div className="p-2 rounded-lg bg-bull-alpha text-bull border border-bull-alpha">
                <Users size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white">{totalEvaluated}</div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-bull font-bold">{activeAccounts.length} {t.activeEvaluations}</span>
                <span>{language === 'mm' ? 'အကောင့်ရှိပါသည်' : language === 'th' ? 'บัญชี' : 'accounts'}</span>
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{passRateLabel}</span>
              <div className="p-2 rounded-lg bg-bull-alpha text-bull border border-bull-alpha">
                <Award size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white">{passRate}%</div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-bull font-bold">{passedAccounts.length} {language === 'mm' ? 'အောင်မြင်ပြီး' : language === 'th' ? 'บัญชีผ่าน' : 'accounts passed'}</span>
              </p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{winRateLabel}</span>
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/10">
                <Flame size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white">{winRate}%</div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-yellow-400 font-bold">{profitableTradesCount} wins</span>
                <span>of {totalTradesCount} trades</span>
              </p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{totalPayoutsLabel}</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10">
                <Receipt size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white">
                ${totalPayoutsSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-purple-400 font-bold">{payouts.length} transactions</span>
                <span>paid</span>
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
                  <TrendingUp size={16} className="text-bull" />
                  {t.cumulativePnl}
                </h3>
                <p className="text-slate-400 text-xs">{t.cumulativePnlSub}</p>
              </div>
              <div className={`px-2.5 py-1 text-xs font-bold rounded-full border ${netPnLTotal >= 0 ? 'bg-bull-alpha text-bull border-bull-alpha' : 'bg-bear-alpha text-bear border-bear-alpha'}`}>
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

          {/* Status Distribution and Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-0.5 mb-4">
              <h3 className="text-sm font-semibold text-slate-200">{labelFunnel}</h3>
              <p className="text-slate-400 text-xs">{labelFunnelSub}</p>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} barSize={36}>
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

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />
                <span>{t.activeEvaluations} ({activeAccounts.length})</span>
              </div>
              <div className="flex items-center gap-1.5 font-sans">
                <div className="w-2.5 h-2.5 rounded-full bg-bull" />
                <span>{t.passedEvaluations} ({passedAccounts.length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-bear" />
                <span>{t.failedEvaluations} ({failedAccounts.length})</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Critical Risk Violations Alerts & Recent Trade Logs */}
      <ScrollReveal delay={0.3}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk violations list */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-bear animate-pulse" />
                  {labelViolations}
                </h3>
                <p className="text-slate-400 text-xs">{labelViolationsSub}</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-bear-alpha text-bear border border-bear-alpha font-bold">
                Live Inspector
              </span>
            </div>

            <hr className="border-slate-800/80" />

            <div className="space-y-3 max-h-[220px] overflow-auto">
              {failedAccounts.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs font-semibold">
                  {language === 'mm' 
                    ? 'ချိုးဖောက်ထားသော စည်းမျဉ်းမရှိပါ၊ အကောင့်အားလုံး ပုံမှန်အလုပ်လုပ်နေပါသည်။' 
                    : language === 'th' 
                      ? 'ไม่มีการละเมิดกฎใดๆ บัญชีทั้งหมดอยู่ในสถานะปกติ' 
                      : 'No risk rule violations reported. All accounts are within parameters!'}
                </div>
              ) : (
                failedAccounts.map((acc) => {
                  const rule = rulesMap.get(acc.rule_id);
                  const drawdownAmount = acc.highest_balance - acc.current_balance;
                  const dailyLossBreached = acc.initial_balance - acc.current_balance >= (rule?.daily_loss_limit ?? 1000);

                  return (
                    <div key={acc.id} className="p-3 bg-bear-alpha border border-bear-alpha rounded-xl flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-bear-alpha text-bear mt-0.5">
                        <ShieldAlert size={14} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200 font-mono">{acc.account_number}</span>
                          <span className="text-[10px] font-bold text-bear bg-bear-alpha px-2 py-0.5 rounded-full border border-bear-alpha font-mono uppercase">
                            {acc.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed font-medium">
                          Account size of <strong className="text-slate-300 font-mono">${rule?.account_size.toLocaleString()}</strong> breached core safety parameters. 
                          {dailyLossBreached 
                            ? ` Daily Loss exceeded rule threshold of $${rule?.daily_loss_limit}.`
                            : ` Drawdown threshold of $${rule?.max_trailing_drawdown} exceeded (Current: $${drawdownAmount.toLocaleString()}).`
                          }
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Trades Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-200">{t.recentTrades}</h3>
                <p className="text-slate-400 text-xs">{t.recentTradesSub}</p>
              </div>
              <button 
                onClick={onNavigateToTrades}
                className="text-xs text-bull font-bold hover:opacity-80 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'mm' ? 'အရောင်းအဝယ် စမ်းသပ်ခန်းသို့ သွားပါ' : language === 'th' ? 'เปิดโต๊ะเทรด' : 'View Desk'}</span>
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </button>
            </div>

            <hr className="border-slate-800/80" />

            <div className="space-y-2.5 max-h-[220px] overflow-auto">
              {trades.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No simulated trades logged yet. Go to the Trading Desk to place simulated futures trades!
                </div>
              ) : (
                [...trades]
                  .sort((a, b) => new Date(b.trade_time).getTime() - new Date(a.trade_time).getTime())
                  .slice(0, 4)
                  .map((t) => {
                    const account = accounts.find(a => a.id === t.account_id);
                    const isGain = t.net_pnl >= 0;

                    return (
                      <div key={t.id} className="p-2.5 hover:bg-slate-800/40 rounded-xl flex items-center justify-between transition-colors text-xs border border-slate-800/30">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isGain ? 'bg-bull-alpha text-bull' : 'bg-bear-alpha text-bear'}`}>
                            {isGain ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-200 font-mono">{t.instrument}</span>
                              <span className={`px-1 rounded text-[9px] font-bold ${t.action === 'BUY' ? 'bg-bull-alpha text-bull' : 'bg-amber-500/10 text-amber-400'}`}>
                                {t.action}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{account?.account_number ?? 'Unknown'}</span>
                          </div>
                        </div>

                        <div className="text-right space-y-0.5">
                          <span className={`font-mono font-bold ${isGain ? 'text-bull' : 'text-bear'}`}>
                            {isGain ? '+' : ''}${t.net_pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <div className="text-[9px] text-slate-500 font-mono">
                            {t.contracts_traded} Ctr · Comm: ${(t.contracts_traded * 3.0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
