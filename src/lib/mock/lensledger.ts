import { ReceiptStatus, type Budget, type Receipt, type Transaction } from '$lib/api';

export const MONTH_LABEL = 'Mayo 2026';

export const mockChartData = [
	{ label: 'Nov', value: 980, color: 'rgba(255,62,0,0.7)' },
	{ label: 'Dic', value: 1420, color: 'rgba(74,222,128,0.7)' },
	{ label: 'Ene', value: 860, color: 'rgba(59,130,246,0.7)' },
	{ label: 'Feb', value: 1100, color: 'rgba(245,158,11,0.7)' },
	{ label: 'Mar', value: 1350, color: 'rgba(167,139,250,0.7)' },
	{ label: 'Abr', value: 920, color: 'rgba(34,211,238,0.7)' },
	{ label: 'May', value: 1284, color: 'rgba(74,222,128,0.7)' }
];

export const mockBudgets: Budget[] = [
	{
		id: 'bdg_1f4e2210',
		userId: 'user_9f2b7d6a',
		category: 'alimentacion',
		limitAmount: 350,
		month: '2026-05-01'
	},
	{
		id: 'bdg_9c2d7a3e',
		userId: 'user_9f2b7d6a',
		category: 'transporte',
		limitAmount: 120,
		month: '2026-05-01'
	},
	{
		id: 'bdg_3f9a0a5b',
		userId: 'user_9f2b7d6a',
		category: 'ocio',
		limitAmount: 180,
		month: '2026-05-01'
	}
];

export const mockHistoryReceipts: Array<{
	merchant: string;
	category: string;
	amount: string;
	date: string;
	status: 'done' | 'processing' | 'pending' | 'error';
}> = [
	{
		merchant: 'Mercadona',
		category: 'alimentacion',
		amount: '€67,40',
		date: '31/05',
		status: 'done'
	},
	{
		merchant: 'Renfe AVE',
		category: 'transporte',
		amount: '€43,50',
		date: '30/05',
		status: 'done'
	},
	{
		merchant: 'El Corte Inglés',
		category: 'ropa',
		amount: '€129,00',
		date: '29/05',
		status: 'done'
	},
	{
		merchant: 'Farmacia Cruz Verde',
		category: 'salud',
		amount: '€18,90',
		date: '28/05',
		status: 'done'
	},
	{ merchant: 'Zara', category: 'ropa', amount: '€59,95', date: '27/05', status: 'done' },
	{ merchant: 'Uber', category: 'transporte', amount: '€12,30', date: '27/05', status: 'done' },
	{ merchant: 'Netflix', category: 'ocio', amount: '€15,99', date: '26/05', status: 'done' },
	{ merchant: 'Consum', category: 'alimentacion', amount: '€45,20', date: '25/05', status: 'done' },
	{ merchant: 'IKEA', category: 'hogar', amount: '€89,00', date: '24/05', status: 'done' },
	{
		merchant: 'Clínica dental',
		category: 'salud',
		amount: '€120,00',
		date: '23/05',
		status: 'done'
	},
	{ merchant: 'Spotify', category: 'ocio', amount: '€9,99', date: '22/05', status: 'done' },
	{ merchant: 'Correos Express', category: 'otros', amount: '€7,50', date: '21/05', status: 'done' }
];

export const mockRecentTransactions: Transaction[] = [
	{
		id: 'txn_84f9d2a1',
		receiptId: 'rcpt_4c19c3d1',
		userId: 'user_9f2b7d6a',
		amount: 67.4,
		merchant: 'Mercadona',
		category: 'alimentacion',
		date: '2026-05-31'
	},
	{
		id: 'txn_3a7b1d92',
		receiptId: 'rcpt_7b8a11f0',
		userId: 'user_9f2b7d6a',
		amount: 43.5,
		merchant: 'Renfe AVE',
		category: 'transporte',
		date: '2026-05-30'
	},
	{
		id: 'txn_63b9c0f4',
		receiptId: 'rcpt_2a9930bb',
		userId: 'user_9f2b7d6a',
		amount: 129,
		merchant: 'El Corte Ingles',
		category: 'ropa',
		date: '2026-05-29'
	}
];

export const mockRecentReceipts: Receipt[] = mockRecentTransactions.map((t) => ({
	id: t.receiptId,
	userId: t.userId,
	imageUrl: '',
	rawText: `${t.merchant}\nTOTAL ${t.amount.toFixed(2)} EUR\n${t.date}`,
	status: ReceiptStatus.Done,
	createdAt: `${t.date}T00:00:00.000Z`
}));

export const mockDashboardCategories = [
	{ cat: 'alimentación', pct: 35, amt: '€449', color: 'rgba(74,222,128,0.7)' },
	{ cat: 'ropa', pct: 22, amt: '€282', color: 'rgba(255,62,0,0.7)' },
	{ cat: 'transporte', pct: 18, amt: '€231', color: 'rgba(34,211,238,0.7)' },
	{ cat: 'ocio', pct: 12, amt: '€154', color: 'rgba(245,158,11,0.7)' },
	{ cat: 'salud', pct: 8, amt: '€103', color: 'rgba(167,139,250,0.7)' },
	{ cat: 'otros', pct: 5, amt: '€65', color: 'rgba(90,97,112,0.7)' }
];

export const receiptStatusLabel = (status: ReceiptStatus) => {
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
