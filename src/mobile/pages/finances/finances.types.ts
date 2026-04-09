// Type definitions for finances ledger items (informational - project is not TypeScript)
export type LedgerItem = {
  id: number;
  transaction_id?: number;
  user_id?: number;
  account_type?: string;
  type?: string;
  transaction_amount?: number;
  gross_amount?: number;
  net_amount?: number;
  tax_amount?: number;
  platform_gross_amount?: number;
  platform_net_amount?: number;
  platform_tax_amount?: number;
  currency?: string;
  description?: string;
  created_at?: string;
  reference?: string;
  transaction_description?: string;
};

// Mapped shape used by the UI
export type UiTransaction = LedgerItem & {
  transactionAmount?: number;
  grossAmount?: number;
  taxAmount?: number;
  platformFee?: number;
  netAmount?: number;
  date?: string;
};

export type BankDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  sortCode: string;
};

export type FinancesEvent = {
  id: number;
  calendar_id?: number;
  parent_id?: number;
  user_id?: number;
  event_template_id?: number;
  app_id?: string;
  title: string;
  description?: string;
  image?: string;
  event_type?: string;
  keywords?: string;
  duration?: number;
  location?: string;
  lat?: number;
  lng?: number;
  max_participants?: number;
  period_type?: string;
  start_time?: string;
  end_time?: string | null;
  currency?: string;
  tickets?: string;
  tickettypes?: string;
  options?: string;
  price?: number;
  content_id?: number;
  show_as_news?: string;
  overlay_text?: string;
  enable_bookings?: string;
  created?: string;
  modified?: string | null;
  days_displayed?: number;
  detail_people_views?: number;
  detail_total_views?: string | number;
  card_people_views?: number;
  card_total_views?: string | number;
  tickets_sold?: number;
  total_price?: number;
  [key: string]: any;
};

export type EventSummary = {
  total_price?: number;
  user_gross_total?: string;
  user_tax_total?: string;
  user_net_total?: string;
  platform_gross_total?: string;
  platform_tax_total?: string;
  platform_net_total?: string;
  other_vat?: string;
};

export type TxContextValue = {
  balance: number;
  accountId: number | null;
  setAccountId: (id: number | null) => void;
  setBalance: (v: number) => void;
  vatOwed: number;
  setVatOwed: (v: number) => void;
  vatNumber: string;
  setVatNumber: (v: string) => void;
  isVatRegistered: boolean;
  setIsVatRegistered: (b: boolean) => void;
  bankDetails: BankDetails;
  setBankDetails: (b: BankDetails) => void;
  payouts: any[];
  setPayouts: (p: any[]) => void;
  transactions: any[];
  setTransactions: (t: any[]) => void;
  refresh: () => Promise<void>;
  requestPayout: (accountType?: string, amount?: number) => Promise<any>;
  loadingBalances: boolean;
  loadingTransactions: boolean;
  loadingPayouts: boolean;
  requestingPayout: boolean;
  events?: FinancesEvent[];
  setEvents?: (e: FinancesEvent[]) => void;
  loadingEvents?: boolean;
  getEventSummary?: (eventId: number) => Promise<EventSummary | null>;
};

export default {};
