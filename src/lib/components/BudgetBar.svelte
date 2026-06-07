<script lang="ts">
	import BudgetBarWidget from '$lib/components/BudgetBarWidget.svelte';

	interface Props {
		cat: string;
		label: string;
		spent: number;
		limit: number;
		month?: string;
	}

	const props: Props = $props();
</script>

<BudgetBarWidget {...props} />
