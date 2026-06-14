<script lang="ts">
	import BudgetBar from '$lib/components/BudgetBarWidget.svelte';
	import { categoriesStore } from '$lib/stores/categories';
	import { MONTH_LABEL } from '$lib/constants/app';
	import { budgetsStore } from '$lib/stores/budgets';
	import { transactionsStore } from '$lib/stores/transactions';
	import { Plus, Pencil, Trash2, X, AlertTriangle } from 'lucide-svelte';
	import '$lib/styles/budget.scss';

	// Spent per category calculated dynamically
	const spentByCat = $derived.by(() => {
		const spent: Record<string, number> = {};
		for (const txn of $transactionsStore.items) {
			const cat = txn.category;
			spent[cat] = (spent[cat] || 0) + txn.amount;
		}
		return spent;
	});

	// Unused categories (for creating budgets)
	const unusedCategories = $derived.by(() => {
		const activeCats = new Set($budgetsStore.map((b) => b.category));
		return $categoriesStore.filter((cat) => !activeCats.has(cat.id));
	});

	// State for Add Budget
	let isCreateModalOpen = $state(false);
	let newCategory = $state('');
	let newLimit = $state(100);
	let customCategoryName = $state('');
	let customCategoryColor = $state('#60a5fa');

	// State for Edit Budget
	let isEditModalOpen = $state(false);
	let editingBudget = $state<{ id: string; category: string; limitAmount: number } | null>(null);
	let editLimit = $state(100);

	// State for Delete Budget
	let isDeleteModalOpen = $state(false);
	let deletingBudget = $state<{ id: string; category: string } | null>(null);
	let deleteOption = $state<'reassign' | 'delete'>('reassign');
	let reassignCategoryTarget = $state('');

	const txnsCount = $derived.by(() => {
		const budget = deletingBudget;
		if (!budget) return 0;
		return $transactionsStore.items.filter((t) => t.category === budget.category).length;
	});

	const reassignmentOptions = $derived.by(() => {
		const budget = deletingBudget;
		if (!budget) return [];
		return $categoriesStore.filter((cat) => cat.id !== budget.category);
	});

	// Open Add Modal
	const openCreateModal = () => {
		const unused = unusedCategories;
		newCategory = unused.length > 0 ? unused[0].id : 'new_custom';
		newLimit = 100;
		customCategoryName = '';
		isCreateModalOpen = true;
	};

	// Open Edit Modal
	const openEditModal = (budget: { id: string; category: string; limitAmount: number }) => {
		editingBudget = budget;
		editLimit = budget.limitAmount;
		isEditModalOpen = true;
	};

	// Open Delete Modal
	const openDeleteModal = (budget: { id: string; category: string }) => {
		deletingBudget = budget;
		deleteOption = 'reassign';
		const targets = reassignmentOptions;
		reassignCategoryTarget = targets.length > 0 ? targets[0].id : '';
		isDeleteModalOpen = true;
	};

	const handleCreate = async () => {
		const isCustomCategory = newCategory === 'new_custom';
		if (isCustomCategory) {
			if (!customCategoryName || newLimit <= 0) return;
			const id = await categoriesStore.addCategory(customCategoryName, customCategoryColor);
			budgetsStore.addBudget(id, newLimit);
		} else {
			if (!newCategory || newLimit <= 0) return;
			budgetsStore.addBudget(newCategory, newLimit);
		}
		isCreateModalOpen = false;
	};

	const handleEdit = () => {
		if (!editingBudget || editLimit <= 0) return;
		budgetsStore.updateBudget(editingBudget.id, editLimit);
		isEditModalOpen = false;
	};

	const handleDeleteConfirm = () => {
		if (!deletingBudget) return;

		const count = txnsCount;
		if (count > 0) {
			if (deleteOption === 'delete') {
				transactionsStore.deleteTransactionsByCategory(deletingBudget.category);
			} else if (deleteOption === 'reassign' && reassignCategoryTarget) {
				transactionsStore.reassignCategory(deletingBudget.category, reassignCategoryTarget);
			}
		}

		budgetsStore.deleteBudget(deletingBudget.id);
		isDeleteModalOpen = false;
		deletingBudget = null;
	};
</script>

<svelte:head>
	<title>Facturator.ai — Presupuestos</title>
</svelte:head>

<main class="budget-page">
	<div class="budget-page__wrap">
		<header class="header">
			<div class="header__left">
				<p class="header__eyebrow">Facturator.ai</p>
				<h1 class="header__title">Presupuestos</h1>
				<p class="header__sub">
					Gestiona tus límites de gastos mensuales por categoría de forma dinámica.
				</p>
			</div>
			{#if unusedCategories.length > 0}
				<button type="button" class="btn btn--primary" style="display:inline-flex; align-items:center; gap:0.4rem;" onclick={openCreateModal}>
					<Plus size={16} /> Añadir Categoría
				</button>
			{:else}
				<button
					type="button"
					class="btn btn--primary"
					style="display:inline-flex; align-items:center; gap:0.4rem;"
					disabled
					title="Ya has configurado presupuestos para todas las categorías"
				>
					<Plus size={16} /> Añadir Categoría
				</button>
			{/if}
		</header>

		<section class="card">
			<h2 class="card__title">{MONTH_LABEL}</h2>

			{#if $budgetsStore.length === 0}
				<p
					style="color: var(--color-subtle); text-align: center; padding: 2rem 0; font-size: 0.85rem;"
				>
					No hay presupuestos activos. ¡Añade tu primer límite de gastos!
				</p>
			{:else}
				<div class="card__grid">
					{#each $budgetsStore as b (b.id)}
						<div class="card__item">
							<BudgetBar
								cat={b.category}
								label={categoriesStore.getCategoryLabel(b.category)}
								spent={spentByCat[b.category] ?? 0}
								limit={b.limitAmount}
								month={MONTH_LABEL}
							/>
							<div class="card__item-actions">
								<button type="button" class="btn btn--secondary" style="display:inline-flex; align-items:center; gap:0.4rem;" onclick={() => openEditModal(b)}>
									<Pencil size={16} /> Editar
								</button>
								<button
									type="button"
									class="btn btn--outline-danger"
									style="display:inline-flex; align-items:center; gap:0.4rem;"
									onclick={() => openDeleteModal(b)}
								>
									<Trash2 size={16} /> Eliminar
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</main>

<!-- Modal Crear Presupuesto -->
{#if isCreateModalOpen}
	<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="create-modal-title">
		<div class="modal">
			<header class="modal__header">
				<h3 id="create-modal-title" class="modal__title">Añadir Presupuesto</h3>
				<button
					type="button"
					class="btn btn--secondary"
					style="padding: 0.25rem; border: none; background: transparent;"
					onclick={() => (isCreateModalOpen = false)}
				>
					<X size={20} />
				</button>
			</header>
			<div class="modal__body">
				<div class="form-group">
					<label class="form-group__label" for="create-category">Categoría</label>
					<select id="create-category" class="form-group__select" bind:value={newCategory}>
						{#each unusedCategories as cat (cat.id)}
							<option value={cat.id}>{cat.label}</option>
						{/each}
						<option value="new_custom">Crear nueva categoría personalizada...</option>
					</select>
				</div>
				{#if newCategory === 'new_custom'}
					<div class="form-group" style="display: flex; gap: 1rem;">
						<div style="flex: 1;">
							<label class="form-group__label" for="custom-cat-name">Nombre</label>
							<input id="custom-cat-name" type="text" class="form-group__input" bind:value={customCategoryName} placeholder="Ej. Mascotas" required />
						</div>
						<div style="width: 4rem;">
							<label class="form-group__label" for="custom-cat-color">Color</label>
							<input id="custom-cat-color" type="color" class="form-group__input" style="padding: 0; height: 2.5rem; cursor: pointer;" bind:value={customCategoryColor} />
						</div>
					</div>
				{/if}
				<div class="form-group">
					<label class="form-group__label" for="create-limit">Límite (€)</label>
					<input
						id="create-limit"
						type="number"
						class="form-group__input"
						bind:value={newLimit}
						min="1"
						step="5"
					/>
				</div>
			</div>
			<footer class="modal__footer">
				<button
					type="button"
					class="btn btn--secondary"
					onclick={() => (isCreateModalOpen = false)}
				>
					Cancelar
				</button>
				<button
					type="button"
					class="btn btn--primary"
					onclick={handleCreate}
					disabled={newLimit <= 0}
				>
					Guardar
				</button>
			</footer>
		</div>
	</div>
{/if}

<!-- Modal Editar Presupuesto -->
{#if isEditModalOpen && editingBudget}
	<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
		<div class="modal">
			<header class="modal__header">
				<h3 id="edit-modal-title" class="modal__title">Editar Presupuesto</h3>
				<button
					type="button"
					class="btn btn--secondary"
					style="padding: 0.25rem; border: none; background: transparent;"
					onclick={() => (isEditModalOpen = false)}
				>
					<X size={20} />
				</button>
			</header>
			<div class="modal__body">
				<div class="form-group">
					<label class="form-group__label" for="edit-category">Categoría</label>
					<input
						id="edit-category"
						type="text"
						class="form-group__input"
						value={categoriesStore.getCategoryLabel(editingBudget.category)}
						disabled
					/>
				</div>
				<div class="form-group">
					<label class="form-group__label" for="edit-limit">Límite (€)</label>
					<input
						id="edit-limit"
						type="number"
						class="form-group__input"
						bind:value={editLimit}
						min="1"
						step="5"
					/>
				</div>
			</div>
			<footer class="modal__footer">
				<button type="button" class="btn btn--secondary" onclick={() => (isEditModalOpen = false)}>
					Cancelar
				</button>
				<button
					type="button"
					class="btn btn--primary"
					onclick={handleEdit}
					disabled={editLimit <= 0}
				>
					Guardar
				</button>
			</footer>
		</div>
	</div>
{/if}

<!-- Modal Eliminar Presupuesto -->
{#if isDeleteModalOpen && deletingBudget}
	<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
		<div class="modal">
			<header class="modal__header">
				<h3 id="delete-modal-title" class="modal__title">Eliminar Presupuesto</h3>
				<button
					type="button"
					class="btn btn--secondary"
					style="padding: 0.25rem; border: none; background: transparent;"
					onclick={() => (isDeleteModalOpen = false)}
				>
					<X size={20} />
				</button>
			</header>
			<div class="modal__body">
				<p>
					¿Estás seguro de que deseas eliminar el presupuesto de la categoría <strong>
						{categoriesStore.getCategoryLabel(deletingBudget.category)}
					</strong>?
				</p>

				{#if txnsCount > 0}
					<div
						style="border: 0.0625rem solid rgba(248, 113, 113, 0.2); background-color: rgba(248, 113, 113, 0.05); padding: 0.75rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;"
					>
						<span
							style="color: var(--color-danger); font-weight: bold; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; display:flex; align-items:center; gap:0.4rem;"
						>
							<AlertTriangle size={16} /> Advertencia de Facturas
						</span>
						<p style="margin: 0; font-size: 0.8rem;">
							Esta categoría tiene <strong>{txnsCount}</strong> transacciones/recibos asociados en el
							sistema. ¿Qué deseas hacer con ellos?
						</p>

						<div class="radio-group">
							<label class="radio-option" class:radio-option--active={deleteOption === 'reassign'}>
								<input
									type="radio"
									class="radio-option__input"
									name="deleteOption"
									value="reassign"
									bind:group={deleteOption}
								/>
								<div class="radio-option__content">
									<span class="radio-option__title">Reasignar transacciones</span>
									<span class="radio-option__desc"
										>Mueve los gastos a otra categoría existente.</span
									>
								</div>
							</label>

							<label class="radio-option" class:radio-option--active={deleteOption === 'delete'}>
								<input
									type="radio"
									class="radio-option__input"
									name="deleteOption"
									value="delete"
									bind:group={deleteOption}
								/>
								<div class="radio-option__content">
									<span class="radio-option__title">Eliminar transacciones</span>
									<span class="radio-option__desc">
										Elimina de forma permanente las facturas y gastos asociados.
									</span>
								</div>
							</label>
						</div>

						{#if deleteOption === 'reassign'}
							<div class="form-group" style="margin-top: 0.5rem;">
								<label class="form-group__label" for="reassign-category">Nueva Categoría</label>
								<select
									id="reassign-category"
									class="form-group__select"
									bind:value={reassignCategoryTarget}
								>
									{#each reassignmentOptions as cat (cat.id)}
										<option value={cat.id}>{cat.label}</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>
				{/if}
			</div>
			<footer class="modal__footer">
				<button
					type="button"
					class="btn btn--secondary"
					onclick={() => (isDeleteModalOpen = false)}
				>
					Cancelar
				</button>
				<button type="button" class="btn btn--danger" onclick={handleDeleteConfirm}>
					Eliminar Presupuesto
				</button>
			</footer>
		</div>
	</div>
{/if}
