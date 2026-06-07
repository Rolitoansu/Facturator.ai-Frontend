import { writable } from 'svelte/store';
import type { Budget } from '$lib/types/api.types';
import { mockBudgets } from '$lib/mock/lensledger';

const createBudgetsStore = () => {
	const { subscribe, set, update } = writable<Budget[]>(mockBudgets);

	const addBudget = (category: string, limitAmount: number) => {
		update((budgets) => {
			const exists = budgets.some((b) => b.category === category);
			if (exists) {
				return budgets.map((b) => (b.category === category ? { ...b, limitAmount } : b));
			}
			const newBudget: Budget = {
				id: `bdg_${Math.random().toString(36).substring(2, 11)}`,
				userId: 'user_9f2b7d6a',
				category,
				limitAmount,
				month: '2026-05-01'
			};
			return [...budgets, newBudget];
		});
	};

	const updateBudget = (id: string, limitAmount: number) => {
		update((budgets) => budgets.map((b) => (b.id === id ? { ...b, limitAmount } : b)));
	};

	const deleteBudget = (id: string) => {
		update((budgets) => budgets.filter((b) => b.id !== id));
	};

	return {
		subscribe,
		addBudget,
		updateBudget,
		deleteBudget,
		set
	};
};

export const budgetsStore = createBudgetsStore();
