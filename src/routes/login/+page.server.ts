import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	// Si ya hay sesión activa, redirigir al dashboard
	if (locals.user) {
		redirect(302, '/app/dashboard');
	}
	return {};
};

export const actions: Actions = {
	/**
	 * Inicio de sesión con email y contraseña usando Supabase Auth.
	 */
	signInEmail: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString() ?? '';
		const password = data.get('password')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { message: 'Email y contraseña son requeridos.' });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

		if (error) {
			// Supabase devuelve mensajes en inglés; los traducimos para el usuario
			const message =
				error.message === 'Invalid login credentials'
					? 'Credenciales incorrectas. Revisa tu email y contraseña.'
					: error.message;
			return fail(400, { message });
		}

		redirect(302, '/app/dashboard');
	},

	/**
	 * Registro de nuevo usuario con email y contraseña.
	 */
	signUpEmail: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString() ?? '';
		const password = data.get('password')?.toString() ?? '';
		const name = data.get('name')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { message: 'Email y contraseña son requeridos.' });
		}

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: { full_name: name }
			}
		});

		if (error) {
			return fail(400, { message: error.message });
		}

		// Supabase puede requerir confirmación de email según la configuración del proyecto.
		// Si "Confirm email" está desactivado en el dashboard, la sesión se crea directamente.
		redirect(302, '/app/dashboard');
	},

	/**
	 * Cierre de sesión.
	 */
	logout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		redirect(302, '/login');
	},

	/**
	 * Inicia el flujo de OAuth con Google.
	 * Supabase devuelve una URL de redirección al proveedor de OAuth.
	 */
	signInGoogle: async ({ locals, url }) => {
		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				// Callback al que Supabase redirige tras autenticar en Google
				redirectTo: `${url.origin}/auth/callback`
			}
		});

		if (error) {
			return fail(500, { message: 'Error iniciando OAuth con Google.' });
		}

		// Redirigir al usuario a la URL de Google OAuth
		redirect(302, data.url);
	}
};

