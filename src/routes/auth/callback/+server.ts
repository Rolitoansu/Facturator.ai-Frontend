import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Endpoint que Supabase llama tras completar el flujo OAuth con Google.
 *
 * Supabase redirige a esta URL con un `code` en el query string.
 * Intercambiamos ese código por una sesión y redirigimos al usuario
 * al dashboard de la aplicación.
 */
export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/app/dashboard';

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			// Redirección segura: solo permitimos rutas relativas dentro del origen
			const safeNext = next.startsWith('/') ? next : '/app/dashboard';
			redirect(303, safeNext);
		}
	}

	// Si hubo un error o no hay código, redirigir al login con un error
	redirect(303, '/login?error=auth_callback_error');
};
