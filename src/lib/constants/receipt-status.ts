import { ReceiptStatus } from '$lib/types/api.types';

/**
 * Etiquetas legibles para cada estado de recibo.
 */
export const STATUS_LABELS: Record<ReceiptStatus, string> = {
	[ReceiptStatus.Pending]: 'pending',
	[ReceiptStatus.Processing]: 'processing',
	[ReceiptStatus.Done]: 'done',
	[ReceiptStatus.Error]: 'error'
};

/**
 * Mapa de cadenas de estado (desde datos mock) a enum ReceiptStatus.
 */
export const STATUS_MAP: Record<string, ReceiptStatus> = {
	done: ReceiptStatus.Done,
	processing: ReceiptStatus.Processing,
	pending: ReceiptStatus.Pending,
	error: ReceiptStatus.Error
};

/**
 * Devuelve la etiqueta de texto para un valor del enum ReceiptStatus.
 */
export const receiptStatusLabel = (status: ReceiptStatus): string => {
	switch (status) {
		case ReceiptStatus.Pending:
			return 'pending';
		case ReceiptStatus.Processing:
			return 'processing';
		case ReceiptStatus.Done:
			return 'done';
		case ReceiptStatus.Error:
			return 'error';
	}
};
