import type { Transaction } from '$lib/types/api.types';
import { apiFetch } from './client';

export async function getTransactions(userId: string): Promise<Transaction[]> {
	if (!userId) {
		throw new Error('userId is required');
	}
	return apiFetch<Transaction[]>('/transactions');
}

export async function deleteTransactionsByCategory(category: string): Promise<void> {
	await apiFetch<void>(`/transactions?category=${encodeURIComponent(category)}`, {
		method: 'DELETE'
	});
}

export async function reassignTransactionsCategory(from: string, to: string): Promise<void> {
	await apiFetch<void>(`/transactions/reassign?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
		method: 'PUT'
	});
}

