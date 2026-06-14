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

