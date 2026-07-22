import React, { useState } from 'react';
import { Bot, Sparkles, AlertCircle, CheckCircle2, Award, TrendingUp, ShieldAlert, RefreshCw, Layers } from 'lucide-react';
import { StudentAccount, PropFirmRule, TradeLog, AIAnalysisResult } from '../types';
import { Language, translations } from '../lib/translations';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: StudentAccount;
  rule?: PropFirmRule;
  firmName?: string;
  trades: TradeLog[];
  language: Language;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  account,
  rule,
  firmName,
  trades,
  language
}) => {
  const isMm = language === 'mm';
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Compute metrics
  const winningTrades = trades.filter(t => t.net_pnl > 0);
  const winRate = trades.length > 0 ? ((winningTrades.length / trades.length) * 100).toFixed(1) : '0.0';
  const totalNetPnL = trades.reduce((sum, t) => sum + t.net_pnl, 0);
  const maxSingleTrade = trades.length > 0 ? Math.max(...trades.map(t => t.net_pnl)) : 0;

  const fetchAiAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountData: {
            account_number: account.account_number,
            firmName: firmName || 'Prop Firm',
            status: account.status,
            current_balance: account.current_balance,
            initial_balance: account.initial_balance,
            highest_balance: account.highest_balance,
            profit_target: rule?.profit_target,
            max_trailing_drawdown: rule?.max_trailing_drawdown,
            tradesCount: trades.length,
            winRate,
            netPnL: totalNetPnL,
            maxSingleTradeProfit: maxSingleTrade
          }
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Failed to generate AI analysis');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to Gemini AI analysis server');
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial fetch if analysis not generated
  if (!analysis && !loading && !error) {
    fetchAiAnalysis();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-900 border border-emerald-500/30 p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                {isMm ? 'Gemini AI Trader Status & Detail Analysis' : 'Gemini AI Account Deep Analysis'}
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Account: <span className="text-emerald-400 font-bold">{account.account_number}</span> | Firm: {firmName || 'Prop Firm'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
          >
            ✕ Close
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="mx-auto h-8 w-8 text-emerald-400 animate-spin" />
            <p className="text-xs text-slate-300 font-medium">
              {isMm ? 'Gemini AI က Trade Logs များနှင့် Risk Data များကို သုံးသပ်တွက်ချက်နေပါသည်...' : 'Gemini AI is analyzing trade execution, drawdown limits, and consistency parameters...'}
            </p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-400 space-y-2 text-center">
            <AlertCircle className="mx-auto h-6 w-6" />
            <p>{error}</p>
            <button
              onClick={fetchAiAnalysis}
              className="mt-2 rounded-lg bg-rose-600 px-3 py-1 text-xs text-white"
            >
              Retry AI Analysis
            </button>
          </div>
        ) : analysis ? (
          <div className="space-y-5">
            
            {/* Top Score Grade Card */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-slate-950 border border-emerald-500/20 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20">
                  {analysis.grade}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{isMm ? 'Trader စွမ်းဆောင်ရည် အဆင့်' : 'Trader Performance Grade'}</h4>
                  <p className="text-xs text-slate-400">{analysis.statusSummary}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-right text-xs font-mono border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                <div>
                  <span className="text-slate-500 block text-[10px]">WIN RATE</span>
                  <span className="text-emerald-400 font-bold">{analysis.keyMetrics.winRate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PROFIT FACTOR</span>
                  <span className="text-amber-400 font-bold">{analysis.keyMetrics.profitFactor}</span>
                </div>
              </div>
            </div>

            {/* Risk & Consistency Analysis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <ShieldAlert className="h-4 w-4" />
                  <span>{isMm ? 'Risk & Drawdown Evaluation' : 'Risk & Drawdown Proximity'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{analysis.riskAssessment}</p>
              </div>

              <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <TrendingUp className="h-4 w-4" />
                  <span>{isMm ? 'Consistency Rule Compliance' : 'Consistency Rule Evaluation'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{analysis.consistencyAnalysis}</p>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
              <h5 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{isMm ? 'AI ၏ အကြံပြုချက်များ (AI Recommendations)' : 'AI Strategic Recommendations'}</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-500 font-mono">
          <span>MODEL: GEMINI-2.5-FLASH</span>
          <button
            onClick={fetchAiAnalysis}
            disabled={loading}
            className="text-emerald-400 hover:text-emerald-300 font-sans font-semibold flex items-center gap-1"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{isMm ? 'ပြန်လည် သုံးသပ်မည် (Re-analyze)' : 'Refresh AI Analysis'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AiAnalysisModal;
