import type { Budget } from '$lib/types/api.types';
import { delay } from '$lib/utils/async';
import { mockBudgets } from './mock-data';

export async function getBudgets(userId: string): Promise<Budget[]> {
	if (!userId) {
		throw new Error('userId is required');
	}

	await delay(380);
	return mockBudgets.filter((budget) => budget.userId === userId);
}
