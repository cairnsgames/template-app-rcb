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
};

export default {};
