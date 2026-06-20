<script lang="ts">
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import ReceiptCard from '$lib/components/ReceiptCard.svelte';
	import BudgetBar from '$lib/components/BudgetBarWidget.svelte';
	import { transactionsStore } from '$lib/stores/transactions';
	import { categoriesStore } from '$lib/stores/categories';
	import { formatCurrency } from '$lib/utils/currency';
	import { transactionToReceipt } from '$lib/utils/receipt';
	import { budgetsStore } from '$lib/stores/budgets';
	import { glowTracking, tilt } from '$lib/actions/interactions';
	import '$lib/styles/dashboard.scss';

	const totalMonth = $derived($transactionsStore.items.reduce((sum, txn) => sum + txn.amount, 0));
	const receiptsCount = $derived($transactionsStore.items.length);

	const budgetTotal = $derived($budgetsStore.reduce((sum, b) => sum + b.limitAmount, 0));
	const available = $derived(Math.max(budgetTotal - totalMonth, 0));

	const categorySpentByCat = $derived.by(() => {
		const spentByCat: Record<string, number> = {};
		for (const txn of $transactionsStore.items) {
			const cat = txn.category;
			if (!spentByCat[cat]) spentByCat[cat] = 0;
			spentByCat[cat] += txn.amount;
		}
		return spentByCat;
	});

	const activeCategories = $derived(Object.keys(categorySpentByCat));
</script>

<main class="dashboard">
	<div class="dashboard__wrap">
		<header class="header">
			<p class="header__eyebrow">Facturator.ai Dashboard</p>
			<h1 class="header__title">Resumen financiero</h1>
			<p class="header__sub">Total del mes, presupuesto y recibos recientes.</p>
		</header>

		<section class="dashboard-layout">
			<div class="dashboard-layout__content">
				<div class="metrics">
					<div class="metric" use:glowTracking use:tilt={{ intensity: 5 }}>
						<p class="metric__label">Total mes</p>
						<p class="metric__val">{formatCurrency(totalMonth)}</p>
					</div>
					<div class="metric" use:glowTracking use:tilt={{ intensity: 5 }}>
						<p class="metric__label">Disponible</p>
						<p class="metric__val metric__val--success">{formatCurrency(available)}</p>
					</div>
					<div class="metric" use:glowTracking use:tilt={{ intensity: 5 }}>
						<p class="metric__label">Recibos</p>
						<p class="metric__val">{receiptsCount}</p>
					</div>
				</div>

				<div class="panel bento-card" use:glowTracking>
					<h2 class="panel__title">Por categoría</h2>
					<div class="panel__grid">
						{#if activeCategories.length === 0}
							<p class="message">No hay gastos este mes.</p>
						{:else}
							{#each activeCategories as cat}
								{@const spent = categorySpentByCat[cat]}
								<BudgetBar
									cat={cat}
									label={categoriesStore.getCategoryLabel(cat)}
									{spent}
									limit={$budgetsStore.find((b) => b.category === cat)?.limitAmount ?? 0}
									month=""
								/>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<aside class="sidebar-panel bento-card" use:glowTracking>
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
					{:else if $transactionsStore.items.length === 0}
						<div class="message">No hay transacciones todavía.</div>
					{:else}
						{#each $transactionsStore.items.slice(0, 5) as transaction (transaction.id)}
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
