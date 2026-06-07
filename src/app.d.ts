import type { SupabaseClient, User, Session } from '@supabase/supabase-js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			user: User | null;
			session: Session | null;
		}

		/**
		 * Usuario normalizado que se expone a los componentes Svelte via PageData.
		 * Extrae name/email del tipo User de Supabase para facilitar el acceso.
		 */
		interface AppUser {
			id: string;
			email: string;
			name: string;
			avatarUrl: string | null;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
