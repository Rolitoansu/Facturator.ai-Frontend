import type { User } from '$lib/types/api.types';
import { mockUserId } from './mock-data';

export const getCurrentUserMock = (): User => ({
	id: mockUserId,
	email: 'andrea.perez@lensledger.app',
	passwordHash: 'hash_bcrypt_12$Lx0h2a',
	createdAt: '2026-02-14T09:00:00.000Z'
});
