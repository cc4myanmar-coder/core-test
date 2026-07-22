import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, RefreshCw, FileText } from 'lucide-react';
import { TradeLog, FutureInstrument, TradeAction, CsvPlatformFormat } from '../types';
import { Language, translations } from '../lib/translations';

interface CsvTradeLogUploaderProps {
  accountId: string;
  accountNumber: string;
  commissionPerContract: number;
  language: Language;
  onTradesUploaded: (trades: TradeLog[]) => void;
}

export const CsvTradeLogUploader: React.FC<CsvTradeLogUploaderProps> = ({
  accountId,
  accountNumber,
  commissionPerContract,
  language,
  onTradesUploaded
}) => {
  const isMm = language === 'mm';
  const [platformFormat, setPlatformFormat] = useState<CsvPlatformFormat>('generic');
  const [csvRawText, setCsvRawText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<TradeLog[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sample CSV generator for easy testing
  const handleLoadSampleCsv = () => {
    const sample = `Account,Symbol,Side,Quantity,EntryPrice,ExitPrice,GrossPnL,TradeTime
${accountNumber},NQ 09-26,BUY,2,19850.50,19875.25,990.00,2026-07-22 09:35:10
${accountNumber},MNQ 09-26,BUY,5,19860.00,19872.00,120.00,2026-07-22 10:15:22
${accountNumber},NQ 09-26,SELL,1,19880.00,19865.00,300.00,2026-07-22 11:05:40
${accountNumber},ES 09-26,BUY,1,5510.25,5502.00,-412.50,2026-07-22 13:20:15
${accountNumber},MNQ 09-26,SELL,10,19870.00,19890.00,-400.00,2026-07-22 14:45:00
${accountNumber},NQ 09-26,BUY,2,19865.00,19905.00,1600.00,2026-07-22 15:30:00`;
    
    setCsvRawText(sample);
    parseCsvContent(sample);
  };

  const parseCsvContent = (text: string) => {
    setParseError(null);
    setIsSuccess(false);

    try {
      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) {
        setParseError(isMm ? 'CSV ဖိုင်တွင် Trade ဒေတာလိုင်းအနည်းဆုံး ၁ လိုင်း ပါဝင်ရပါမည်' : 'CSV file must contain at least 1 trade row after header.');
        setParsedPreview([]);
        return;
      }

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      
      // Helper to find column index by potential names
      const findColIndex = (candidates: string[]) => {
        return headers.findIndex(h => candidates.some(c => h.includes(c)));
      };

      const symIdx = findColIndex(['symbol', 'instrument', 'contract', 'market']);
      const sideIdx = findColIndex(['side', 'action', 'b/s', 'type', 'buy/sell']);
      const qtyIdx = findColIndex(['quantity', 'qty', 'contracts', 'size', 'amount']);
      const entryIdx = findColIndex(['entryprice', 'entry', 'open', 'buyprice', 'price']);
      const exitIdx = findColIndex(['exitprice', 'exit', 'close', 'sellprice']);
      const pnlIdx = findColIndex(['grosspnl', 'realized p&l', 'realizedpnl', 'pnl', 'profit', 'netpnl', 'p&l']);
      const timeIdx = findColIndex(['time', 'date', 'timestamp', 'executiontime']);

      const parsed: TradeLog[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));

        // Extract Instrument
        let symbolRaw = symIdx >= 0 && cols[symIdx] ? cols[symIdx].toUpperCase() : 'NQ';
        let instrument: FutureInstrument = 'NQ';
        if (symbolRaw.includes('MNQ')) instrument = 'MNQ';
        else if (symbolRaw.includes('ES')) instrument = 'ES';
        else if (symbolRaw.includes('MES')) instrument = 'MES';
        else instrument = 'NQ';

        // Extract Action
        let sideRaw = sideIdx >= 0 && cols[sideIdx] ? cols[sideIdx].toUpperCase() : 'BUY';
        let action: TradeAction = sideRaw.includes('SELL') || sideRaw === 'S' || sideRaw === 'SHORT' ? 'SELL' : 'BUY';

        // Extract Contracts
        let qty = qtyIdx >= 0 && cols[qtyIdx] ? parseInt(cols[qtyIdx]) || 1 : 1;

        // Extract Prices
        let entry = entryIdx >= 0 && cols[entryIdx] ? parseFloat(cols[entryIdx]) || 19800 : 19800;
        let exit = exitIdx >= 0 && cols[exitIdx] ? parseFloat(cols[exitIdx]) || 19820 : 19820;

        // Extract Gross PnL
        let grossPnl = pnlIdx >= 0 && cols[pnlIdx] ? parseFloat(cols[pnlIdx].replace(/[\$\,]/g, '')) : 0;
        if (isNaN(grossPnl) || grossPnl === 0) {
          // Estimate PnL from price diff if PnL column missing
          const priceDiff = action === 'BUY' ? exit - entry : entry - exit;
          const pointVal = (instrument === 'NQ' ? 20 : instrument === 'MNQ' ? 2 : instrument === 'ES' ? 50 : 5);
          grossPnl = priceDiff * qty * pointVal;
        }

        // Net PnL = Gross PnL - (Commission per contract * contracts * 2 sides)
        const totalComm = (commissionPerContract || 1.5) * qty * 2;
        const netPnl = grossPnl - totalComm;

        // Extract Time
        let timeStr = timeIdx >= 0 && cols[timeIdx] ? cols[timeIdx] : new Date().toISOString();

        parsed.push({
          id: `csv-${Date.now()}-${i}`,
          account_id: accountId,
          instrument,
          action,
          contracts_traded: qty,
          open_price: entry,
          close_price: exit,
          gross_pnl: grossPnl,
          net_pnl: netPnl,
          trade_time: timeStr
        });
      }

      if (parsed.length === 0) {
        setParseError(isMm ? 'CSV ဒေတာ ဖတ်၍ မရပါ' : 'Could not extract valid trade logs from CSV.');
      } else {
        setParsedPreview(parsed);
      }
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse CSV file.');
      setParsedPreview([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      parseCsvContent(text);
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = () => {
    if (parsedPreview.length > 0) {
      onTradesUploaded(parsedPreview);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setParsedPreview([]);
        setCsvRawText('');
      }, 3000);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              {isMm ? 'Multi Prop Firm CSV Trade Logs Uploader' : 'Multi-Prop Firm CSV Trade Logs Import'}
            </h3>
            <p className="text-xs text-slate-400">
              NinjaTrader, Tradovate, Rithmic, Apex Trader Funding, Quantower format acceptance
            </p>
          </div>
        </div>

        <button
          onClick={handleLoadSampleCsv}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition-all border border-slate-700"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{isMm ? 'စမ်းသပ်ရန် Sample CSV ဖြည့်ပါ' : 'Load Sample CSV'}</span>
        </button>
      </div>

      {/* Selector & Drag/Drop Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="md:col-span-1 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            {isMm ? 'Prop Firm / Platform Format ရွေးပါ' : 'Select Platform CSV Format'}
          </label>
          <select
            value={platformFormat}
            onChange={(e) => setPlatformFormat(e.target.value as CsvPlatformFormat)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="generic">Auto-Detect / Generic CSV Format</option>
            <option value="ninja_trader">NinjaTrader 8 Trade Performance</option>
            <option value="tradovate">Tradovate Orders & Fills Export</option>
            <option value="rithmic">Rithmic R|Trader Pro Logs</option>
            <option value="apex">Apex Trader Funding Account Export</option>
            <option value="quantower">Quantower Executed Trades</option>
          </select>

          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Supported Headers:</p>
            <p>Symbol / Instrument, Action / Side, Quantity, OpenPrice, ClosePrice, GrossPnL, Time</p>
          </div>
        </div>

        {/* File Upload Drop Zone */}
        <div className="md:col-span-2">
          <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-950/50 hover:bg-slate-950/80 transition-all p-4 text-center">
            <Upload className="h-8 w-8 text-emerald-400 mb-2 animate-bounce" />
            <p className="text-xs font-bold text-slate-200">
              {isMm ? 'CSV ဖိုင်တင်ရန် ဤနေရာတွင် နှိပ်ပါ သို့မဟုတ် ဖိုင်ကို ဆွဲထည့်ပါ' : 'Click to browse or drag & drop CSV file here'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">.csv format supported (NinjaTrader, Tradovate, Rithmic, Apex)</p>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
        </div>

      </div>

      {/* Error Message if any */}
      {parseError && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Preview Table of Parsed Trades */}
      {parsedPreview.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>{isMm ? 'ဖတ်ရှုပြီးသော Trade မှတ်တမ်းများ Preview' : 'Parsed Trade Logs Preview'}</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                {parsedPreview.length} Trades
              </span>
            </h4>

            <div className="text-xs text-slate-400 flex items-center gap-3 font-mono">
              <span>Net PnL: <strong className={parsedPreview.reduce((sum, t) => sum + t.net_pnl, 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                ${parsedPreview.reduce((sum, t) => sum + t.net_pnl, 0).toLocaleString()}
              </strong></span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] font-mono">
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Instrument</th>
                  <th className="p-2.5">Side</th>
                  <th className="p-2.5 text-right">Contracts</th>
                  <th className="p-2.5 text-right">Open</th>
                  <th className="p-2.5 text-right">Close</th>
                  <th className="p-2.5 text-right">Gross PnL</th>
                  <th className="p-2.5 text-right">Net PnL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {parsedPreview.map((trade, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="p-2.5 text-[11px] text-slate-400">{trade.trade_time}</td>
                    <td className="p-2.5 font-bold text-slate-200">{trade.instrument}</td>
                    <td className="p-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${trade.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trade.action}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-bold">{trade.contracts_traded}</td>
                    <td className="p-2.5 text-right text-slate-400">{trade.open_price.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-slate-400">{trade.close_price.toFixed(2)}</td>
                    <td className={`p-2.5 text-right font-semibold ${trade.gross_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${trade.gross_pnl.toFixed(2)}
                    </td>
                    <td className={`p-2.5 text-right font-bold ${trade.net_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${trade.net_pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleConfirmUpload}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isMm ? 'Dashboard သို့ Data ထည့်သွင်းမည်' : 'Import Trade Logs To Dashboard'}</span>
            </button>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-semibold animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{isMm ? 'Trade Logs များ Dashboard သို့ အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ!' : 'Trade logs successfully imported into account metrics!'}</span>
        </div>
      )}

    </div>
  );
};

export default CsvTradeLogUploader;
