import { writable } from 'svelte/store';

import { ReceiptStatus } from '$lib/api';
import { transactionsStore } from '$lib/stores/transactions';
import type { TransactionUpdate } from '$lib/stores/transactions';

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
