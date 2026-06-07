import { ReceiptStatus } from '$lib/types/api.types';
import type { Receipt, Transaction } from '$lib/types/api.types';
import type { TransactionItem } from '$lib/types/transactions.types';
import { toDateString } from './date';

/**
 * Extrae el nombre del comercio de un rawText de recibo.
 * Toma la primera línea no vacía.
 */
export const extractMerchant = (value: string): string =>
	value
		.split('\n')
		.map((line) => line.trim())
		.find(Boolean) ?? 'Recibo';

/**
 * Extrae el importe de un rawText de recibo con formato "EUR X.XX".
 * Devuelve 'EUR --' si no encuentra un patrón numérico válido.
 */
export const extractAmount = (value: string): string => {
	const match = value.match(/(\d+[.,]\d{2})/);
	if (!match) return 'EUR --';

	const numeric = Number(match[1].replace(',', '.'));
	return Number.isNaN(numeric) ? 'EUR --' : `EUR ${numeric.toFixed(2)}`;
};

/**
 * Mapea un Transaction a TransactionItem añadiendo status Done por defecto.
 */
export const mapTransaction = (transaction: Transaction): TransactionItem => ({
	...transaction,
	status: ReceiptStatus.Done
});

/**
 * Convierte un TransactionItem a Receipt para usar en ReceiptCard.
 */
export const transactionToReceipt = (transaction: TransactionItem): Receipt => {
	const rawText =
		transaction.status === ReceiptStatus.Done
			? `${transaction.merchant}\nTOTAL ${transaction.amount.toFixed(2)} EUR\n${transaction.date}`
			: '';

	return {
		id: transaction.receiptId,
		userId: transaction.userId,
		imageUrl: '',
		rawText,
		status: transaction.status,
		createdAt: `${transaction.date}T00:00:00.000Z`
	};
};

/**
 * Crea un TransactionItem en estado Processing a partir de un Receipt.
 */
export const receiptToProcessingItem = (receipt: Receipt): TransactionItem => ({
	id: `txn_${receipt.id}`,
	receiptId: receipt.id,
	userId: receipt.userId,
	amount: 0,
	merchant: 'Processing receipt',
	category: 'otros',
	date: toDateString(receipt.createdAt),
	status: ReceiptStatus.Processing
});
