export type UserRole = 'admin' | 'student';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
}

export interface PropFirm {
  id: string;
  name: string;
  logo_url?: string;
}

export interface PropFirmRule {
  id: string;
  prop_firm_id: string;
  account_size: number;
  account_type: string; // e.g., 'Evaluation', 'Funded', 'Express', 'Payout'
  profit_target: number;
  max_trailing_drawdown: number;
  daily_loss_limit: number;
  max_contracts_allowed: number;
  commission_per_contract: number; // e.g., $1.50 per contract per side ($3.00 round trip)
  consistency_percentage: number; // e.g., 30% or 40% max profit in a single trade/day
  payout_buffer_amount?: number; // e.g. $2,600 buffer required before payout
  min_trading_days?: number;
}

export type AccountStatus =
  | 'Challenge'
  | 'Active'
  | 'Passed'
  | 'Funded'
  | 'Payout_Active'
  | 'Failed_at_Challenge'
  | 'Failed_at_Funded'
  | 'Failed_at_Payout';

export interface StudentAccount {
  id: string;
  profile_id: string;
  rule_id: string;
  account_number: string;
  current_balance: number;
  status: AccountStatus;
  certificate_url?: string;
  passed_date?: string;
  is_editable: boolean; // Once failed, editable becomes false
  initial_balance: number;
  highest_balance: number; // Tracked for Trailing Drawdown
  payout_count?: number; // Number of payouts disbursed
  total_payout_amount?: number; // Total $ paid out
  payout_buffer?: number; // Minimum buffer required above initial balance
  failure_reason?: string;
}

export type FutureInstrument = 'NQ' | 'MNQ' | 'ES' | 'MES';
export type TradeAction = 'BUY' | 'SELL';

export interface TradeLog {
  id: string;
  account_id: string;
  instrument: FutureInstrument;
  action: TradeAction;
  contracts_traded: number;
  open_price: number;
  close_price: number;
  gross_pnl: number;
  net_pnl: number;
  trade_time: string; // ISO string or YYYY-MM-DD HH:mm
}

export interface Payout {
  id: string;
  account_id: string;
  amount: number;
  payout_date: string; // ISO string or YYYY-MM-DD
  status: 'Completed' | 'Pending' | 'Rejected';
  notes?: string;
}

export interface CertificateItem {
  id: string;
  account_id: string;
  student_name: string;
  prop_firm_name: string;
  account_number: string;
  certificate_url: string;
  passed_date: string;
  profit_earned: number;
  account_size: number;
}

export type CsvPlatformFormat = 'ninja_trader' | 'tradovate' | 'rithmic' | 'apex' | 'quantower' | 'generic';

export interface AIAnalysisResult {
  statusSummary: string;
  riskAssessment: string;
  consistencyAnalysis: string;
  recommendations: string[];
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  keyMetrics: {
    winRate: string;
    profitFactor: string;
    drawdownProximity: string;
    maxSingleDayProfitShare: string;
  };
}

export interface ColorTheme {
  id: string;
  name: string;
  nameMm: string;
  nameTh: string;
  bullColor: string;
  bearColor: string;
  bullText: string;
  bullBg: string;
  bullBorder: string;
  bullFill: string;
  bullHover: string;
  bullDot: string;
  bearText: string;
  bearBg: string;
  bearBorder: string;
  bearFill: string;
  bearHover: string;
  bearDot: string;
}


