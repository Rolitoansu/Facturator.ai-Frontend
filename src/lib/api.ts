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

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const createId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const mockUserId = 'user_9f2b7d6a';

const mockReceipts: Receipt[] = [
	{
		id: 'rcpt_4c19c3d1',
		userId: mockUserId,
		imageUrl: '/uploads/receipts/mercadona-2026-05-02.jpg',
		rawText: 'MERCADONA\nTOTAL 67,40 EUR\n02/05/2026',
		status: ReceiptStatus.Done,
		createdAt: '2026-05-02T10:14:00.000Z'
	},
	{
		id: 'rcpt_7b8a11f0',
		userId: mockUserId,
		imageUrl: '/uploads/receipts/renfe-2026-05-10.jpg',
		rawText: 'RENFE AVE\nTOTAL 43,50 EUR\n10/05/2026',
		status: ReceiptStatus.Done,
		createdAt: '2026-05-10T18:32:00.000Z'
	},
	{
		id: 'rcpt_2a9930bb',
		userId: mockUserId,
		imageUrl: '/uploads/receipts/el-corte-ingles-2026-05-12.jpg',
		rawText: 'EL CORTE INGLES\nTOTAL 129,00 EUR\n12/05/2026',
		status: ReceiptStatus.Processing,
		createdAt: '2026-05-12T15:08:00.000Z'
	}
];

const mockTransactions: Transaction[] = [
	{
		id: 'txn_84f9d2a1',
		receiptId: 'rcpt_4c19c3d1',
		userId: mockUserId,
		amount: 67.4,
		merchant: 'Mercadona',
		category: 'alimentacion',
		date: '2026-05-02'
	},
	{
		id: 'txn_3a7b1d92',
		receiptId: 'rcpt_7b8a11f0',
		userId: mockUserId,
		amount: 43.5,
		merchant: 'Renfe AVE',
		category: 'transporte',
		date: '2026-05-10'
	},
	{
		id: 'txn_63b9c0f4',
		receiptId: 'rcpt_92c71e10',
		userId: mockUserId,
		amount: 129,
		merchant: 'El Corte Ingles',
		category: 'ropa',
		date: '2026-05-12'
	},
	{
		id: 'txn_0d5f4b80',
		receiptId: 'rcpt_1180ddc2',
		userId: mockUserId,
		amount: 22.9,
		merchant: 'Spotify',
		category: 'suscripciones',
		date: '2026-05-15'
	}
];

const mockBudgets: Budget[] = [
	{
		id: 'bdg_1f4e2210',
		userId: mockUserId,
		category: 'alimentacion',
		limitAmount: 350,
		month: '2026-05-01'
	},
	{
		id: 'bdg_9c2d7a3e',
		userId: mockUserId,
		category: 'transporte',
		limitAmount: 120,
		month: '2026-05-01'
	},
	{
		id: 'bdg_3f9a0a5b',
		userId: mockUserId,
		category: 'ocio',
		limitAmount: 180,
		month: '2026-05-01'
	}
];

export const getCurrentUserMock = (): User => ({
	id: mockUserId,
	email: 'andrea.perez@lensledger.app',
	passwordHash: 'hash_bcrypt_12$Lx0h2a',
	createdAt: '2026-02-14T09:00:00.000Z'
});

export const getReceiptMocks = (): Receipt[] => [...mockReceipts];

export async function uploadReceipt(file: File, userId: string): Promise<Receipt> {
	try {
		if (!userId) {
			throw new Error('userId is required');
		}

		await delay(650);

		const receipt: Receipt = {
			id: createId('rcpt'),
			userId,
			imageUrl: `/uploads/receipts/${encodeURIComponent(file.name)}`,
			rawText: '',
			status: ReceiptStatus.Processing,
			createdAt: new Date().toISOString()
		};

		mockReceipts.unshift(receipt);
		return receipt;
	} catch (error) {
		throw error;
	}
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
	try {
		if (!userId) {
			throw new Error('userId is required');
		}

		await delay(420);
		return mockTransactions.filter((txn) => txn.userId === userId);
	} catch (error) {
		throw error;
	}
}

export async function getBudgets(userId: string): Promise<Budget[]> {
	try {
		if (!userId) {
			throw new Error('userId is required');
		}

		await delay(380);
		return mockBudgets.filter((budget) => budget.userId === userId);
	} catch (error) {
		throw error;
	}
}
