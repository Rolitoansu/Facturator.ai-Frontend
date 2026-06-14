<script lang="ts">
	import { transactionsStore } from '$lib/stores/transactions';
	import { STATUS_MAP, receiptStatusLabel } from '$lib/constants/receipt-status';
	import { categoriesStore } from '$lib/stores/categories';
	import type { TransactionItem } from '$lib/types/transactions.types';
	import { CircleAlert } from 'lucide-svelte';
	import '$lib/styles/history.scss';

	// State variables
	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let sortBy = $state('date-desc');
	let currentPage = $state(1);
	const itemsPerPage = 5;

	// Review Modal State
	let reviewModalOpen = $state(false);
	let reviewingTransaction = $state<TransactionItem | null>(null);
	let newReviewCategory = $state('');

	const openReview = (r: TransactionItem) => {
		reviewingTransaction = r;
		newReviewCategory = r.category;
		reviewModalOpen = true;
	};

	const submitReview = async () => {
		if (!reviewingTransaction) return;
		try {
			await transactionsStore.updateTransactionItem(reviewingTransaction.id, {
				category: newReviewCategory,
				needsReview: false
			});
			reviewModalOpen = false;
			reviewingTransaction = null;
		} catch (e) {
			console.error(e);
		}
	};

	// Helpers
	const labelForStatus = (s: string) => {
		const status = STATUS_MAP[s];
		if (!status) return 'error';
		return receiptStatusLabel(status);
	};

	const parseDate = (dateStr: string): number => {
		// Date format from backend is typically "YYYY-MM-DD"
		// If it's a timestamp we can just pass it to Date
		return new Date(dateStr).getTime();
	};

	// Derived filtered list
	const filteredReceipts = $derived.by(() => {
		return $transactionsStore.items.filter((receipt) => {
			const matchesSearch = receipt.merchant.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === 'all' || receipt.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	});

	// Derived sorted list
	const sortedReceipts = $derived.by(() => {
		const list = [...filteredReceipts];
		if (sortBy === 'date-desc') {
			list.sort((a, b) => parseDate(b.date) - parseDate(a.date));
		} else if (sortBy === 'date-asc') {
			list.sort((a, b) => parseDate(a.date) - parseDate(b.date));
		} else if (sortBy === 'amount-desc') {
			list.sort((a, b) => b.amount - a.amount);
		} else if (sortBy === 'amount-asc') {
			list.sort((a, b) => a.amount - b.amount);
		} else if (sortBy === 'name-asc') {
			list.sort((a, b) => a.merchant.localeCompare(b.merchant));
		} else if (sortBy === 'name-desc') {
			list.sort((a, b) => b.merchant.localeCompare(a.merchant));
		}
		return list;
	});

	// Pagination bounds
	const totalPages = $derived(Math.max(Math.ceil(sortedReceipts.length / itemsPerPage), 1));
	const paginatedReceipts = $derived.by(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return sortedReceipts.slice(start, start + itemsPerPage);
	});

	// Reset pagination to 1 when filters or search change
	$effect(() => {
		const items = [searchQuery, selectedCategory, sortBy];
		if (items.length > 0) {
			currentPage = 1;
		}
	});
</script>

<main class="history">
	<div class="history__wrap">
		<header class="header">
			<p class="header__eyebrow">Facturator.ai</p>
			<h1 class="header__title">Historial</h1>
			<p class="header__sub">Listado completo de tus recibos y tickets.</p>
		</header>

		<section class="panel">
			<div class="toolbar">
				<div class="toolbar__search-wrapper">
					<svg
						class="toolbar__search-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					<input
						type="text"
						placeholder="Buscar por comercio..."
						class="toolbar__input"
						bind:value={searchQuery}
					/>
				</div>

				<div class="toolbar__filters">
					<div class="toolbar__select-wrapper">
						<select class="toolbar__select" bind:value={selectedCategory}>
							<option value="all">Todas las categorías</option>
							{#each $categoriesStore as cat (cat.id)}
								<option value={cat.slug}>{cat.label}</option>
							{/each}
						</select>
						<svg
							class="toolbar__select-chevron"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</div>

					<div class="toolbar__select-wrapper">
						<select class="toolbar__select" bind:value={sortBy}>
							<option value="date-desc">Fecha: más reciente</option>
							<option value="date-asc">Fecha: más antiguo</option>
							<option value="amount-desc">Importe: mayor a menor</option>
							<option value="amount-asc">Importe: menor a mayor</option>
							<option value="name-asc">Comercio: A-Z</option>
							<option value="name-desc">Comercio: Z-A</option>
						</select>
						<svg
							class="toolbar__select-chevron"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</div>
				</div>
			</div>

			<div class="panel__list">
				{#if paginatedReceipts.length === 0}
					<div class="message">
						No se encontraron recibos que coincidan con la búsqueda o filtro.
					</div>
				{:else}
					{#each paginatedReceipts as r (r.id)}
						<article class="receipt-item">
							<div class="receipt-item__details">
								<p class="receipt-item__merchant" title={r.merchant}>
									{r.merchant}
									{#if r.needsReview}
										<span class="badge badge--yellow" style="margin-left: 0.5rem; display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.7rem;">
											<CircleAlert size={12} /> IA Dudosa
										</span>
									{/if}
								</p>
								<p class="receipt-item__amount">{r.amount}</p>
								<p class="receipt-item__meta">
									{categoriesStore.getCategoryLabel(r.category)} · {r.date}
								</p>
							</div>
							<div class="receipt-item__status">
								<p class="receipt-item__status-label">estado</p>
								<p class="receipt-item__status-value">
									{labelForStatus(r.status)}
									{#if r.needsReview}
										<button class="btn btn--secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; margin-left: 0.5rem; cursor: pointer;" onclick={() => openReview(r)}>
											Corregir
										</button>
									{/if}
								</p>
							</div>
						</article>
					{/each}
				{/if}
			</div>

			{#if totalPages > 1}
				<div class="pagination">
					<span class="pagination__info">
						Página {currentPage} de {totalPages} ({sortedReceipts.length} items)
					</span>
					<div class="pagination__actions">
						<button
							type="button"
							class="pagination__btn"
							disabled={currentPage === 1}
							onclick={() => (currentPage = Math.max(currentPage - 1, 1))}
						>
							Anterior
						</button>
						<button
							type="button"
							class="pagination__btn"
							disabled={currentPage === totalPages}
							onclick={() => (currentPage = Math.min(currentPage + 1, totalPages))}
						>
							Siguiente
						</button>
					</div>
				</div>
			{/if}
		</section>
	</div>

	<!-- Modal de Revisión -->
	{#if reviewModalOpen && reviewingTransaction}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-overlay" onclick={() => (reviewModalOpen = false)}>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="modal-content" onclick={(e) => e.stopPropagation()}>
				<h3 class="modal-title" style="margin-bottom: 0.5rem; color: var(--color-warning); display: flex; align-items: center; gap: 0.5rem;">
					<CircleAlert size={20} />
					Revisión Requerida
				</h3>
				<p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem;">
					La IA no está completamente segura de la categoría para el comercio <strong>{reviewingTransaction.merchant}</strong> ({reviewingTransaction.amount}€). Por favor, confirma o corrige la categoría para ayudar a entrenar el modelo.
				</p>
				<div class="form-group" style="margin-bottom: 1.5rem;">
					<label class="form-group__label" for="review-category">Categoría Correcta</label>
					<select id="review-category" class="form-group__select" bind:value={newReviewCategory}>
						{#each $categoriesStore as cat (cat.id)}
							<option value={cat.slug}>{cat.label}</option>
						{/each}
					</select>
				</div>
				<div class="modal-actions" style="display: flex; gap: 1rem; justify-content: flex-end;">
					<button class="btn btn--outline" onclick={() => (reviewModalOpen = false)}>Cancelar</button>
					<button class="btn btn--accent" onclick={submitReview}>Confirmar</button>
				</div>
			</div>
		</div>
	{/if}
</main>
