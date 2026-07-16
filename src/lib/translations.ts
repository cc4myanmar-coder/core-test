export type Language = 'en' | 'mm' | 'th';

export interface TranslationDict {
  brandName: string;
  brandTagline: string;
  loginTitle: string;
  loginSub: string;
  emailLabel: string;
  passwordLabel: string;
  signInBtn: string;
  importantNoticeTitle: string;
  importantNoticeText: string;
  resetNoticeTitle: string;
  resetNoticeText: string;
  resetSuccessTitle: string;
  resetSuccessText: string;
  resetConfirmBtn: string;
  backToLoginBtn: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  switchSandboxRole: string;
  activeSession: string;
  headRisk: string;
  traderStudent: string;
  signOutBtn: string;
  navOverview: string;
  navTradingDesk: string;
  navPropFirms: string;
  navAccounts: string;
  navPayouts: string;
  navSqlSandbox: string;
  dashboardTitle: string;
  dashboardSub: string;
  launchSimDesk: string;
  totalAccounts: string;
  activeEvaluations: string;
  passedEvaluations: string;
  failedEvaluations: string;
  cumulativePnl: string;
  cumulativePnlSub: string;
  recentTrades: string;
  recentTradesSub: string;
  lastSync: string;
  riskCompliance: string;
  consistencyRule: string;
  maxContracts: string;
  newsTrading: string;
  dailyPL: string;
  requestPayout: string;
  currentBalance: string;
  accountEquity: string;
  profitTarget: string;
  reached: string;
  commissionTotal: string;
  grossPnl: string;
  consistencyPercent: string;
  accountStatus: string;
  qualified: string;
  orderEntryBlock: string;
  instrumentLabel: string;
  qtyLabel: string;
  actionLabel: string;
  executeTrade: string;
  searchPlaceholder: string;
  createAccount: string;
  createRuleSet: string;
  disbursePayout: string;
  eligibleAccounts: string;
  disburseCheck: string;
  sqlTitle: string;
  sqlExecBtn: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    brandName: "CORE Mentorship",
    brandTagline: "Prop Trading & Evaluation Desk",
    loginTitle: "Access CORE Mentorship Portal",
    loginSub: "Log in to your professional evaluation dashboard",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    signInBtn: "Sign In",
    importantNoticeTitle: "IMPORTANT SECURITY NOTICE",
    importantNoticeText: "If you forget your password, you cannot reset it yourself. Please contact your CORE Instructor (Admin) directly to request a Reset Link.",
    resetNoticeTitle: "Define New Security Password",
    resetNoticeText: "No old password required. Input your new secure password twice below.",
    resetSuccessTitle: "Password Updated Successfully",
    resetSuccessText: "Your secure password has been modified. You can now use it to log in.",
    resetConfirmBtn: "Confirm New Password",
    backToLoginBtn: "Return to Login Page",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm New Password",
    switchSandboxRole: "Switch Workspace Role",
    activeSession: "Active Auth Session",
    headRisk: "Head Risk",
    traderStudent: "Trader Student",
    signOutBtn: "Sign Out",
    navOverview: "Overview Dashboard",
    navTradingDesk: "Sim Trading Desk",
    navPropFirms: "Prop Firm Rules",
    navAccounts: "Manage Accounts",
    navPayouts: "Disburse Payouts",
    navSqlSandbox: "SQL Database Sandbox",
    dashboardTitle: "CORE Mentorship Program",
    dashboardSub: "Real-time evaluation analytics and simulated risk dashboard",
    launchSimDesk: "Launch Sim Desk",
    totalAccounts: "Total Accounts",
    activeEvaluations: "Active",
    passedEvaluations: "Passed",
    failedEvaluations: "Failed",
    cumulativePnl: "Cumulative Sim P&L Performance",
    cumulativePnlSub: "Simulated equity curve compiled across all trade logs.",
    recentTrades: "Recent Trade Logs",
    recentTradesSub: "Real-time logs from simulated brokerage.",
    lastSync: "Last Sync",
    riskCompliance: "Risk Compliance Metrics",
    consistencyRule: "Consistency Rule (30% Max Day)",
    maxContracts: "Max Contracts Allowed",
    newsTrading: "News Trading Permitted: YES",
    dailyPL: "Daily P&L",
    requestPayout: "Request Payout",
    currentBalance: "Current Balance",
    accountEquity: "Account Equity",
    profitTarget: "Profit Target",
    reached: "reached",
    commissionTotal: "Commission Total",
    grossPnl: "Gross P&L",
    consistencyPercent: "Consistency %",
    accountStatus: "Account Status",
    qualified: "QUALIFIED",
    orderEntryBlock: "Order Entry Block",
    instrumentLabel: "Instrument",
    qtyLabel: "Quantity",
    actionLabel: "Action",
    executeTrade: "Execute Simulated Trade",
    searchPlaceholder: "Search records...",
    createAccount: "Create Account",
    createRuleSet: "Create Rule Set",
    disbursePayout: "Disburse Payout",
    eligibleAccounts: "Eligible Accounts",
    disburseCheck: "Disburse Check",
    sqlTitle: "SQL Database Control Console",
    sqlExecBtn: "Run Statement"
  },
  mm: {
    brandName: "CORE Mentorship",
    brandTagline: "Prop Trading နှင့် စစ်ဆေးမှုဌာန",
    loginTitle: "CORE Mentorship Portal သို့ ဝင်ရောက်ပါ",
    loginSub: "သင်တန်းသားများအတွက် စစ်ဆေးမှု ဒက်ရှ်ဘုတ်သို့ ဝင်ရောက်ပါ",
    emailLabel: "အီးမေးလ် လိပ်စာ",
    passwordLabel: "စကားဝှက် (Password)",
    signInBtn: "လော့ဂ်အင် ဝင်မည်",
    importantNoticeTitle: "အရေးကြီး သတိပေးချက်",
    importantNoticeText: "Password မေ့သွားပါက ကျောင်းသားမိမိဘာသာ Reset လုပ်၍မရပါ၊ သင်တန်း Instructor (Admin) ထံသို့ တိုက်ရိုက်ဆက်သွယ်၍ Reset Link တောင်းခံပါ။",
    resetNoticeTitle: "စကားဝှက်အသစ် သတ်မှတ်ရန်",
    resetNoticeText: "စကားဝှက်ဟောင်း ထည့်သွင်းရန် မလိုပါ။ စကားဝှက်အသစ်ကို အောက်ပါကွက်လပ်တွင် နှစ်ကြိမ်တူညီစွာ ရိုက်နှိပ်ပြီး အသစ်ပြင်ဆင်နိုင်ပါသည်။",
    resetSuccessTitle: "စကားဝှက် အသစ်ပြင်ဆင်ပြီးပါပြီ",
    resetSuccessText: "သင်၏ စကားဝှက်အသစ်ကို အောင်မြင်စွာ ပြောင်းလဲသတ်မှတ်ပြီး ဖြစ်ပါသည်။ ယခု စကားဝှက်အသစ်ဖြင့် ပြန်လည်ဝင်ရောက်နိုင်ပါပြီ။",
    resetConfirmBtn: "စကားဝှက်အသစ် အတည်ပြုမည်",
    backToLoginBtn: "ဝင်ရောက်ရန်စာမျက်နှာသို့ ပြန်သွားမည်",
    newPasswordLabel: "စကားဝှက်အသစ်",
    confirmPasswordLabel: "စကားဝှက်အတည်ပြုခြင်း",
    switchSandboxRole: "အသုံးပြုသူအမျိုးအစား ပြောင်းလဲရန်",
    activeSession: "လက်ရှိအသုံးပြုသူအကောင့်",
    headRisk: "ကြီးကြပ်သူ (Admin)",
    traderStudent: "ကျောင်းသား (Student)",
    signOutBtn: "လော့ဂ်ထွက်ရန်",
    navOverview: "ပင်မ ဒက်ရှ်ဘုတ်",
    navTradingDesk: "အရောင်းအဝယ် စမ်းသပ်ခန်း",
    navPropFirms: "စည်းမျဉ်း သတ်မှတ်ချက်များ",
    navAccounts: "အကောင့်များ စီမံရန်",
    navPayouts: "ထုတ်ယူငွေများ စီမံရန်",
    navSqlSandbox: "SQL Database ထိန်းချုပ်ခန်း",
    dashboardTitle: "CORE Mentorship သင်တန်းအစီအစဉ်",
    dashboardSub: "တိုက်ရိုက်စစ်ဆေးမှု စာရင်းဇယားများနှင့် ဘေးအန္တရာယ်စီမံခန့်ခွဲမှုစနစ်",
    launchSimDesk: "အရောင်းအဝယ် စမ်းသပ်ခန်းသို့ သွားပါ",
    totalAccounts: "စုစုပေါင်းအကောင့်များ",
    activeEvaluations: "အသုံးပြုဆဲ",
    passedEvaluations: "အောင်မြင်ပြီး",
    failedEvaluations: "မအောင်မြင်ပါ",
    cumulativePnl: "စုစုပေါင်း အကျိုးအမြတ်ရလဒ်ပြ ကာဗ်",
    cumulativePnlSub: "အရောင်းအဝယ်မှတ်တမ်းအားလုံးမှ စုစည်းတင်ပြထားသော အမြတ်အစွန်းပြဇယား။",
    recentTrades: "လတ်တလော အရောင်းအဝယ် မှတ်တမ်းများ",
    recentTradesSub: "အရောင်းအဝယ်စမ်းသပ်ခန်းမှ တိုက်ရိုက်မှတ်တမ်းများ။",
    lastSync: "နောက်ဆုံး စင့်ခ်လုပ်ချိန်",
    riskCompliance: "ဘေးအန္တရာယ် စောင့်ကြည့်မှု ညွှန်းကိန်းများ",
    consistencyRule: "စည်းမျဉ်းညီညွတ်မှု စစ်ဆေးခြင်း (တစ်ရက် အများဆုံး ၃၀%)",
    maxContracts: "အများဆုံး အရောင်းအဝယ်ပမာဏ (ကန်ထရိုက်စောင်ရေ)",
    newsTrading: "သတင်းထုတ်ပြန်ချိန် အရောင်းအဝယ်ပြုလုပ်ခွင့်- ရရှိသည်",
    dailyPL: "ယနေ့ အသားတင် အမြတ်/အရှုံး",
    requestPayout: "ငွေထုတ်ယူခွင့် တောင်းခံရန်",
    currentBalance: "လက်ရှိ လက်ကျန်ငွေ",
    accountEquity: "အကောင့် အမှန်တကယ်တန်ဖိုး",
    profitTarget: "ရည်မှန်းထားသော အမြတ်ပမာဏ",
    reached: "အောင်မြင်မှု ရာခိုင်နှုန်း",
    commissionTotal: "စုစုပေါင်း ကော်မရှင်ခ",
    grossPnl: "စုစုပေါင်း အသားတင် အမြတ်/အရှုံး",
    consistencyPercent: "ညီညွတ်မှု ရာခိုင်နှုန်း %",
    accountStatus: "အကောင့်အခြေအနေ",
    qualified: "အရည်အချင်းပြည့်မီသည်",
    orderEntryBlock: "အော်ဒါမှာယူမှုအပိုင်း",
    instrumentLabel: "အမျိုးအစား",
    qtyLabel: "အရေအတွက်",
    actionLabel: "အရောင်း/အဝယ်",
    executeTrade: "အရောင်းအဝယ် စတင်စမ်းသပ်မည်",
    searchPlaceholder: "ရှာဖွေရန်...",
    createAccount: "အကောင့်အသစ် ဖွင့်မည်",
    createRuleSet: "စည်းမျဉ်းအသစ် သတ်မှတ်မည်",
    disbursePayout: "ငွေထုတ်ပေးရန် အတည်ပြုမည်",
    eligibleAccounts: "ငွေထုတ်ယူနိုင်သော အကောင့်များ",
    disburseCheck: "ငွေထုတ်ပေးရန် စစ်ဆေးမည်",
    sqlTitle: "SQL Database တိုက်ရိုက် ထိန်းချုပ်ခန်း",
    sqlExecBtn: "ကုဒ်ကို ပတ်မည်"
  },
  th: {
    brandName: "CORE Mentorship",
    brandTagline: "โต๊ะซื้อขายและการประเมินอย่างมืออาชีพ",
    loginTitle: "เข้าสู่พอร์ทัล CORE Mentorship",
    loginSub: "เข้าสู่ระบบแดชบอร์ดการประเมินของคุณ",
    emailLabel: "ที่อยู่อีเมล",
    passwordLabel: "รหัสผ่าน",
    signInBtn: "เข้าสู่ระบบ",
    importantNoticeTitle: "ประกาศความปลอดภัยที่สำคัญ",
    importantNoticeText: "หากคุณลืมรหัสผ่าน คุณจะไม่สามารถรีเซ็ตได้ด้วยตนเอง โปรดติดต่อผู้สอน CORE Instructor (Admin) ของคุณโดยตรงเพื่อขอลิงก์รีเซ็ต",
    resetNoticeTitle: "กำหนดรหัสผ่านใหม่",
    resetNoticeText: "ไม่จำเป็นต้องใช้รหัสผ่านเดิม ป้อนรหัสผ่านใหม่ของคุณสองครั้งด้านล่างเพื่อยืนยัน",
    resetSuccessTitle: "อัปเดตรหัสผ่านสำเร็จ",
    resetSuccessText: "เปลี่ยนรหัสผ่านของคุณเรียบร้อยแล้ว คุณสามารถใช้รหัสผ่านใหม่นี้เพื่อเข้าสู่ระบบได้ทันที",
    resetConfirmBtn: "ยืนยันรหัสผ่านใหม่",
    backToLoginBtn: "กลับสู่หน้าเข้าสู่ระบบ",
    newPasswordLabel: "รหัสผ่านใหม่",
    confirmPasswordLabel: "ยืนยันรหัสผ่านใหม่",
    switchSandboxRole: "สลับบทบาทในระบบ",
    activeSession: "เซสชันที่ใช้งานอยู่",
    headRisk: "ผู้ดูแลความเสี่ยง (Admin)",
    traderStudent: "นักเรียนผู้ค้า (Student)",
    signOutBtn: "ออกจากระบบ",
    navOverview: "แดชบอร์ดภาพรวม",
    navTradingDesk: "โต๊ะซื้อขายจำลอง",
    navPropFirms: "กฎข้อบังคับกองทุน",
    navAccounts: "จัดการบัญชี",
    navPayouts: "จัดการการเบิกเงิน",
    navSqlSandbox: "แซนด์บอกซ์ฐานข้อมูล SQL",
    dashboardTitle: "โปรแกรมการให้คำปรึกษา CORE",
    dashboardSub: "แดชบอร์ดสถิติและการประเมินความเสี่ยงจำลองตามเวลาจริง",
    launchSimDesk: "เปิดโต๊ะซื้อขายจำลอง",
    totalAccounts: "บัญชีทั้งหมด",
    activeEvaluations: "กำลังใช้งาน",
    passedEvaluations: "ผ่านการประเมิน",
    failedEvaluations: "ไม่ผ่าน",
    cumulativePnl: "ผลการดำเนินงานกำไรขาดทุนสะสมจำลอง",
    cumulativePnlSub: "เส้นมูลค่าหุ้นจำลองที่รวบรวมจากบันทึกการเทรดทั้งหมด",
    recentTrades: "บันทึกการซื้อขายล่าสุด",
    recentTradesSub: "บันทึกตามเวลาจริงจากระบบนายหน้าจำลอง",
    lastSync: "ซิงค์ล่าสุดเมื่อ",
    riskCompliance: "ดัชนีชี้วัดการปฏิบัติตามความเสี่ยง",
    consistencyRule: "กฎความสม่ำเสมอ (สูงสุด 30% ต่อวัน)",
    maxContracts: "จำนวนสัญญาเทรดสูงสุดที่อนุญาต",
    newsTrading: "การซื้อขายช่วงข่าวสาร: อนุญาต",
    dailyPL: "กำไร/ขาดทุนรายวัน",
    requestPayout: "ร้องขอการเบิกเงิน",
    currentBalance: "ยอดเงินคงเหลือปัจจุบัน",
    accountEquity: "มูลค่าสุทธิของบัญชี",
    profitTarget: "เป้าหมายกำไร",
    reached: "สำเร็จแล้ว",
    commissionTotal: "ค่าธรรมเนียมทั้งหมด",
    grossPnl: "กำไรขาดทุนขั้นต้น",
    consistencyPercent: "% ความสม่ำเสมอ",
    accountStatus: "สถานะบัญชี",
    qualified: "ผ่านเกณฑ์",
    orderEntryBlock: "บล็อกการส่งคำสั่งซื้อขาย",
    instrumentLabel: "ผลิตภัณฑ์ทางการเงิน",
    qtyLabel: "จำนวนสัญญา",
    actionLabel: "การดำเนินการ",
    executeTrade: "ส่งคำสั่งซื้อขายจำลอง",
    searchPlaceholder: "ค้นหา...",
    createAccount: "สร้างบัญชีใหม่",
    createRuleSet: "สร้างกฎข้อบังคับใหม่",
    disbursePayout: "อนุมัติการจ่ายเงิน",
    eligibleAccounts: "บัญชีที่มีสิทธิ์เบิกเงิน",
    disburseCheck: "ตรวจสอบการเบิกเงิน",
    sqlTitle: "คอนโซลควบคุมฐานข้อมูล SQL",
    sqlExecBtn: "รันคำสั่ง SQL"
  }
};
