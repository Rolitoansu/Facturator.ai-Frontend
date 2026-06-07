<script lang="ts">
	import type { CategoryBadgeProps } from '$lib/types/ui.types';
	import { categoriesStore } from '$lib/stores/categories';
	import '$lib/styles/CategoryBadge.scss';

	const { category }: CategoryBadgeProps = $props();

	const label = $derived(categoriesStore.getCategoryLabel(category || ''));
	const color = $derived(categoriesStore.getCategoryColor(category || 'otros'));
</script>

<span 
	class="badge" 
	style="background-color: {color}1A; color: {color}; border-color: {color}4D;"
>
	{label}
</span>
