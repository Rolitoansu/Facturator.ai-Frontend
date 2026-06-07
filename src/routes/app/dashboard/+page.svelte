<script lang="ts">
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import ReceiptCard from '$lib/components/ReceiptCard.svelte';
	import SpendingChart from '$lib/components/SpendingChart.svelte';
	import BudgetBar from '$lib/components/BudgetBarWidget.svelte';
	import { transactionsStore } from '$lib/stores/transactions';
	import { formatCurrency } from '$lib/utils/currency';
	import { transactionToReceipt } from '$lib/utils/receipt';
	import { mockChartData, mockDashboardCategories } from '$lib/mock/lensledger';
	import { budgetsStore } from '$lib/stores/budgets';
	import '$lib/styles/dashboard.scss';

	const totalMonth = $derived($transactionsStore.items.reduce((sum, txn) => sum + txn.amount, 0));
	const receiptsCount = $derived($transactionsStore.items.length);

	const budgetTotal = $derived($budgetsStore.reduce((sum, b) => sum + b.limitAmount, 0));
	const available = $derived(Math.max(budgetTotal - totalMonth, 0));

	const categorySpentByCat = $derived.by(() => {
		const spentByCat: Record<string, number> = {};
		for (const c of mockDashboardCategories) {
			const num = Number(c.amt.replace('€', '').replace(',', '.'));
			spentByCat[String(c.cat)] = Number.isFinite(num) ? num : 0;
		}
		return spentByCat;
	});
</script>

<main class="dashboard">
	<div class="dashboard__wrap">
		<header class="header">
			<p class="header__eyebrow">LensLedger Dashboard</p>
			<h1 class="header__title">Resumen financiero</h1>
			<p class="header__sub">Total del mes, presupuesto y recibos recientes.</p>
		</header>

		<section class="dashboard-layout">
			<div class="dashboard-layout__content">
				<div class="metrics">
					<div class="metric">
						<p class="metric__label">Total mes</p>
						<p class="metric__val">{formatCurrency(totalMonth)}</p>
					</div>
					<div class="metric">
						<p class="metric__label">Disponible</p>
						<p class="metric__val metric__val--success">{formatCurrency(available)}</p>
					</div>
					<div class="metric">
						<p class="metric__label">Recibos</p>
						<p class="metric__val">{receiptsCount}</p>
					</div>
				</div>

				<SpendingChart data={mockChartData} />

				<div class="panel">
					<h2 class="panel__title">Por categoría</h2>
					<div class="panel__grid">
						{#each mockDashboardCategories as c (c.cat)}
							{@const spent = categorySpentByCat[c.cat as string] ?? 0}
							<BudgetBar
								cat={c.cat}
								label={c.cat}
								{spent}
								limit={$budgetsStore.find((b) => b.category === c.cat)?.limitAmount ?? 1}
								month="Mayo 2026"
							/>
						{/each}
					</div>
				</div>
			</div>

			<aside class="sidebar-panel">
				<div class="sidebar-panel__header">
					<h2 class="sidebar-panel__title">Recibos recientes</h2>
					<span class="sidebar-panel__count">{receiptsCount} items</span>
				</div>

				<div class="receipts">
					{#if $transactionsStore.loading}
						<div class="message">Cargando transacciones...</div>
					{:else if $transactionsStore.error}
						<div class="message message--error">
							Error cargando transacciones: {$transactionsStore.error}
						</div>
					{:else}
						{#each $transactionsStore.items as transaction (transaction.id)}
							{@const receipt = transactionToReceipt(transaction)}
							<div class="receipt">
								<div class="receipt__header">
									<CategoryBadge category={transaction.category} />
									<span class="receipt__date">{transaction.date}</span>
								</div>
								<ReceiptCard {receipt} />
							</div>
						{/each}
					{/if}
				</div>
			</aside>
		</section>
	</div>
</main>
