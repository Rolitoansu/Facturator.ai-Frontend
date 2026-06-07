import { ReceiptStatus } from '$lib/types/api.types';
import type { Receipt } from '$lib/types/api.types';
import { delay } from '$lib/utils/async';
import { createId } from '$lib/utils/id';
import { mockReceipts } from './mock-data';

export const getReceiptMocks = (): Receipt[] => [...mockReceipts];

export async function uploadReceipt(file: File, userId: string): Promise<Receipt> {
	if (!userId) {
		throw new Error('userId is required');
	}

	await delay(650);

	const receipt: Receipt = {
		id: createId('rcpt'),
		userId,
		imageUrl: `/uploads/receipts/${encodeURIComponent(file.name)}`,
		rawText: '',
		status: ReceiptStatus.Processing,
		createdAt: new Date().toISOString()
	};

	mockReceipts.unshift(receipt);
	return receipt;
}
