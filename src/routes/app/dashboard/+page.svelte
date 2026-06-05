<script lang="ts">
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import ReceiptCard from '$lib/components/ReceiptCard.svelte';
	import SpendingChart from '$lib/components/SpendingChart.svelte';
	import BudgetBar from '$lib/components/BudgetBarWidget.svelte';
	import { ReceiptStatus, type Receipt } from '$lib/api';
	import { transactionsStore } from '$lib/stores/transactions';
	import type { TransactionItem } from '$lib/stores/transactions';
	import { mockChartData, mockBudgets, mockDashboardCategories } from '$lib/mock/lensledger';

	const formatCurrency = (value: number) =>
		`EUR ${value.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})}`;

	const toReceipt = (transaction: TransactionItem): Receipt => {
		const rawText =
			transaction.status === ReceiptStatus.Done
				? `${transaction.merchant}\nTOTAL ${transaction.amount.toFixed(2)} EUR\n${transaction.date}`
				: '';

		return {
			id: transaction.receiptId,
			userId: transaction.userId,
			imageUrl: '',
			rawText,
			status: transaction.status,
			createdAt: `${transaction.date}T00:00:00.000Z`
		};
	};

	const totalMonth = $derived($transactionsStore.items.reduce((sum, txn) => sum + txn.amount, 0));
	const receiptsCount = $derived($transactionsStore.items.length);

	const budgetTotal = $derived(mockBudgets.reduce((sum, b) => sum + b.limitAmount, 0));
	const available = $derived(Math.max(budgetTotal - totalMonth, 0));

	// Svelte doesn't like mutable built-in Map in derived; use plain object instead.
	const categorySpentByCat = $derived(() => {
		const spentByCat: Record<string, number> = {};
		for (const c of mockDashboardCategories) {
			const num = Number(c.amt.replace('€', '').replace(',', '.'));
			spentByCat[String(c.cat)] = Number.isFinite(num) ? num : 0;
		}
		return spentByCat;
	});
</script>

<main class="min-h-screen bg-[#0b0d0f] px-6 py-10 text-[#c8d0da]">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
		<header class="flex flex-col gap-2">
			<p class="font-mono text-[0.7rem] tracking-[0.36em] text-[#5a6170] uppercase">
				LensLedger Dashboard
			</p>
			<h1 class="font-serif text-3xl text-[#eef1f5]">Resumen financiero</h1>
			<p class="text-sm text-[#8b95a3]">Total del mes, presupuesto y recibos recientes.</p>
		</header>

		<section class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
			<div class="flex flex-col gap-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div class="rounded-lg border border-[#2a2e35] bg-[#1e2126] px-4 py-3">
						<p class="font-mono text-[0.62rem] tracking-[0.28em] text-[#8b95a3] uppercase">
							Total mes
						</p>
						<p class="mt-2 font-serif text-2xl text-[#eef1f5]">{formatCurrency(totalMonth)}</p>
					</div>
					<div class="rounded-lg border border-[#2a2e35] bg-[#1e2126] px-4 py-3">
						<p class="font-mono text-[0.62rem] tracking-[0.28em] text-[#8b95a3] uppercase">
							Disponible
						</p>
						<p class="mt-2 font-serif text-2xl text-[#4ade80]">{formatCurrency(available)}</p>
					</div>
					<div class="rounded-lg border border-[#2a2e35] bg-[#1e2126] px-4 py-3">
						<p class="font-mono text-[0.62rem] tracking-[0.28em] text-[#8b95a3] uppercase">
							Recibos
						</p>
						<p class="mt-2 font-serif text-2xl text-[#eef1f5]">{receiptsCount}</p>
					</div>
				</div>

				<SpendingChart data={mockChartData} />

				<div class="rounded-lg border border-[#2a2e35] bg-[#1e2126] p-6">
					<h2 class="mb-4 text-sm font-semibold text-[#eef1f5]">Por categoría</h2>
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
						{#each mockDashboardCategories as c (c.cat)}
							{@const spent = categorySpentByCat()[c.cat as string] ?? 0}
							<BudgetBar
								cat={c.cat}
								label={c.cat}
								spent={spent}
								limit={mockBudgets.find((b) => b.category === c.cat)?.limitAmount ?? 1}
								month="Mayo 2026"
							/>
						{/each}
					</div>
				</div>
			</div>

			<aside class="rounded-lg border border-[#2a2e35] bg-[#111316] p-4">
				<div class="flex items-center justify-between">
					<h2 class="text-sm font-semibold text-[#eef1f5]">Recibos recientes</h2>
					<span class="font-mono text-[0.6rem] tracking-[0.3em] text-[#5a6170] uppercase">
						{receiptsCount} items
					</span>
				</div>

				<div class="mt-4 flex flex-col gap-3">
					{#if $transactionsStore.loading}
						<div
							class="rounded-lg border border-[#2a2e35] bg-[#1e2126] px-4 py-6 text-xs text-[#8b95a3]"
						>
							Cargando transacciones...
						</div>
					{:else if $transactionsStore.error}
						<div
							class="rounded-lg border border-[#2a2e35] bg-[#1e2126] px-4 py-6 font-mono text-xs text-[#f87171]"
						>
							Error cargando transacciones: {$transactionsStore.error}
						</div>
					{:else}
						{#each $transactionsStore.items as transaction (transaction.id)}
							{@const receipt = toReceipt(transaction)}
							<div class="flex flex-col gap-2">
								<div class="flex items-center justify-between">
									<CategoryBadge category={transaction.category} />
									<span class="font-mono text-[0.6rem] tracking-[0.28em] text-[#5a6170] uppercase">
										{transaction.date}
									</span>
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
