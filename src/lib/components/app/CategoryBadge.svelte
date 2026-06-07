<script lang="ts">
	import type { CategoryBadgeProps } from '$lib/types/ui.types';
	import {
		VALID_CATEGORIES,
		normalizeCategory,
		formatCategoryLabel
	} from '$lib/constants/categories';
	import '$lib/styles/CategoryBadge.scss';

	const { category }: CategoryBadgeProps = $props();

	const label = $derived(formatCategoryLabel(category || ''));

	const modifier = $derived.by(() => {
		const normalized = normalizeCategory(category || 'otros');
		return VALID_CATEGORIES.has(normalized as never) ? normalized : 'default';
	});
</script>

<span class="badge badge--{modifier}">
	{label}
</span>
