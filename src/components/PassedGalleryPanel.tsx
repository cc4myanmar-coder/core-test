import React, { useState } from 'react';
import { Award, Trophy, Upload, Search, CheckCircle2, ShieldCheck, Download, ExternalLink, Calendar, DollarSign, Image as ImageIcon } from 'lucide-react';
import { StudentAccount, PropFirm, CertificateItem } from '../types';
import { Language, translations } from '../lib/translations';

interface PassedGalleryPanelProps {
  accounts: StudentAccount[];
  firms: PropFirm[];
  language: Language;
  onUploadCertificate?: (accountId: string, certUrl: string) => void;
}

export const PassedGalleryPanel: React.FC<PassedGalleryPanelProps> = ({
  accounts,
  firms,
  language,
  onUploadCertificate
}) => {
  const t = translations[language] || translations.en;
  const isMm = language === 'mm';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFirm, setSelectedFirm] = useState<string>('all');
  const [uploadAccountId, setUploadAccountId] = useState<string>('');
  const [certInputUrl, setCertInputUrl] = useState<string>('');
  const [activeCert, setActiveCert] = useState<StudentAccount | null>(null);

  // Filter passed accounts
  const passedAccounts = accounts.filter(acc => acc.status === 'Passed' || acc.certificate_url);

  const filteredAccounts = passedAccounts.filter(acc => {
    const matchesSearch = acc.account_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadAccountId && certInputUrl && onUploadCertificate) {
      onUploadCertificate(uploadAccountId, certInputUrl);
      setUploadAccountId('');
      setCertInputUrl('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-slate-900 border border-amber-500/20 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <Trophy className="h-4 w-4" />
              <span>{isMm ? 'ထူးချွန်အောင်မြင်သူများ ဂုဏ်ပြုခန်းမ' : 'Passed Evaluation Hall of Fame'}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              {isMm ? 'အောင်မြင်ပြီးမြောက်မှု လက်မှတ်များနှင့် မှတ်တမ်းများ' : 'Passed Certificates & Evaluation Achievements'}
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              {isMm 
                ? 'Challenge အဆင့်ကျော်ဖြတ်ပြီး Funded Account သို့ ကူးပြောင်းနိုင်ခဲ့သော ကျောင်းသားများ၏ တရားဝင် Certificate များနှင့် အောင်မြင်မှုမှတ်တမ်းများ'
                : 'Verified records and official certificates of traders who successfully passed their evaluation challenges and unlocked live Funded Accounts.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-center px-4">
              <span className="block text-2xl font-black text-amber-400">{passedAccounts.length}</span>
              <span className="text-xs text-slate-400 font-medium">{isMm ? 'အောင်မြင်ပြီးသူ' : 'Total Passed'}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-4">
              <span className="block text-2xl font-black text-emerald-400">100%</span>
              <span className="text-xs text-slate-400 font-medium">{isMm ? 'စစ်ဆေးပြီး' : 'Verified'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Certificate Widget & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Certificate Upload Card */}
        <div className="lg:col-span-1 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Upload className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-slate-200 text-sm">
              {isMm ? 'Certificate Upload ပြုလုပ်ရန်' : 'Upload Passed Certificate'}
            </h3>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                {isMm ? 'အကောင့် ရွေးချယ်ပါ' : 'Select Account'}
              </label>
              <select
                value={uploadAccountId}
                onChange={(e) => setUploadAccountId(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                required
              >
                <option value="">{isMm ? '-- အကောင့် ရွေးပါ --' : '-- Select Passed Account --'}</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_number} ({acc.status}) - ${acc.current_balance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                {isMm ? 'Certificate ပုံ/URL Link' : 'Certificate Image URL'}
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="url"
                  placeholder="https://example.com/certificate.jpg"
                  value={certInputUrl}
                  onChange={(e) => setCertInputUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isMm ? 'Prop Firm က ထုတ်ပေးထားသော Certificate ပုံ Direct Link ထည့်ပါ' : 'Paste official certificate image URL provided by Prop Firm'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Award className="h-4 w-4" />
              <span>{isMm ? 'Certificate တင်မည်' : 'Save Certificate'}</span>
            </button>
          </form>
        </div>

        {/* Gallery Grid Section */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder={isMm ? 'အကောင့်နံပါတ်ဖြင့် ရှာရန်...' : 'Search by account number...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Certificates Grid */}
          {filteredAccounts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center">
              <Award className="mx-auto h-12 w-12 text-slate-600 mb-3" />
              <h4 className="font-semibold text-slate-300 text-sm">
                {isMm ? 'Passed Certificate များ မရှိသေးပါ' : 'No Passed Certificates Yet'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {isMm ? 'Challenge အောင်မြင်သော အကောင့်များ၏ Certificate များကို ဤနေရာတွင် တွေ့မြင်ရမည်ဖြစ်ပါသည်။' : 'Once student evaluation accounts hit target, certificates will appear in this showcase gallery.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 p-5 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                          {acc.account_number}
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {isMm ? 'Passed Challenge Account' : 'Passed Evaluation Account'}
                        </span>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/20">
                      PASSED
                    </span>
                  </div>

                  {/* Certificate preview frame */}
                  <div 
                    onClick={() => setActiveCert(acc)}
                    className="cursor-pointer relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-950 border border-slate-800 group-hover:border-amber-500/30 transition-all flex items-center justify-center"
                  >
                    {acc.certificate_url ? (
                      <img
                        src={acc.certificate_url}
                        alt={`Certificate for ${acc.account_number}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback placeholder if image fails to load
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}

                    {/* Default generated certificate visual placeholder if image missing or loading */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-4 flex flex-col justify-between border border-amber-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-amber-400 tracking-wider">CORE MENTORSHIP PROGRAM</span>
                        <ShieldCheck className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="text-center my-auto">
                        <h5 className="font-extrabold text-amber-200 text-sm tracking-wide">CERTIFICATE OF ACHIEVEMENT</h5>
                        <p className="text-[11px] text-slate-300 mt-0.5">Prop Firm Futures Evaluation Passed</p>
                        <p className="text-[10px] font-mono text-emerald-400 mt-1 font-bold">ACCOUNT: {acc.account_number}</p>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                        <span>VAL: VERIFIED</span>
                        <span>DATE: {acc.passed_date || '2026-07-22'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-3 text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      ${acc.current_balance.toLocaleString()}
                    </span>
                    <button
                      onClick={() => setActiveCert(acc)}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors text-[11px]"
                    >
                      <span>{isMm ? 'အသေးစိတ် ကြည့်မည်' : 'View Full Certificate'}</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Certificate Lightbox Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-amber-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-slate-100 text-base">
                  {isMm ? 'တရားဝင် အောင်မြင်မှု လက်မှတ်' : 'Official Verification Certificate'}
                </h3>
              </div>
              <button
                onClick={() => setActiveCert(null)}
                className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700"
              >
                ✕ Close
              </button>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-950 border border-amber-500/20 p-8 flex flex-col justify-between shadow-inner">
              {activeCert.certificate_url ? (
                <img
                  src={activeCert.certificate_url}
                  alt="Full Certificate"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="h-full w-full flex flex-col justify-between text-center">
                  <div className="flex justify-between items-center text-xs font-mono text-amber-400">
                    <span>CORE MENTORSHIP PROGRAM</span>
                    <span>VERIFIED SUCCESS</span>
                  </div>
                  <div className="my-auto space-y-2">
                    <Award className="mx-auto h-16 w-16 text-amber-400 animate-bounce" />
                    <h2 className="text-2xl font-black text-amber-100 tracking-wider">CERTIFICATE OF EVALUATION PASS</h2>
                    <p className="text-sm text-slate-300">This certifies that trader with Account <span className="font-mono text-emerald-400 font-bold">{activeCert.account_number}</span> has met all risk parameters & profit targets.</p>
                    <p className="text-xs text-emerald-400 font-semibold">Funded Account Unlocked: ${activeCert.current_balance.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500 border-t border-slate-800 pt-2">
                    <span>STATUS: ACTIVE FUNDED</span>
                    <span>ISSUED: {activeCert.passed_date || '2026-07-22'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveCert(null)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                {isMm ? 'ပိတ်မည်' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PassedGalleryPanel;
