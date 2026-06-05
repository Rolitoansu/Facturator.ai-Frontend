<script lang="ts">
	import BudgetBar from '$lib/components/BudgetBarWidget.svelte';
	import type { Budget } from '$lib/api';
	import { mockBudgets } from '$lib/mock/lensledger';

	const monthLabel = 'Mayo 2026';

	// Mock: mostrar budgets del mes usando data fija
	const budgetsForMonth = mockBudgets.filter((b) => b.month.startsWith('2026-05'));

	// Mock: spent placeholder proporcional (para mostrar UI de progreso)
	// Si luego agregas spent real, reemplaza esto por una agregación desde transactions.
	const spentByCat: Record<string, number> = {
		alimentacion: 220,
		transporte: 95,
		ocio: 120
	};

	function catLabel(cat: Budget['category']) {
		// Normalización para UI
		if (cat === 'alimentacion') return 'alimentación';
		return cat;
	}
</script>

<main class="min-h-screen bg-[#0b0d0f] px-6 py-10 text-[#c8d0da]">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
		<header class="flex flex-col gap-2">
			<p class="font-mono text-[0.7rem] tracking-[0.36em] text-[#5a6170] uppercase">LensLedger</p>
			<h1 class="font-serif text-3xl text-[#eef1f5]">Presupuesto</h1>
			<p class="text-sm text-[#8b95a3]">Barras de progreso por categoría (mock).</p>
		</header>

		<section class="rounded-xl border border-[#2a2e35] bg-[#111316] p-5">
			<h2 class="mb-4 text-sm font-semibold text-[#eef1f5]">{monthLabel}</h2>

			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each budgetsForMonth as b (b.id)}
					<BudgetBar
						cat={b.category}
						label={catLabel(b.category)}
						spent={spentByCat[b.category] ?? Math.round(b.limitAmount * 0.6)}
						limit={b.limitAmount}
						month={monthLabel}
					/>
				{/each}
			</div>
		</section>
	</div>
</main>
