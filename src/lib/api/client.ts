import { PUBLIC_API_URL } from '$env/static/public';
import { supabase } from '$lib/supabase';

/**
 * Base API client that talks to the Go backend.
 * Automatically attaches the Supabase JWT for authentication.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	return headers;
}

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {}
): Promise<T> {
	const headers = await getAuthHeaders();
	const url = `${PUBLIC_API_URL}${path}`;

	const res = await fetch(url, {
		...options,
		headers: {
			...headers,
			...(options.headers as Record<string, string>)
		}
	});

	if (!res.ok) {
		const body = await res.json().catch(() => ({ error: res.statusText }));
		throw new Error(body.error || `API error: ${res.status}`);
	}

	return res.json();
}

export async function apiUpload<T>(
	path: string,
	formData: FormData
): Promise<T> {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;

	const headers: Record<string, string> = {};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	// Don't set Content-Type for FormData — browser sets it with boundary

	const url = `${PUBLIC_API_URL}${path}`;
	const res = await fetch(url, {
		method: 'POST',
		headers,
		body: formData
	});

	if (!res.ok) {
		const body = await res.json().catch(() => ({ error: res.statusText }));
		throw new Error(body.error || `Upload error: ${res.status}`);
	}

	return res.json();
}
