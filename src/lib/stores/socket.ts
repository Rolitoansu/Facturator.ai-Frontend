import { writable } from 'svelte/store';
import { PUBLIC_API_URL } from '$env/static/public';

import { ReceiptStatus } from '$lib/types/api.types';
import type {
	SocketStatus,
	SocketEvent,
	ReceiptProcessedPayload
} from '$lib/types/socket.types';
import { transactionsStore } from '$lib/stores/transactions';

export type { SocketStatus, SocketEvent, ReceiptProcessedPayload };

const { subscribe, set } = writable<SocketStatus>('disconnected');

const listeners = new Set<(event: SocketEvent) => void>();
let ws: WebSocket | null = null;
let currentUserId: string | null = null;
let reconnectTimer: any = null;

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let currentUserId: string | null = null;

const emit = (event: SocketEvent) => {
	listeners.forEach((handler) => handler(event));
};

const connect = (userId: string) => {
	if (ws && ws.readyState === WebSocket.OPEN) return;

	currentUserId = userId;
	set('connecting');

	// Convert http(s) to ws(s)
	const wsBase = PUBLIC_API_URL.replace(/^http/, 'ws');
	const url = `${wsBase}/ws?userId=${encodeURIComponent(userId)}`;

	try {
		ws = new WebSocket(url);

		ws.onopen = () => {
			set('connected');
			console.log('[WS] Connected');
		};

		ws.onmessage = (event) => {
			try {
				const data: SocketEvent = JSON.parse(event.data);
				handleSocketEvent(data);
				emit(data);
			} catch (err) {
				console.error('[WS] Error parsing message:', err);
			}
		};

		ws.onclose = () => {
			set('disconnected');
			ws = null;
			console.log('[WS] Disconnected');

			// Auto-reconnect after 3 seconds
			if (currentUserId) {
				reconnectTimer = setTimeout(() => {
					if (currentUserId) connect(currentUserId);
				}, 3000);
			}
		};

		ws.onerror = (err) => {
			console.error('[WS] Error:', err);
			ws?.close();
		};
	} catch (err) {
		console.error('[WS] Failed to create WebSocket:', err);
		set('disconnected');
	}
};

const disconnect = () => {
	currentUserId = null;
	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}
	if (ws) {
		ws.close();
		ws = null;
	}
	set('disconnected');
};

const onEvent = (handler: (event: SocketEvent) => void) => {
	listeners.add(handler);
	return () => listeners.delete(handler);
};

const handleSocketEvent = (event: SocketEvent) => {
	if (event.type === 'RECEIPT_PROCESSED') {
		const { receiptId, status, updates } = event.payload;
		const receiptStatus = status === 'done' ? ReceiptStatus.Done : ReceiptStatus.Error;
		transactionsStore.updateReceiptStatus(
			receiptId,
			receiptStatus,
			(updates as TransactionUpdate) ?? {}
		);
	}
};

export const socketStore = {
	subscribe,
	connect,
	disconnect,
	onEvent
};
