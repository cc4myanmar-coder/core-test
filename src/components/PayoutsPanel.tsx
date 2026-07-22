import React, { useState, useMemo } from 'react';
import { Coins, DollarSign, Plus, ShieldAlert, Sparkles } from 'lucide-react';
import { StudentAccount, Payout, PropFirmRule } from '../types';
import { Language } from '../lib/translations';
import ScrollReveal from './ScrollReveal';

interface PayoutsPanelProps {
  accounts: StudentAccount[];
  payouts: Payout[];
  rules: PropFirmRule[];
  currentRole: 'admin' | 'student';
  onAddPayout: (payout: Omit<Payout, 'id'>) => void;
  onUpdateAccountBalance: (id: string, newBalance: number, highestBalance: number) => void;
  t: any;
  language: Language;
}

export default function PayoutsPanel({
  accounts,
  payouts,
  rules,
  currentRole,
  onAddPayout,
  onUpdateAccountBalance,
  t,
  language
}: PayoutsPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [payoutAmount, setPayoutAmount] = useState(1000);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rulesMap = useMemo(() => new Map(rules.map(r => [r.id, r])), [rules]);
  const accountsMap = useMemo(() => new Map(accounts.map(a => [a.id, a])), [accounts]);

  // Accounts eligible for payout: Passed accounts with profit > 0
  const eligibleAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const rule = rulesMap.get(acc.rule_id);
      if (!rule) return false;
      const profit = acc.current_balance - acc.initial_balance;
      // Passed accounts, or active accounts above profit target
      return (acc.status === 'Passed' || (acc.status === 'Active' && profit >= rule.profit_target));
    });
  }, [accounts, rulesMap]);

  const currentSelectedAccount = useMemo(() => {
    return accounts.find(a => a.id === selectedAccountId);
  }, [accounts, selectedAccountId]);

  const maxEligibleAmount = useMemo(() => {
    if (!currentSelectedAccount) return 0;
    const rule = rulesMap.get(currentSelectedAccount.rule_id);
    if (!rule) return 0;
    // Maximum withdrawable is the excess profit above original size
    return Math.max(0, currentSelectedAccount.current_balance - currentSelectedAccount.initial_balance);
  }, [currentSelectedAccount, rulesMap]);

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId) return;

    const acc = accountsMap.get(selectedAccountId);
    if (!acc) return;

    if (payoutAmount <= 0) {
      setErrorMsg('Payout amount must be greater than zero.');
      return;
    }

    if (payoutAmount > maxEligibleAmount) {
      setErrorMsg(`Insufficient performance buffers! Max withdrawal is $${maxEligibleAmount.toLocaleString()}.`);
      return;
    }

    // Process simulated payout
    onAddPayout({
      account_id: selectedAccountId,
      amount: Number(payoutAmount),
      payout_date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    });

    // Subtract payout from account balance
    const updatedBalance = acc.current_balance - payoutAmount;
    onUpdateAccountBalance(selectedAccountId, updatedBalance, acc.highest_balance);

    setErrorMsg(null);
    setShowModal(false);
    setPayoutAmount(1000);
  };

  const titleText = language === 'mm' ? 'ငွေထုတ်ယူမှုများနှင့် အကျိုးအမြတ်ခွဲဝေမှု' : language === 'th' ? 'การเบิกจ่ายและส่วนแบ่งกำไร' : 'Payouts & Profit Distributions';
  const subText = language === 'mm' ? 'စိန်ခေါ်မှု အောင်မြင်ပြီးသော ကျောင်းသားများ၏ စာရင်းဇယားမှ ငွေထုတ်ယူမှုများကို ဤနေရာတွင် စီမံခန့်ခွဲနိုင်သည်။' : language === 'th' ? 'จัดการและโอนจ่ายส่วนแบ่งกำไรให้กับนักเรียนที่ผ่านการประเมินจำลอง' : 'Disburse earned payouts to funded traders who successfully navigated challenge target criteria.';
  const btnText = language === 'mm' ? 'ငွေထုတ်ပေးရန်' : language === 'th' ? 'ทำรายการเบิกจ่าย' : 'Disburse Payout';

  const totalPayoutSum = useMemo(() => {
    return payouts.reduce((sum, p) => sum + Number(p.amount), 0);
  }, [payouts]);

  return (
    <div className="space-y-6" id="payouts-panel">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">{titleText}</h1>
            <p className="text-slate-400 text-sm font-medium">{subText}</p>
          </div>

          {eligibleAccounts.length > 0 && (
            <button
              onClick={() => {
                setSelectedAccountId(eligibleAccounts[0].id);
                setShowModal(true);
              }}
              className="px-5 py-2.5 bg-bull hover:opacity-90 text-slate-950 rounded-xl text-xs font-black transition-all hover:scale-[1.01] flex items-center gap-1.5 active:scale-95 shadow-md shadow-cyan-500/10 self-start md:self-center cursor-pointer"
            >
              <Coins size={16} strokeWidth={2.5} />
              <span>{btnText}</span>
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Payout Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScrollReveal delay={0.1}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">Total Disbursed</span>
            <div className="text-2xl font-extrabold font-mono text-bull">
              ${totalPayoutSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-slate-500 text-xs font-medium">Total funded withdrawals finalized in DB.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">Eligible Accounts</span>
            <div className="text-2xl font-extrabold font-mono text-cyan-400">
              {eligibleAccounts.length} accounts
            </div>
            <p className="text-slate-500 text-xs font-medium">Accounts holding withdrawable profit thresholds.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">Avg Payout Check</span>
            <div className="text-2xl font-extrabold font-mono text-purple-400">
              ${payouts.length > 0 
                ? (totalPayoutSum / payouts.length).toLocaleString(undefined, { maximumFractionDigits: 0 })
                : '0'
              }
            </div>
            <p className="text-slate-500 text-xs font-medium">Average dollar amount per settlement check.</p>
          </div>
        </ScrollReveal>
      </div>

      {/* Table payouts */}
      <ScrollReveal delay={0.25}>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 font-sans">Historical Distributions Register</h3>
            <span className="px-2.5 py-1 text-[10px] font-mono rounded-lg bg-slate-950 text-slate-400 border border-slate-800 uppercase font-bold">
              Auditable Logs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Payout Transaction ID</th>
                  <th className="p-4">Account Number</th>
                  <th className="p-4">Prop Firm Package</th>
                  <th className="p-4">Amount Disbursed</th>
                  <th className="p-4">Payout Date</th>
                  <th className="p-4 text-right font-mono">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
                {payouts.map(pay => {
                  const acc = accountsMap.get(pay.account_id);
                  const rule = acc ? rulesMap.get(acc.rule_id) : null;

                  return (
                    <tr key={pay.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="p-4 font-mono text-slate-400 font-medium">
                        PAY-{pay.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        {acc?.account_number ?? 'Unknown'}
                      </td>
                      <td className="p-4 text-slate-400 font-medium">
                        {rule?.account_type ?? 'Evaluation'}
                      </td>
                      <td className="p-4 font-mono font-bold text-bull">
                        ${pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-slate-400 font-mono font-medium">
                        {pay.payout_date}
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-2.5 py-1 text-[10px] font-bold bg-bull-alpha text-bull border border-bull-alpha rounded-full">
                          Settled
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {payouts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 font-bold italic">
                      No payout distributions recorded yet. Passed accounts above starting size are eligible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

      {/* Disburse Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-bull">
              <Sparkles size={20} className="animate-pulse" />
              <h3 className="text-lg font-bold text-white">Issue Profit Distribution</h3>
            </div>
            
            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Source Account</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {eligibleAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_number} (Avail: ${(acc.current_balance - acc.initial_balance).toLocaleString()} P&L)
                    </option>
                  ))}
                </select>
              </div>

              {currentSelectedAccount && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Account Size:</span>
                    <span className="text-slate-200">${currentSelectedAccount.initial_balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Current Balance:</span>
                    <span className="text-slate-200">${currentSelectedAccount.current_balance.toLocaleString()}</span>
                  </div>
                  <hr className="border-slate-850" />
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Max Allowed Check:</span>
                    <span className="text-bull font-bold">${maxEligibleAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Request Amount ($)</label>
                <input
                  type="number"
                  required
                  min={100}
                  max={maxEligibleAmount}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-bear-alpha border border-bear-alpha text-bear rounded-xl text-xs flex items-center gap-2 font-bold">
                  <ShieldAlert size={14} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-bull hover:opacity-90 text-slate-950 rounded-lg text-sm font-black transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer"
                >
                  <DollarSign size={14} />
                  <span>Disburse Check</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
