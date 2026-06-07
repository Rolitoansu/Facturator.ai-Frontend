import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const LOGIN_PATH = '/login';
const APP_PREFIX = '/app';

export const handle: Handle = async ({ event, resolve }) => {
	const raw = event.cookies.get('mock_session');

	if (raw) {
		try {
			event.locals.user = JSON.parse(raw);
		} catch {
			event.cookies.delete('mock_session', { path: '/' });
		}
	}

	if (!event.locals.user && event.url.pathname.startsWith(APP_PREFIX)) {
		throw redirect(302, LOGIN_PATH);
	}

	return resolve(event);
};
