<script lang="ts">
	import { mockHistoryReceipts } from '$lib/mock/lensledger';
	import { STATUS_MAP, receiptStatusLabel } from '$lib/constants/receipt-status';
	import { VALID_CATEGORIES, catLabel } from '$lib/constants/categories';
	import '$lib/styles/history.scss';

	// State variables
	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let sortBy = $state('date-desc');
	let currentPage = $state(1);
	const itemsPerPage = 5;

	// Helpers
	const labelForMock = (s: (typeof mockHistoryReceipts)[number]['status']) => {
		const status = STATUS_MAP[s];
		if (!status) return 'error';
		return receiptStatusLabel(status);
	};

	const parseAmount = (amtStr: string): number => {
		const cleaned = amtStr.replace(/[€\s]/g, '').replace(',', '.');
		const parsed = parseFloat(cleaned);
		return isNaN(parsed) ? 0 : parsed;
	};

	const parseDate = (dateStr: string): number => {
		const [day, month] = dateStr.split('/').map(Number);
		// We assume 2026 as reference year matching constants/app.ts
		return new Date(2026, month - 1, day).getTime();
	};

	// Derived filtered list
	const filteredReceipts = $derived.by(() => {
		return mockHistoryReceipts.filter((receipt) => {
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
			list.sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));
		} else if (sortBy === 'amount-asc') {
			list.sort((a, b) => parseAmount(a.amount) - parseAmount(b.amount));
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
			<p class="header__eyebrow">LensLedger</p>
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
							{#each Array.from(VALID_CATEGORIES) as cat (cat)}
								<option value={cat}>{catLabel(cat)}</option>
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
					{#each paginatedReceipts as r (r.merchant + r.date + r.amount)}
						<article class="receipt-item">
							<div class="receipt-item__details">
								<p class="receipt-item__merchant" title={r.merchant}>{r.merchant}</p>
								<p class="receipt-item__amount">{r.amount}</p>
								<p class="receipt-item__meta">
									{catLabel(r.category)} · {r.date}
								</p>
							</div>
							<div class="receipt-item__status">
								<p class="receipt-item__status-label">estado</p>
								<p class="receipt-item__status-value">{labelForMock(r.status)}</p>
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
</main>
