<script lang="ts">
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';

	const { cat, label, spent, limit, month } = $props<{
		cat: string;
		label: string;
		spent: number;
		limit: number;
		month?: string;
	}>();

	const pct = limit > 0 ? spent / limit : 0;
	const pctClamped = Math.max(0, Math.min(pct, 2));
	const isOver = spent > limit;
</script>

<div
	class="rounded-lg border border-[#2a2e35] bg-[#1e2126] p-4"
	style="border-left: 3px solid {isOver ? 'rgba(248,113,113,0.9)' : 'rgba(74,222,128,0.9)'}"
>
	<div class="flex items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<CategoryBadge category={cat} />
			<div>
				<p class="font-mono text-[0.62rem] tracking-[0.28em] text-[#5a6170] uppercase">
					{label}
				</p>
				{#if month}
					<p class="mt-0.5 font-mono text-[0.7rem] text-[#8b95a3]">{month}</p>
				{/if}
			</div>
		</div>

		<div class="text-right">
			<p class="font-mono text-base text-[#eef1f5]">{spent.toFixed(2)} / {limit.toFixed(2)} EUR</p>
			<p class="font-mono text-[0.65rem] text-[#8b95a3]">
				{Math.round(pct * 100)}% del límite
			</p>
		</div>
	</div>

	<div class="mt-4">
		<div
			class="h-2 w-full overflow-hidden rounded-full border border-[#2a2e35] bg-[#111316]"
			aria-label="budget progress"
		>
			<div
				class="h-full rounded-full transition-[width] duration-300"
				style="
					width: {Math.min(pctClamped * 100, 100)}%;
					background: {isOver ? 'rgba(248,113,113,0.85)' : 'rgba(74,222,128,0.85)'};
				"
			></div>
		</div>
	</div>

	{#if isOver}
		<div
			class="mt-3 flex items-center gap-2 rounded-md border border-[#f87171]/30 bg-[#f87171]/10 p-2"
		>
			<span class="text-sm">🚨</span>
			<span class="font-mono text-[0.75rem] text-[#f87171]">
				Superado por {(spent - limit).toFixed(2)} EUR
			</span>
		</div>
	{:else if pct >= 0.8}
		<div
			class="mt-3 flex items-center gap-2 rounded-md border border-[#f59e0b]/30 bg-[#f59e0b]/10 p-2"
		>
			<span class="text-sm">⚠️</span>
			<span class="font-mono text-[0.75rem] text-[#f59e0b]">
				Queda el {Math.max(0, 100 - Math.round(pct * 100))}% (alerta > 80%)
			</span>
		</div>
	{/if}
</div>
