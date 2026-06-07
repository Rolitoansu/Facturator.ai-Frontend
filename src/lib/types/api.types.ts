export enum ReceiptStatus {
	Pending = 'pending',
	Processing = 'processing',
	Done = 'done',
	Error = 'error'
}

export interface User {
	id: string;
	email: string;
	passwordHash: string;
	createdAt: string;
}

export interface Receipt {
	id: string;
	userId: string;
	imageUrl: string;
	rawText: string;
	status: ReceiptStatus;
	createdAt: string;
}

export interface Transaction {
	id: string;
	receiptId: string;
	userId: string;
	amount: number;
	merchant: string;
	category: string;
	date: string;
}

export interface Budget {
	id: string;
	userId: string;
	category: string;
	limitAmount: number;
	month: string;
}
