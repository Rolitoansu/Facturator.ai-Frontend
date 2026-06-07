<script lang="ts">
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import type { BudgetBarProps } from '$lib/types/ui.types';
	import { formatAmount } from '$lib/utils/currency';
	import { AlertCircle, AlertTriangle } from 'lucide-svelte';
	import '$lib/styles/BudgetBarWidget.scss';

	const { cat, label, spent, limit, month = 'Mes actual' }: BudgetBarProps = $props();

	const stats = $derived.by(() => {
		const pct = limit > 0 ? spent / limit : 0;
		const isOver = spent > limit;
		const diffAmount = Math.abs(spent - limit).toFixed(2);

		let statusModifier = 'success';
		if (isOver) {
			statusModifier = 'danger';
		} else if (pct >= 0.8) {
			statusModifier = 'warning';
		}

		return {
			pctDisplay: Math.round(pct * 100),
			progressWidth: Math.min(pct * 100, 100),
			isOver,
			isWarning: !isOver && pct >= 0.8,
			diffAmount,
			statusModifier
		};
	});
</script>

<article class="budget-bar budget-bar--{stats.statusModifier}">
	<header class="budget-bar__header">
		<div class="budget-bar__info">
			<div class="budget-bar__badge-wrap">
				<CategoryBadge category={cat} />
			</div>
			<div class="budget-bar__meta">
				<h3 class="budget-bar__title" title={label}>{label}</h3>
				<p class="budget-bar__month">{month}</p>
			</div>
		</div>

		<div class="budget-bar__stats">
			<p class="budget-bar__amounts">
				<span class="budget-bar__spent">{formatAmount(spent)}</span>
				<span class="budget-bar__limit">/ {formatAmount(limit)} EUR</span>
			</p>
			<p class="budget-bar__pct">{stats.pctDisplay}% del límite</p>
		</div>
	</header>

	<div class="budget-bar__track">
		<div class="budget-bar__fill" style="width: {stats.progressWidth}%;"></div>
	</div>

	{#if stats.isOver}
		<div class="budget-bar__alert budget-bar__alert--danger" style="display:flex; align-items:center; gap:0.4rem;">
			<span class="budget-bar__alert-icon" aria-hidden="true"><AlertCircle size={16} /></span>
			Superado por {stats.diffAmount} EUR
		</div>
	{:else if stats.isWarning}
		<div class="budget-bar__alert budget-bar__alert--warning" style="display:flex; align-items:center; gap:0.4rem;">
			<span class="budget-bar__alert-icon" aria-hidden="true"><AlertTriangle size={16} /></span>
			Queda el {100 - stats.pctDisplay}% (alerta > 80%)
		</div>
	{/if}
</article>
