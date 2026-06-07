import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	const raw = locals.user;

	// Normalizamos el User de Supabase a un objeto simple que los componentes
	// puedan consumir directamente con user.name, user.email, etc.
	const user: App.AppUser | null = raw
		? {
				id: raw.id,
				email: raw.email ?? '',
				// Google OAuth guarda el nombre en user_metadata.full_name o name
				name:
					(raw.user_metadata?.full_name as string | undefined) ??
					(raw.user_metadata?.name as string | undefined) ??
					raw.email ??
					'Usuario',
				avatarUrl: (raw.user_metadata?.avatar_url as string | undefined) ?? null
			}
		: null;

	return { user };
};

