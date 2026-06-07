import { writable } from 'svelte/store';

import { ReceiptStatus } from '$lib/types/api.types';
import type {
	SocketStatus,
	SocketEventType,
	SocketEvent,
	ReceiptProcessedPayload
} from '$lib/types/socket.types';
import { transactionsStore } from '$lib/stores/transactions';
import type { TransactionUpdate } from '$lib/types/transactions.types';

export type { SocketStatus, SocketEventType, SocketEvent, ReceiptProcessedPayload };

const { subscribe, set } = writable<SocketStatus>('disconnected');

const listeners = new Set<(event: SocketEvent) => void>();

const emit = (event: SocketEvent) => {
	listeners.forEach((handler) => handler(event));
};

const connect = () => {
	set('connecting');
	set('connected');
};

const disconnect = () => {
	set('disconnected');
};

const onEvent = (handler: (event: SocketEvent) => void) => {
	listeners.add(handler);
	return () => listeners.delete(handler);
};

const simulateReceiptProcessed = (receiptId: string, updates: TransactionUpdate = {}) => {
	setTimeout(() => {
		const payload: ReceiptProcessedPayload = {
			receiptId,
			status: ReceiptStatus.Done,
			updates
		};

		transactionsStore.updateReceiptStatus(receiptId, ReceiptStatus.Done, updates);
		emit({ type: 'RECEIPT_PROCESSED', payload });
	}, 5000);
};

connect();

export const socketStore = {
	subscribe,
	connect,
	disconnect,
	onEvent,
	simulateReceiptProcessed
};
