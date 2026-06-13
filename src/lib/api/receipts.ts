import type { Receipt } from '$lib/types/api.types';
import { apiFetch, BACKEND_URL } from './client';

export async function uploadReceipt(file: File, userId: string): Promise<Receipt> {
	if (!userId) {
		throw new Error('userId is required');
	}

	const formData = new FormData();
	formData.append('file', file);

	const receipt = await apiFetch<Receipt>('/receipts', {
		method: 'POST',
		body: formData
	});

	if (receipt.imageUrl && receipt.imageUrl.startsWith('/')) {
		receipt.imageUrl = `${BACKEND_URL}${receipt.imageUrl}`;
	}

	return receipt;
}

