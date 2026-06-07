import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const raw = locals.user;

	const user: App.AppUser | null = raw
		? {
				id: raw.id,
				email: raw.email ?? '',
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

