import { apiFetch } from './client';

export interface UserProfile {
	id: string;
	displayName: string | null;
	avatarUrl: string | null;
	currency: string;
	locale: string;
	monthlyBudgetGoal: number | null;
	onboardingCompleted: boolean;
}

export interface SubscriptionInfo {
	id: string;
	userId: string;
	plan: 'free' | 'pro' | 'enterprise';
	status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'incomplete';
	receiptLimit: number;
	currentPeriodEnd: string | null;
	cancelAtPeriodEnd: boolean;
}

export async function getProfile(): Promise<UserProfile> {
	return apiFetch<UserProfile>('/api/profile');
}

export async function updateProfile(data: Partial<UserProfile>): Promise<void> {
	await apiFetch('/api/profile', {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

export async function getSubscription(): Promise<SubscriptionInfo> {
	return apiFetch<SubscriptionInfo>('/api/subscription');
}

export async function createCheckoutSession(): Promise<{ checkoutUrl: string; sessionId: string }> {
	return apiFetch('/api/subscription/checkout', {
		method: 'POST'
	});
}
