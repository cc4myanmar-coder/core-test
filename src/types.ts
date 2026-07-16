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
  account_type: string; // e.g., 'Evaluation', 'Funded', 'Express'
  profit_target: number;
  max_trailing_drawdown: number;
  daily_loss_limit: number;
  max_contracts_allowed: number;
  commission_per_contract: number; // e.g., $1.50 per contract per side ($3.00 round trip)
  consistency_percentage: number; // e.g., 30% max profit in a single trade/day
}

export type AccountStatus =
  | 'Active'
  | 'Passed'
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
  is_editable: boolean;
  // Temporary initial balance helper
  initial_balance: number;
  highest_balance: number; // Tracked for Trailing Drawdown
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
  trade_time: string; // ISO string
}

export interface Payout {
  id: string;
  account_id: string;
  amount: number;
  payout_date: string; // ISO string or YYYY-MM-DD
}

export interface ColorTheme {
  id: string;
  name: string;
  nameMm: string;
  nameTh: string;
  bullColor: string; // Hex color for charts
  bearColor: string; // Hex color for charts
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

