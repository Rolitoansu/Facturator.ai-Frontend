import { apiFetch } from './client';

export interface CategoryAPI {
	id: string;
	userId: string | null;
	slug: string;
	label: string;
	color: string;
}

export async function getCategories(): Promise<CategoryAPI[]> {
	return apiFetch<CategoryAPI[]>('/api/categories');
}

export async function createCategory(label: string, color: string): Promise<CategoryAPI> {
	return apiFetch<CategoryAPI>('/api/categories', {
		method: 'POST',
		body: JSON.stringify({ label, color })
	});
}
