import type { Transaction } from '$lib/types/api.types';
import { apiFetch } from './client';

export async function getTransactions(): Promise<Transaction[]> {
	return apiFetch<Transaction[]>('/api/transactions');
}

export async function deleteTransactionsByCategory(category: string): Promise<void> {
	await apiFetch(`/api/transactions?category=${encodeURIComponent(category)}`, {
		method: 'DELETE'
	});
}

export async function reassignTransactions(from: string, to: string): Promise<void> {
	await apiFetch(`/api/transactions/reassign?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
		method: 'PUT'
	});
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
	await apiFetch(`/api/transactions/${id}`, {
		method: 'PUT',
		body: JSON.stringify(updates)
	});
}
