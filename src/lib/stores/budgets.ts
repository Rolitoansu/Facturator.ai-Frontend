import { writable } from 'svelte/store';
import type { Budget } from '$lib/types/api.types';
import {
	getBudgets as fetchBudgets,
	createBudget as apiCreateBudget,
	updateBudget as apiUpdateBudget,
	deleteBudget as apiDeleteBudget
} from '$lib/api/budgets';

const createBudgetsStore = () => {
	const { subscribe, set, update } = writable<Budget[]>([]);
	let loading = false;

	const load = async () => {
		if (loading) return;
		loading = true;
		try {
			const budgets = await fetchBudgets();
			set(budgets);
		} catch (err) {
			console.error('Error loading budgets:', err);
		} finally {
			loading = false;
		}
	};

	const addBudget = async (category: string, limitAmount: number, month?: string) => {
		try {
			const newBudget = await apiCreateBudget(category, limitAmount, month);
			update((budgets) => {
				// If it was an upsert, replace existing
				const exists = budgets.some((b) => b.category === category);
				if (exists) {
					return budgets.map((b) => (b.category === category ? newBudget : b));
				}
				return [...budgets, newBudget];
			});
		} catch (err) {
			console.error('Error creating budget:', err);
			throw err;
		}
	};

	const updateBudget = async (id: string, limitAmount: number) => {
		try {
			await apiUpdateBudget(id, limitAmount);
			update((budgets) => budgets.map((b) => (b.id === id ? { ...b, limitAmount } : b)));
		} catch (err) {
			console.error('Error updating budget:', err);
			throw err;
		}
	};

	const deleteBudget = async (id: string) => {
		try {
			await apiDeleteBudget(id);
			update((budgets) => budgets.filter((b) => b.id !== id));
		} catch (err) {
			console.error('Error deleting budget:', err);
			throw err;
		}
	};

	void load();

	return {
		subscribe,
		reload: load,
		addBudget,
		updateBudget,
		deleteBudget,
		set
	};
};

export const budgetsStore = createBudgetsStore();

