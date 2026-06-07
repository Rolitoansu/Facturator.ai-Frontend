import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';

const LOGIN_PATH = '/login';
const APP_PREFIX = '/app';

export const handle: Handle = async ({ event, resolve }) => {
	// Crea el cliente Supabase SSR y lo expone en locals para que las rutas
	// puedan reutilizarlo sin crear múltiples instancias por request.
	event.locals.supabase = createSupabaseServerClient(event.cookies);

	// Obtiene la sesión actual de Supabase (basada en las cookies de sesión).
	// getUser() hace una llamada al servidor de Supabase para verificar el JWT,
	// lo que es más seguro que getSession() que solo lee el JWT localmente.
	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();

	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	event.locals.user = user;
	event.locals.session = session;

	// Proteger todas las rutas bajo /app/*
	if (!event.locals.user && event.url.pathname.startsWith(APP_PREFIX)) {
		throw redirect(302, LOGIN_PATH);
	}

	return resolve(event);
};

