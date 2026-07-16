import { Profile, PropFirm, PropFirmRule, StudentAccount, TradeLog, Payout } from './types';

export const mockProfiles: Profile[] = [
  {
    id: 'p-1',
    email: 'admin@propfirm.com',
    role: 'admin',
    full_name: 'Sarah Connor (Head Risk Officer)'
  },
  {
    id: 'p-2',
    email: 'student@propfirm.com',
    role: 'student',
    full_name: 'Alex Mercer (Futures Trader)'
  }
];

export const mockPropFirms: PropFirm[] = [
  {
    id: 'firm-1',
    name: 'Topstep Futures',
    logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    id: 'firm-2',
    name: 'Apex Trader Funding',
    logo_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    id: 'firm-3',
    name: 'MyFundedFutures',
    logo_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=120&h=120&q=80'
  }
];

export const mockPropFirmRules: PropFirmRule[] = [
  {
    id: 'rule-1',
    prop_firm_id: 'firm-1',
    account_size: 50000,
    account_type: 'Evaluation (50K)',
    profit_target: 3000,
    max_trailing_drawdown: 2000,
    daily_loss_limit: 1000,
    max_contracts_allowed: 5,
    commission_per_contract: 1.5, // per side, i.e., $3.00 round trip
    consistency_percentage: 40 // No single day > 40% of target
  },
  {
    id: 'rule-2',
    prop_firm_id: 'firm-1',
    account_size: 150000,
    account_type: 'Evaluation (150K)',
    profit_target: 9000,
    max_trailing_drawdown: 4500,
    daily_loss_limit: 3000,
    max_contracts_allowed: 15,
    commission_per_contract: 1.5,
    consistency_percentage: 40
  },
  {
    id: 'rule-3',
    prop_firm_id: 'firm-2',
    account_size: 50000,
    account_type: 'Apex 50K Full',
    profit_target: 3000,
    max_trailing_drawdown: 2500,
    daily_loss_limit: 1250,
    max_contracts_allowed: 10,
    commission_per_contract: 1.25,
    consistency_percentage: 30
  },
  {
    id: 'rule-4',
    prop_firm_id: 'firm-3',
    account_size: 100000,
    account_type: 'MFF 100K Starter',
    profit_target: 6000,
    max_trailing_drawdown: 3000,
    daily_loss_limit: 2000,
    max_contracts_allowed: 12,
    commission_per_contract: 1.4,
    consistency_percentage: 35
  }
];

export const mockStudentAccounts: StudentAccount[] = [
  {
    id: 'acc-1',
    profile_id: 'p-2', // Alex Mercer
    rule_id: 'rule-1', // Topstep 50K
    account_number: 'TS-50K-8809',
    current_balance: 51850,
    status: 'Active',
    is_editable: true,
    initial_balance: 50000,
    highest_balance: 51850
  },
  {
    id: 'acc-2',
    profile_id: 'p-2', // Alex Mercer
    rule_id: 'rule-3', // Apex 50k
    account_number: 'APEX-50K-1224',
    current_balance: 53120,
    status: 'Passed',
    certificate_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&h=400&q=80',
    is_editable: false,
    initial_balance: 50000,
    highest_balance: 53120
  },
  {
    id: 'acc-3',
    profile_id: 'p-2', // Alex Mercer
    rule_id: 'rule-2', // Topstep 150K
    account_number: 'TS-150K-4001',
    current_balance: 146100,
    status: 'Failed_at_Challenge',
    is_editable: true,
    initial_balance: 150000,
    highest_balance: 151500
  },
  {
    id: 'acc-4',
    profile_id: 'p-2',
    rule_id: 'rule-4', // MFF 100K
    account_number: 'MFF-100K-3392',
    current_balance: 104200,
    status: 'Active',
    is_editable: true,
    initial_balance: 100000,
    highest_balance: 104500
  }
];

export const mockTradeLogs: TradeLog[] = [
  // For acc-1 (TS-50K-8809) - Active, currently at $51,850
  {
    id: 'trade-1',
    account_id: 'acc-1',
    instrument: 'NQ',
    action: 'BUY',
    contracts_traded: 2,
    open_price: 18250.00,
    close_price: 18285.50, // +35.5 pts * $20 * 2 contracts = +$1420 gross
    gross_pnl: 1420,
    net_pnl: 1414, // minus $6.00 round trip commission (2 contracts * $1.50 per side * 2 sides = $6.00)
    trade_time: '2026-07-15T10:15:00Z'
  },
  {
    id: 'trade-2',
    account_id: 'acc-1',
    instrument: 'ES',
    action: 'SELL',
    contracts_traded: 3,
    open_price: 5120.00,
    close_price: 5117.00, // +3.0 pts * $50 * 3 contracts = +$450 gross
    gross_pnl: 450,
    net_pnl: 441, // minus $9.00 commission
    trade_time: '2026-07-15T14:30:00Z'
  },
  {
    id: 'trade-3',
    account_id: 'acc-1',
    instrument: 'MNQ',
    action: 'BUY',
    contracts_traded: 5,
    open_price: 18310.00,
    close_price: 18308.00, // -2.0 pts * $2 * 5 contracts = -$20 gross
    gross_pnl: -20,
    net_pnl: -35, // minus $15.00 commission
    trade_time: '2026-07-16T09:00:00Z'
  },

  // For acc-2 (APEX-50K-1224) - Passed, at $53,120
  {
    id: 'trade-4',
    account_id: 'acc-2',
    instrument: 'NQ',
    action: 'BUY',
    contracts_traded: 4,
    open_price: 18100.00,
    close_price: 18140.00, // +40 pts * $20 * 4 = +$3200 gross
    gross_pnl: 3200,
    net_pnl: 3180, // Apex commission $1.25 * 4 * 2 = $10.00
    trade_time: '2026-07-10T11:00:00Z'
  },

  // For acc-3 (TS-150K-4001) - Failed, drawdown hit
  {
    id: 'trade-5',
    account_id: 'acc-3',
    instrument: 'NQ',
    action: 'BUY',
    contracts_traded: 8,
    open_price: 18400.00,
    close_price: 18370.00, // -30 pts * $20 * 8 = -$4800 gross
    gross_pnl: -4800,
    net_pnl: -4848, // minus commission
    trade_time: '2026-07-12T15:20:00Z'
  }
];

export const mockPayouts: Payout[] = [
  {
    id: 'payout-1',
    account_id: 'acc-2', // APEX-50K-1224
    amount: 1500,
    payout_date: '2026-07-14'
  }
];
