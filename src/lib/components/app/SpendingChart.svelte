<script lang="ts">
	import type { SpendingChartItem } from '$lib/types/chart.types';
	import '$lib/styles/SpendingChart.scss';

	interface Props {
		data: SpendingChartItem[];
	}

	const { data }: Props = $props();

	const max = $derived(Math.max(...data.map((d) => d.value), 1));
</script>

<article class="chart-card">
	<div class="chart" role="list" aria-label="Gráfico de gastos">
		{#each data as d (d.label)}
			{@const percent = Math.max((d.value / max) * 100, 2)}
			<div class="chart__column" role="listitem">
				<div class="chart__track">
					<div
						class="chart__bar"
						style="height: {percent}%; background-color: {d.color ?? 'rgba(74,222,128,0.7)'};"
						title="{d.label}: {d.value}"
						aria-label="Gasto en {d.label}: {d.value}"
					></div>
				</div>
				<span class="chart__label" aria-hidden="true">{d.label}</span>
			</div>
		{/each}
	</div>
</article>
