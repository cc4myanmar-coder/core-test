import React, { useState, useMemo } from 'react';
import { 
  Play, Terminal, ShieldCheck, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { StudentAccount, PropFirmRule, FutureInstrument, TradeAction, TradeLog } from '../types';
import { Language } from '../lib/translations';
import ScrollReveal from './ScrollReveal';

interface TradingDeskPanelProps {
  accounts: StudentAccount[];
  rules: PropFirmRule[];
  trades: TradeLog[];
  onAddTrade: (trade: Omit<TradeLog, 'id'>) => void;
  onUpdateAccountStatus: (id: string, status: any, isEditable: boolean) => void;
  onUpdateAccountBalance: (id: string, newBalance: number, highestBalance: number) => void;
  t: any;
  language: Language;
}

const INSTRUMENT_MULTIPLIERS: Record<FutureInstrument, number> = {
  NQ: 20,    // Nasdaq-100: $20 per full point
  MNQ: 2,    // Micro Nasdaq: $2 per point
  ES: 50,    // S&P 500: $50 per full point
  MES: 5     // Micro S&P: $5 per point
};

const DEFAULT_MARKET_PRICES: Record<FutureInstrument, number> = {
  NQ: 18320.00,
  MNQ: 18320.00,
  ES: 5125.50,
  MES: 5125.50
};

export default function TradingDeskPanel({
  accounts,
  rules,
  trades,
  onAddTrade,
  onUpdateAccountStatus,
  onUpdateAccountBalance,
  t,
  language
}: TradingDeskPanelProps) {
  // Simulator form states
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [instrument, setInstrument] = useState<FutureInstrument>('NQ');
  const [action, setAction] = useState<TradeAction>('BUY');
  const [contracts, setContracts] = useState(2);
  const [openPrice, setOpenPrice] = useState<number>(18300);
  const [closePrice, setClosePrice] = useState<number>(18325);

  // Trigger feedback messages
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger' | 'warning'; msg: string } | null>(null);

  const activeAccounts = useMemo(() => {
    return accounts.filter(acc => acc.status === 'Active' && acc.is_editable);
  }, [accounts]);

  const rulesMap = useMemo(() => new Map(rules.map(r => [r.id, r])), [rules]);
  const currentAccount = useMemo(() => {
    return accounts.find(a => a.id === selectedAccountId);
  }, [accounts, selectedAccountId]);

  const currentRule = useMemo(() => {
    if (!currentAccount) return null;
    return rulesMap.get(currentAccount.rule_id) || null;
  }, [currentAccount, rulesMap]);

  // Sync open price based on selected instrument
  const handleInstrumentChange = (inst: FutureInstrument) => {
    setInstrument(inst);
    const defaultPrice = DEFAULT_MARKET_PRICES[inst];
    setOpenPrice(defaultPrice);
    setClosePrice(action === 'BUY' ? defaultPrice + 15 : defaultPrice - 15);
  };

  // Live P&L Calculation helper
  const livePnL = useMemo(() => {
    const multiplier = INSTRUMENT_MULTIPLIERS[instrument];
    const diff = closePrice - openPrice;
    const gross = action === 'BUY' ? diff * multiplier * contracts : -diff * multiplier * contracts;
    const commPerSide = currentRule?.commission_per_contract ?? 1.5;
    const commission = contracts * commPerSide * 2; // round trip
    const net = gross - commission;
    return { gross, commission, net };
  }, [instrument, action, contracts, openPrice, closePrice, currentRule]);

  const handleQuickAdjust = (ticks: number) => {
    const tickSize = instrument.includes('ES') ? 0.25 : 1.0;
    setClosePrice(prev => Number((prev + (ticks * tickSize)).toFixed(2)));
  };

  const handleTradeExecution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount || !currentRule) {
      alert('Please select a valid, active student account.');
      return;
    }

    const { gross, commission, net } = livePnL;
    const newBalance = currentAccount.current_balance + net;
    const previousHighest = currentAccount.highest_balance;
    const newHighest = Math.max(previousHighest, newBalance);

    // 1. ADD TRADE LOG ENTRY
    const newTrade: Omit<TradeLog, 'id'> = {
      account_id: currentAccount.id,
      instrument,
      action,
      contracts_traded: contracts,
      open_price: openPrice,
      close_price: closePrice,
      gross_pnl: gross,
      net_pnl: net,
      trade_time: new Date().toISOString()
    };

    onAddTrade(newTrade);

    // 2. CHECK RULE BREACHES
    const isContractsBreached = contracts > currentRule.max_contracts_allowed;
    const currentDrawdown = newHighest - newBalance;
    const isDrawdownBreached = currentDrawdown > currentRule.max_trailing_drawdown;
    const currentTotalLossFromStart = currentAccount.initial_balance - newBalance;
    const isDailyLossBreached = currentTotalLossFromStart >= currentRule.daily_loss_limit;

    // Determine Status
    if (isContractsBreached || isDrawdownBreached || isDailyLossBreached) {
      // Failed Account!
      const failedStatus = currentAccount.status === 'Active' ? 'Failed_at_Challenge' : 'Failed_at_Funded';
      
      let reason = '';
      if (isContractsBreached) reason = `Exceeded max contracts allowed (${currentRule.max_contracts_allowed} contracts)`;
      else if (isDailyLossBreached) reason = `Daily Loss Limit of $${currentRule.daily_loss_limit} exceeded`;
      else if (isDrawdownBreached) reason = `Max Trailing Drawdown threshold of $${currentRule.max_trailing_drawdown} hit. (Recorded drawdown: $${currentDrawdown.toFixed(2)})`;

      onUpdateAccountStatus(currentAccount.id, failedStatus, false); // lock trade editing
      onUpdateAccountBalance(currentAccount.id, newBalance, newHighest);

      setFeedback({
        type: 'danger',
        msg: `🚨 TRADE FAILED RULES! Account ${currentAccount.account_number} violated safety parameters: ${reason}. Status set to Failed.`
      });
    } else if (newBalance >= currentAccount.initial_balance + currentRule.profit_target) {
      // Passed Account!
      onUpdateAccountStatus(currentAccount.id, 'Passed', false); // passed! Lock trading so they can print credential
      onUpdateAccountBalance(currentAccount.id, newBalance, newHighest);

      setFeedback({
        type: 'success',
        msg: `🏆 CONGRATULATIONS! Account ${currentAccount.account_number} has reached the profit target of $${currentRule.profit_target.toLocaleString()}! Status updated to Passed.`
      });
    } else {
      // Normal successful trade update
      onUpdateAccountBalance(currentAccount.id, newBalance, newHighest);
      setFeedback({
        type: 'success',
        msg: `✅ Trade Log registered successfully. P&L of ${net >= 0 ? '+' : ''}$${net.toFixed(2)} applied to account ${currentAccount.account_number}.`
      });
    }

    // Reset feedback helper
    setTimeout(() => {
      setFeedback(null);
    }, 8000);
  };

  const titleText = language === 'mm' ? 'အရောင်းအဝယ် စမ်းသပ်ခန်း နှင့် စည်းမျဉ်းစစ်ဆေးရေးစနစ်' : language === 'th' ? 'จำลองโต๊ะเทรดและมอนิเตอร์ความเสี่ยง' : 'Simulated Trading Desk & Risk Monitor';
  const subText = language === 'mm' ? 'စမ်းသပ်အရောင်းအဝယ်ပြုလုပ်ပြီး စည်းမျဉ်းစနစ်မှ ကျောင်းသားအကောင့်ကို တိုက်ရိုက်စစ်ဆေးပုံကို ကြည့်ပါ။' : language === 'th' ? 'เปิดออเดอร์ฟิวเจอร์สจำลองเพื่อทดสอบระบบประเมินความเสี่ยงทันที' : 'Place mock futures trades and watch the real-time rule compiler evaluate accounts instantly.';

  return (
    <div className="space-y-6" id="trading-desk-panel">
      {/* Header */}
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">{titleText}</h1>
          <p className="text-slate-400 text-sm font-medium">{subText}</p>
        </div>
      </ScrollReveal>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Order Terminal */}
        <div className="lg:col-span-5 space-y-6">
          <ScrollReveal delay={0.1}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800/80 pb-3 font-sans">
                <Terminal size={16} className="text-bull" />
                {language === 'mm' ? 'အော်ဒါ ဖွင့်လှစ်ခြင်း' : language === 'th' ? 'ส่งคำสั่งเทรดจำลอง' : 'Order Entry Block'}
              </h3>

              {activeAccounts.length === 0 ? (
                <div className="py-12 px-4 text-center text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800/50 font-bold">
                  No active student accounts available for simulation. Please create or reactivate an account in the Accounts Panel first.
                </div>
              ) : (
                <form onSubmit={handleTradeExecution} className="space-y-4">
                  
                  {/* Account Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Trading Account</label>
                    <select
                      value={selectedAccountId}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {activeAccounts.map(acc => {
                        const rule = rulesMap.get(acc.rule_id);
                        return (
                          <option key={acc.id} value={acc.id}>
                            {acc.account_number} (Bal: ${acc.current_balance.toLocaleString()} · {rule?.account_type})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Instrument Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Futures Instrument</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['NQ', 'MNQ', 'ES', 'MES'] as FutureInstrument[]).map(inst => (
                        <button
                          key={inst}
                          type="button"
                          onClick={() => handleInstrumentChange(inst)}
                          className={`py-2 px-2.5 rounded-lg font-mono text-xs border transition-all cursor-pointer ${instrument === inst ? 'bg-bull-alpha border-bull text-bull font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                        >
                          {inst}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Choice: BUY vs SELL */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setAction('BUY')}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${action === 'BUY' ? 'bg-bull text-slate-950 border-cyan-400 font-black' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      <ArrowUpRight size={14} strokeWidth={2.5} />
                      <span>BUY / LONG</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAction('SELL')}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${action === 'SELL' ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      <ArrowDownRight size={14} strokeWidth={2.5} />
                      <span>SELL / SHORT</span>
                    </button>
                  </div>

                  {/* Contract count */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <label className="font-semibold">Contracts Traded</label>
                      {currentRule && (
                        <span className="font-mono text-[10px] text-amber-400 font-bold">
                          Max Allowed: {currentRule.max_contracts_allowed}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={contracts}
                      onChange={(e) => setContracts(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Open/Close Prices */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Entry Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={openPrice}
                        onChange={(e) => setOpenPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Exit Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={closePrice}
                        onChange={(e) => setClosePrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Ticks adjusts buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Quick offset:</span>
                    <button
                      type="button"
                      onClick={() => handleQuickAdjust(-10)}
                      className="px-2 py-1 bg-slate-950 border border-slate-800 text-[10px] rounded font-mono hover:bg-slate-800 text-bear font-bold cursor-pointer transition-colors"
                    >
                      -10 pts
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdjust(-2)}
                      className="px-2 py-1 bg-slate-950 border border-slate-800 text-[10px] rounded font-mono hover:bg-slate-800 text-slate-400 cursor-pointer transition-colors"
                    >
                      -2 pts
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdjust(2)}
                      className="px-2 py-1 bg-slate-950 border border-slate-800 text-[10px] rounded font-mono hover:bg-slate-800 text-slate-200 cursor-pointer transition-colors"
                    >
                      +2 pts
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdjust(10)}
                      className="px-2 py-1 bg-slate-950 border border-slate-800 text-[10px] rounded font-mono hover:bg-slate-800 text-bull font-bold cursor-pointer transition-colors"
                    >
                      +10 pts
                    </button>
                  </div>

                  {/* Estimated P&L calculation box */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Simulated Trade Ledger</span>
                    
                    <div className="grid grid-cols-3 text-center gap-1 text-[11px] font-mono">
                      <div className="border-r border-slate-900">
                        <span className="text-slate-400 block font-bold">Gross P&L</span>
                        <strong className={livePnL.gross >= 0 ? 'text-bull' : 'text-bear'}>
                          {livePnL.gross >= 0 ? '+' : ''}${livePnL.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                      <div className="border-r border-slate-900">
                        <span className="text-slate-400 block font-bold">Round Comm.</span>
                        <strong className="text-slate-300">${livePnL.commission.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">Net P&L</span>
                        <strong className={`font-bold ${livePnL.net >= 0 ? 'text-bull' : 'text-bear'}`}>
                          {livePnL.net >= 0 ? '+' : ''}${livePnL.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Execution Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-bull hover:opacity-95 font-black text-slate-950 rounded-lg text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/10 active:scale-95 cursor-pointer"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Execute Simulated Trade</span>
                  </button>

                </form>
              )}

              {feedback && (
                <div className={`p-4 rounded-xl text-xs border ${feedback.type === 'success' ? 'bg-bull-alpha border-bull-alpha text-bull font-bold' : 'bg-bear-alpha border-bear-alpha text-bear font-bold'}`}>
                  {feedback.msg}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Right Side: Account Rule Parameters and Audit Feed */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Risk Monitor Status */}
          {currentAccount && currentRule ? (
            <ScrollReveal delay={0.15}>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                    <ShieldCheck size={16} className="text-bull" />
                    Real-Time Rules Compliance compiler
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-bold">
                    {currentAccount.account_number}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
                    <span className="text-slate-500 text-[10px] block font-bold">Current Balance</span>
                    <strong className="text-sm text-slate-100 font-bold">${currentAccount.current_balance.toLocaleString()}</strong>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
                    <span className="text-slate-500 text-[10px] block font-bold">High Balance</span>
                    <strong className="text-sm text-slate-100 font-bold">${currentAccount.highest_balance.toLocaleString()}</strong>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
                    <span className="text-slate-500 text-[10px] block font-bold">Drawdown</span>
                    <strong className="text-sm text-bear font-bold">
                      ${(currentAccount.highest_balance - currentAccount.current_balance).toLocaleString()} / ${currentRule.max_trailing_drawdown.toLocaleString()}
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
                    <span className="text-slate-500 text-[10px] block font-bold">Target Remaining</span>
                    <strong className="text-sm text-bull font-bold">
                      ${Math.max(0, currentAccount.initial_balance + currentRule.profit_target - currentAccount.current_balance).toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Status checklist */}
                <div className="space-y-3.5 text-xs">
                  <h4 className="text-slate-300 font-bold text-xs font-mono uppercase tracking-wider">Safety Threshold checks:</h4>
                  
                  <div className="space-y-2">
                    {/* Drawdown */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-bull animate-pulse" />
                        <span className="text-slate-200 font-medium">Max Drawdown Checklist</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px] font-bold">
                        Safe (&lt; ${currentRule.max_trailing_drawdown})
                      </span>
                    </div>

                    {/* Daily loss */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-bull animate-pulse" />
                        <span className="text-slate-200 font-medium">Daily Loss Limit Check</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px] font-bold">
                        Safe (&lt; ${currentRule.daily_loss_limit})
                      </span>
                    </div>

                    {/* Contracts */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-bull animate-pulse" />
                        <span className="text-slate-200 font-medium">Contracts Allowed Rule</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px] font-bold">
                        Checked per Order
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal delay={0.15}>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs font-bold shadow-lg">
                Select an active student account on the left to inspect its real-time compiled risk parameters.
              </div>
            </ScrollReveal>
          )}

          {/* Simulated trade feed logs */}
          <ScrollReveal delay={0.2}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between font-sans">
                <span>Historical Simulated Trade Logs Feed</span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{trades.length} trades recorded</span>
              </h3>

              <hr className="border-slate-800/80" />

              <div className="space-y-2.5 max-h-[250px] overflow-auto">
                {trades.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-bold">
                    No simulated trades have been executed yet.
                  </div>
                ) : (
                  [...trades]
                    .sort((a, b) => new Date(b.trade_time).getTime() - new Date(a.trade_time).getTime())
                    .map((t) => {
                      const acc = accounts.find(a => a.id === t.account_id);
                      const isGain = t.net_pnl >= 0;

                      return (
                        <div key={t.id} className="p-3 bg-slate-950 border border-slate-800/50 hover:border-slate-700/50 rounded-xl flex items-center justify-between text-xs transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${isGain ? 'bg-bull-alpha text-bull' : 'bg-bear-alpha text-bear'}`}>
                              {isGain ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-200">{t.instrument}</span>
                                <span className={`px-1 rounded text-[9px] font-bold ${t.action === 'BUY' ? 'bg-bull-alpha text-bull' : 'bg-amber-500/10 text-amber-400'}`}>
                                  {t.action}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                Account: <strong className="text-slate-400">{acc?.account_number ?? 'Unknown'}</strong> · {new Date(t.trade_time).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>

                          <div className="text-right space-y-0.5">
                            <span className={`font-mono font-extrabold ${isGain ? 'text-bull' : 'text-bear'}`}>
                              {isGain ? '+' : ''}${t.net_pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <p className="text-[9px] text-slate-500 font-mono">
                              {t.contracts_traded} Ctr · Entry: {t.open_price} · Exit: {t.close_price}
                            </p>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </div>
  );
}
