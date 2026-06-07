import { writable, get } from 'svelte/store';
import { VALID_CATEGORIES, CATEGORY_COLORS } from '$lib/constants/categories';

export interface Category {
	id: string;
	label: string;
	color: string;
}

const generateDefaultCategories = (): Category[] => {
	return Array.from(VALID_CATEGORIES).map((cat) => ({
		id: cat,
		label: cat === 'alimentacion' ? 'alimentación' : cat,
		color: CATEGORY_COLORS[cat] || '#888888'
	}));
};

const createCategoriesStore = () => {
	const { subscribe, set, update } = writable<Category[]>(generateDefaultCategories());

	const addCategory = (label: string, color: string) => {
		const id = label
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]/g, '_');

		update((cats) => {
			if (cats.some((c) => c.id === id)) return cats;
			return [...cats, { id, label, color }];
		});

		return id;
	};

	const getCategoryColor = (id: string): string => {
		const cats = get({ subscribe });
		const cat = cats.find((c) => c.id === id);
		return cat ? cat.color : '#888888';
	};

	const getCategoryLabel = (id: string): string => {
		const cats = get({ subscribe });
		const cat = cats.find((c) => c.id === id);
		return cat ? cat.label : id;
	};

	return {
		subscribe,
		addCategory,
		getCategoryColor,
		getCategoryLabel,
		set
	};
};

export const categoriesStore = createCategoriesStore();
