import { writable } from 'svelte/store';

import { ReceiptStatus } from '$lib/types/api.types';
import type { Receipt } from '$lib/types/api.types';
import type {
	TransactionItem,
	TransactionUpdate,
	TransactionsState
} from '$lib/types/transactions.types';
import { getTransactions as fetchTransactions } from '$lib/api/transactions';
import { mapTransaction, receiptToProcessingItem } from '$lib/utils/receipt';

export type { TransactionItem, TransactionUpdate, TransactionsState };

const createTransactionsStore = () => {
	const { subscribe, set, update } = writable<TransactionsState>({
		items: [],
		loading: true,
		error: null
	});

	const load = async () => {
		set({ items: [], loading: true, error: null });

		try {
			const items = await fetchTransactions();
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
		const processingItem = receiptToProcessingItem(receipt);
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

	const deleteTransactionsByCategory = (category: string) => {
		update((state) => ({
			...state,
			items: state.items.filter((item) => item.category !== category)
		}));
	};

	const reassignCategory = (oldCategory: string, newCategory: string) => {
		update((state) => ({
			...state,
			items: state.items.map((item) =>
				item.category === oldCategory ? { ...item, category: newCategory } : item
			)
		}));
	};

	return {
		subscribe,
		reload: load,
		addProcessingReceipt,
		updateReceiptStatus,
		deleteTransactionsByCategory,
		reassignCategory
	};
};

export const transactionsStore = createTransactionsStore();
