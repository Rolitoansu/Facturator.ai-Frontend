<script lang="ts">
	import BudgetBarWidget from '$lib/components/BudgetBarWidget.svelte';

	const { cat, label, spent, limit, month } = $props<{
		cat: string;
		label: string;
		spent: number;
		limit: number;
		month?: string;
	}>();
</script>

<BudgetBarWidget {cat} {label} {spent} {limit} {month} />
