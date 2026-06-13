import { writable } from 'svelte/store';

import { ReceiptStatus } from '$lib/types/api.types';
import type { Receipt } from '$lib/types/api.types';
import type {
	TransactionItem,
	TransactionUpdate,
	TransactionsState
} from '$lib/types/transactions.types';
import { getCurrentUserMock } from '$lib/api/user';
import { 
	getTransactions, 
	deleteTransactionsByCategory as apiDeleteTransactionsByCategory,
	reassignTransactionsCategory as apiReassignTransactionsCategory
} from '$lib/api/transactions';
import { mapTransaction, receiptToProcessingItem } from '$lib/utils/receipt';

export type { TransactionItem, TransactionUpdate, TransactionsState };

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

	const deleteTransactionsByCategory = async (category: string) => {
		try {
			await apiDeleteTransactionsByCategory(category);
			update((state) => ({
				...state,
				items: state.items.filter((item) => item.category !== category)
			}));
		} catch (error) {
			console.error('Error deleting transactions by category:', error);
		}
	};

	const reassignCategory = async (oldCategory: string, newCategory: string) => {
		try {
			await apiReassignTransactionsCategory(oldCategory, newCategory);
			update((state) => ({
				...state,
				items: state.items.map((item) =>
					item.category === oldCategory ? { ...item, category: newCategory } : item
				)
			}));
		} catch (error) {
			console.error('Error reassigning transactions category:', error);
		}
	};

	void load();

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
