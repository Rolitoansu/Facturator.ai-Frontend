// API client
export { apiFetch, apiUpload } from './client';

// Domain modules
export { getReceipts, uploadReceipt } from './receipts';
export { getTransactions, deleteTransactionsByCategory, reassignTransactions } from './transactions';
export { getBudgets, createBudget, updateBudget, deleteBudget } from './budgets';
export { getCategories, createCategory } from './categories';
export { getProfile, updateProfile, getSubscription, createCheckoutSession } from './profile';

// Re-export types
export { ReceiptStatus } from '$lib/types/api.types';
export type { Receipt, Transaction, Budget } from '$lib/types/api.types';
export type { CategoryAPI } from './categories';
export type { UserProfile, SubscriptionInfo } from './profile';
