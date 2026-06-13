import { supabase } from '$lib/supabase';

export const BACKEND_URL = 'http://localhost:8080';
export const API_BASE_URL = `${BACKEND_URL}/api`;

async function getHeaders(): Promise<Record<string, string>> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	try {
		const { data: { session } } = await supabase.auth.getSession();
		if (session?.access_token) {
			headers['Authorization'] = `Bearer ${session.access_token}`;
		}
	} catch (error) {
		console.warn('Could not retrieve Supabase session token:', error);
	}

	return headers;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const headers = await getHeaders();

	if (options.body instanceof FormData) {
		delete headers['Content-Type'];
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			...headers,
			...options.headers
		}
	});

	if (!response.ok) {
		const errMsg = await response.text();
		throw new Error(errMsg || `API request failed with status ${response.status}`);
	}

	return response.json() as Promise<T>;
}
