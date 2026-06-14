import type { Receipt } from './api.types';
import type { SpendingChartItem } from './chart.types';

export interface BudgetBarProps {
	cat: string;
	label: string;
	spent: number;
	limit: number;
	month?: string;
}

export interface CategoryBadgeProps {
	category: string;
}

export interface ReceiptCardProps {
	receipt: Receipt;
}

export interface UploadDropzoneProps {
	onUploaded?: (receipt: Receipt) => void;
}

export interface SpendingChartProps {
	data: SpendingChartItem[];
}
