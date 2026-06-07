import type { ReceiptStatus } from '$lib/types/api.types';
import type { TransactionUpdate } from '$lib/types/transactions.types';

export type SocketStatus = 'disconnected' | 'connecting' | 'connected';

export type SocketEventType = 'RECEIPT_PROCESSED';

export interface ReceiptProcessedPayload {
	receiptId: string;
	status: ReceiptStatus.Done;
	updates?: TransactionUpdate;
}

export interface SocketEvent<T extends SocketEventType = SocketEventType> {
	type: T;
	payload: ReceiptProcessedPayload;
}
