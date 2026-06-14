import { writable } from 'svelte/store';

import { ReceiptStatus } from '$lib/types/api.types';
import type { Receipt } from '$lib/types/api.types';
import type {
	TransactionItem,
	TransactionUpdate,
	TransactionsState
} from '$lib/types/transactions.types';
import {
	getTransactions as fetchTransactions,
	deleteTransactionsByCategory as apiDeleteTransactionsByCategory,
	reassignTransactions as apiReassignTransactionsCategory,
	updateTransaction as apiUpdateTransaction
} from '$lib/api/transactions';
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

	const updateTransactionItem = async (id: string, updates: Partial<TransactionItem>) => {
		try {
			await apiUpdateTransaction(id, updates);
			update((state) => ({
				...state,
				items: state.items.map((item) =>
					item.id === id ? { ...item, ...updates, needsReview: false } : item
				)
			}));
		} catch (error) {
			console.error('Error updating transaction:', error);
			throw error;
		}
	};

	return {
		subscribe,
		reload: load,
		addProcessingReceipt,
		updateReceiptStatus,
		deleteTransactionsByCategory,
		reassignCategory,
		updateTransactionItem
	};
};

export const transactionsStore = createTransactionsStore();
