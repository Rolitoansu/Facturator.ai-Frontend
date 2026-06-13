// Re-exporta todos los tipos del dominio de la API
export { ReceiptStatus } from '$lib/types/api.types';
export type { User, Receipt, Transaction, Budget } from '$lib/types/api.types';

// Re-exporta funciones y datos de cada módulo
export { getCurrentUserMock } from './user';
export { uploadReceipt } from './receipts';
export { getTransactions } from './transactions';
export { getBudgets } from './budgets';
export { mockUserId, mockReceipts, mockTransactions, mockBudgets } from './mock-data';
