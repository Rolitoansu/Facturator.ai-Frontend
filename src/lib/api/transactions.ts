import type { Transaction } from '$lib/types/api.types';
import { delay } from '$lib/utils/async';
import { mockTransactions } from './mock-data';

export async function getTransactions(userId: string): Promise<Transaction[]> {
	if (!userId) {
		throw new Error('userId is required');
	}

	await delay(420);
	return mockTransactions.filter((txn) => txn.userId === userId);
}
