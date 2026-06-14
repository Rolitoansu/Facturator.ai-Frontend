import { writable, get } from 'svelte/store';
import {
	getCategories as fetchCategories,
	createCategory as apiCreateCategory
} from '$lib/api/categories';
import type { CategoryAPI } from '$lib/api/categories';

export interface Category {
	id: string;
	slug: string;
	label: string;
	color: string;
	isGlobal: boolean;
}

const createCategoriesStore = () => {
	const { subscribe, set, update } = writable<Category[]>([]);
	let loaded = false;

	const load = async () => {
		if (loaded) return;
		try {
			const cats = await fetchCategories();
			set(
				cats.map((c: CategoryAPI) => ({
					id: c.id,
					slug: c.slug,
					label: c.label,
					color: c.color,
					isGlobal: c.userId === null
				}))
			);
			loaded = true;
		} catch (err) {
			console.error('Error loading categories:', err);
		}
	};

	const addCategory = async (label: string, color: string): Promise<string> => {
		try {
			const created = await apiCreateCategory(label, color);
			update((cats) => {
				if (cats.some((c) => c.slug === created.slug)) return cats;
				return [
					...cats,
					{
						id: created.id,
						slug: created.slug,
						label: created.label,
						color: created.color,
						isGlobal: false
					}
				];
			});
			return created.slug;
		} catch (err) {
			console.error('Error creating category:', err);
			throw err;
		}
	};

	const getCategoryColor = (slug: string): string => {
		const cats = get({ subscribe });
		const cat = cats.find((c) => c.slug === slug);
		return cat ? cat.color : '#888888';
	};

	const getCategoryLabel = (slug: string): string => {
		const cats = get({ subscribe });
		const cat = cats.find((c) => c.slug === slug);
		return cat ? cat.label : slug;
	};

	return {
		subscribe,
		reload: load,
		addCategory,
		getCategoryColor,
		getCategoryLabel,
		set
	};
};

export const categoriesStore = createCategoriesStore();
