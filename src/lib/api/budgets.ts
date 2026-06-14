import type { Budget } from '$lib/types/api.types';
import { apiFetch } from './client';

export async function getBudgets(): Promise<Budget[]> {
	return apiFetch<Budget[]>('/api/budgets');
}

export async function createBudget(
	category: string,
	limitAmount: number,
	month?: string
): Promise<Budget> {
	return apiFetch<Budget>('/api/budgets', {
		method: 'POST',
		body: JSON.stringify({ category, limitAmount, month })
	});
}

export async function updateBudget(id: string, limitAmount: number): Promise<void> {
	await apiFetch(`/api/budgets/${id}`, {
		method: 'PUT',
		body: JSON.stringify({ limitAmount })
	});
}

export async function deleteBudget(id: string): Promise<void> {
	await apiFetch(`/api/budgets/${id}`, {
		method: 'DELETE'
	});
}

export async function createBudget(category: string, limitAmount: number, month?: string): Promise<Budget> {
	return apiFetch<Budget>('/budgets', {
		method: 'POST',
		body: JSON.stringify({ category, limitAmount, month })
	});
}

export async function updateBudget(id: string, limitAmount: number): Promise<void> {
	await apiFetch<void>(`/budgets/${id}`, {
		method: 'PUT',
		body: JSON.stringify({ limitAmount })
	});
}

export async function deleteBudget(id: string): Promise<void> {
	await apiFetch<void>(`/budgets/${id}`, {
		method: 'DELETE'
	});
}

