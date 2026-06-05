<script lang="ts">
	export type SpendingChartItem = { label: string; value: number; color?: string };

	let { data }: { data: SpendingChartItem[] } = $props();

	const max = $derived(Math.max(...data.map((d) => d.value), 1));
</script>

<div class="rounded-lg border border-[#2a2e35] bg-[#181b1f] p-6">
	<div class="flex items-end gap-2" style="height: 120px;">
		{#each data as d (d.label)}
			<div class="flex h-full flex-1 flex-col items-center justify-end gap-2">
				<div class="w-full" style="display:flex; align-items:flex-end; height: 100%;">
					<div
						class="rounded-t-[3px] transition-[height] duration-300"
						style="
							width: 100%;
							height: {Math.max((d.value / max) * 100, 2)}%;
							min-height: 4px;
							background: {d.color ?? 'rgba(74,222,128,0.7)'};
							opacity: 0.8;
						"
					></div>
				</div>
				<span class="font-mono text-[0.6rem] tracking-[0.08em] text-[#5a6170] uppercase">
					{d.label}
				</span>
			</div>
		{/each}
	</div>
</div>
