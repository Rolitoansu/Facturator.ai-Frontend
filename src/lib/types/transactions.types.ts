import type { ReceiptStatus } from './api.types';
import type { Transaction } from './api.types';

export interface TransactionItem extends Transaction {
	status: ReceiptStatus;
}

export type TransactionUpdate = Partial<Omit<TransactionItem, 'id' | 'receiptId' | 'userId'>>;

export interface TransactionsState {
	items: TransactionItem[];
	loading: boolean;
	error: string | null;
}
