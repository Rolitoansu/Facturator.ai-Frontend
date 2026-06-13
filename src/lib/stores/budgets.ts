import { writable } from 'svelte/store';
import type { Budget } from '$lib/types/api.types';
import { 
	getBudgets, 
	createBudget as apiCreateBudget, 
	updateBudget as apiUpdateBudget, 
	deleteBudget as apiDeleteBudget 
} from '$lib/api/budgets';

const createBudgetsStore = () => {
	const { subscribe, set, update } = writable<Budget[]>([]);

	const load = async () => {
		try {
			const budgets = await getBudgets('user_9f2b7d6a');
			set(budgets);
		} catch (error) {
			console.error('Failed to load budgets:', error);
		}
	};

	const addBudget = async (category: string, limitAmount: number) => {
		try {
			let existingId: string | null = null;
			update((budgets) => {
				const match = budgets.find((b) => b.category === category);
				if (match) existingId = match.id;
				return budgets;
			});

			if (existingId) {
				await apiUpdateBudget(existingId, limitAmount);
				update((budgets) => 
					budgets.map((b) => (b.category === category ? { ...b, limitAmount } : b))
				);
			} else {
				const newBudget = await apiCreateBudget(category, limitAmount, '2026-05-01');
				update((budgets) => [...budgets, newBudget]);
			}
		} catch (error) {
			console.error('Error adding budget:', error);
		}
	};

	const updateBudget = async (id: string, limitAmount: number) => {
		try {
			await apiUpdateBudget(id, limitAmount);
			update((budgets) => budgets.map((b) => (b.id === id ? { ...b, limitAmount } : b)));
		} catch (error) {
			console.error('Error updating budget:', error);
		}
	};

	const deleteBudget = async (id: string) => {
		try {
			await apiDeleteBudget(id);
			update((budgets) => budgets.filter((b) => b.id !== id));
		} catch (error) {
			console.error('Error deleting budget:', error);
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

