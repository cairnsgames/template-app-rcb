// Type definitions for finances ledger items (informational - project is not TypeScript)
export interface LedgerItem {
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
}

// Mapped shape used by the UI
export interface UiTransaction extends LedgerItem {
  transactionAmount?: number;
  grossAmount?: number;
  taxAmount?: number;
  platformFee?: number;
  netAmount?: number;
  date?: string;
}

export default {};
