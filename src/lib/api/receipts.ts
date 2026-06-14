import type { Receipt } from '$lib/types/api.types';
import { apiFetch, apiUpload } from './client';

export async function getReceipts(): Promise<Receipt[]> {
	return apiFetch<Receipt[]>('/api/receipts');
}

export async function uploadReceipt(file: File): Promise<Receipt> {
	const formData = new FormData();
	formData.append('file', file);
	return apiUpload<Receipt>('/api/receipts', formData);
}

