import { writable } from 'svelte/store';
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

const emit = (event: SocketEvent) => {
	listeners.forEach((handler) => handler(event));
};

const connect = (userId: string) => {
	if (typeof window === 'undefined') return;

	currentUserId = userId;

	if (ws) {
		if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
			return;
		}
		ws.close();
	}

	set('connecting');

	try {
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		ws = new WebSocket(`${protocol}//localhost:8080/ws?userId=${userId}`);

		ws.onopen = () => {
			set('connected');
			console.log('WebSocket connected');
			if (reconnectTimer) {
				clearTimeout(reconnectTimer);
				reconnectTimer = null;
			}
		};

		ws.onclose = () => {
			set('disconnected');
			console.log('WebSocket connection closed. Reconnecting...');
			scheduleReconnect();
		};

		ws.onerror = (err) => {
			console.error('WebSocket error:', err);
			set('disconnected');
			ws?.close();
		};

		ws.onmessage = (event) => {
			try {
				const socketMsg = JSON.parse(event.data);
				console.log('WebSocket message received:', socketMsg);

				if (socketMsg.type === 'RECEIPT_PROCESSED') {
					const payload = socketMsg.payload as ReceiptProcessedPayload;
					transactionsStore.updateReceiptStatus(
						payload.receiptId,
						payload.status,
						payload.updates
					);
					emit(socketMsg);
				}
			} catch (e) {
				console.error('Failed to parse WebSocket message:', e);
			}
		};
	} catch (error) {
		console.error('Failed to establish WebSocket:', error);
		set('disconnected');
		scheduleReconnect();
	}
};

const scheduleReconnect = () => {
	if (reconnectTimer || !currentUserId) return;
	reconnectTimer = setTimeout(() => {
		reconnectTimer = null;
		if (currentUserId) {
			connect(currentUserId);
		}
	}, 3000);
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

export const socketStore = {
	subscribe,
	connect,
	disconnect,
	onEvent
};
