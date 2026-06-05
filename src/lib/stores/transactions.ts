import { writable } from 'svelte/store';

import { ReceiptStatus, getCurrentUserMock, getTransactions } from '$lib/api';
import type { Receipt, Transaction } from '$lib/api';

export interface TransactionItem extends Transaction {
	status: ReceiptStatus;
}

export type TransactionUpdate = Partial<Omit<TransactionItem, 'id' | 'receiptId' | 'userId'>>;

export interface TransactionsState {
	items: TransactionItem[];
	loading: boolean;
	error: string | null;
}

const mapTransaction = (transaction: Transaction): TransactionItem => ({
	...transaction,
	status: ReceiptStatus.Done
});

const toDateString = (value: string) => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return new Date().toISOString().slice(0, 10);
	}

	return date.toISOString().slice(0, 10);
};

const createTransactionsStore = () => {
	const currentUser = getCurrentUserMock();
	const { subscribe, set, update } = writable<TransactionsState>({
		items: [],
		loading: true,
		error: null
	});

	const load = async () => {
		set({ items: [], loading: true, error: null });

		try {
			const items = await getTransactions(currentUser.id);
			set({ items: items.map(mapTransaction), loading: false, error: null });
		} catch (error) {
			set({
				items: [],
				loading: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	};

	const addProcessingReceipt = (receipt: Receipt) => {
		const processingItem: TransactionItem = {
			id: `txn_${receipt.id}`,
			receiptId: receipt.id,
			userId: receipt.userId,
			amount: 0,
			merchant: 'Processing receipt',
			category: 'otros',
			date: toDateString(receipt.createdAt),
			status: ReceiptStatus.Processing
		};

		update((state) => ({
			...state,
			items: [processingItem, ...state.items]
		}));
	};

	const updateReceiptStatus = (
		receiptId: string,
		status: ReceiptStatus,
		updates: TransactionUpdate = {}
	) => {
		update((state) => ({
			...state,
			items: state.items.map((item) =>
				item.receiptId === receiptId ? { ...item, status, ...updates } : item
			)
		}));
	};

	void load();

	return {
		subscribe,
		reload: load,
		addProcessingReceipt,
		updateReceiptStatus
	};
};

export const transactionsStore = createTransactionsStore();
