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

        <section class="layout">
            <div class="layout__content">
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
                                spent={spent}
                                limit={mockBudgets.find((b) => b.category === c.cat)?.limitAmount ?? 1}
                                month="Mayo 2026"
                            />
                        {/each}
                    </div>
                </div>
            </div>

            <aside class="sidebar">
                <div class="sidebar__header">
                    <h2 class="sidebar__title">Recibos recientes</h2>
                    <span class="sidebar__count">{receiptsCount} items</span>
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
                            {@const receipt = toReceipt(transaction)}
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

<style lang="scss">
    $font-serif: 'DM Serif Display', serif;
    $font-mono: 'DM Mono', monospace;

    $color-bg-main: #0b0d0f;
    $color-bg-sidebar: #111316;
    $color-bg-card: #1e2126;
    $color-border: #2a2e35;
    
    $color-text-main: #c8d0da;
    $color-text-light: #eef1f5;
    $color-text-muted: #8b95a3;
    $color-text-eyebrow: #5a6170;
    
    $color-success: #4ade80;
    $color-error: #f87171;

    .dashboard {
        min-height: 100vh;
        background-color: $color-bg-main;
        padding: 1.5rem 1rem;
        color: $color-text-main;

        @media (min-width: 768px) {
            padding: 2.5rem 1.5rem;
        }

        &__wrap {
            margin: 0 auto;
            display: flex;
            width: 100%;
            max-width: 72rem;
            flex-direction: column;
            gap: 1.25rem;

            @media (min-width: 768px) {
                gap: 1.5rem;
            }
        }
    }

    .header {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        @media (min-width: 768px) {
            gap: 0.5rem;
        }

        &__eyebrow {
            font-family: $font-mono;
            font-size: 0.65rem;
            letter-spacing: 0.36em;
            color: $color-text-eyebrow;
            text-transform: uppercase;
            margin: 0;

            @media (min-width: 768px) {
                font-size: 0.7rem;
            }
        }

        &__title {
            font-family: $font-serif;
            font-size: 1.5rem;
            color: $color-text-light;
            margin: 0;

            @media (min-width: 768px) {
                font-size: 1.875rem;
            }
        }

        &__sub {
            font-size: 0.8rem;
            color: $color-text-muted;
            margin: 0;

            @media (min-width: 768px) {
                font-size: 0.875rem;
            }
        }
    }

    .layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;

        @media (min-width: 768px) {
            gap: 1.5rem;
        }

        @media (min-width: 1280px) {
            grid-template-columns: minmax(0, 2.1fr) minmax(0, 1fr);
        }

        &__content {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;

            @media (min-width: 768px) {
                gap: 1.5rem;
            }
        }
    }

    .metrics {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;

        @media (min-width: 768px) {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }
    }

    .metric {
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 0.75rem 1rem;

        &__label {
            font-family: $font-mono;
            font-size: 0.62rem;
            letter-spacing: 0.28em;
            color: $color-text-muted;
            text-transform: uppercase;
            margin: 0;
        }

        &__val {
            margin: 0.5rem 0 0 0;
            font-family: $font-serif;
            font-size: 1.25rem;

            @media (min-width: 768px) {
                font-size: 1.5rem;
            }

            color: $color-text-light;

            &--success {
                color: $color-success;
            }
        }
    }

    .panel {
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 1rem; // Padding reducido móvil

        @media (min-width: 768px) {
            padding: 1.5rem;
        }

        &__title {
            margin: 0 0 1rem 0;
            font-size: 0.875rem;
            font-weight: 600;
            color: $color-text-light;
        }

        &__grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.75rem;

            @media (min-width: 768px) {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    }

    .sidebar {
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-sidebar;
        padding: 1rem;

        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__title {
            margin: 0;
            font-size: 0.875rem;
            font-weight: 600;
            color: $color-text-light;
        }

        &__count {
            font-family: $font-mono;
            font-size: 0.6rem;
            letter-spacing: 0.3em;
            color: $color-text-eyebrow;
            text-transform: uppercase;
        }
    }

    .receipts {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .receipt {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__date {
            font-family: $font-mono;
            font-size: 0.6rem;
            letter-spacing: 0.28em;
            color: $color-text-eyebrow;
            text-transform: uppercase;
        }
    }

    .message {
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 1.5rem 1rem;
        font-size: 0.75rem;
        color: $color-text-muted;

        &--error {
            font-family: $font-mono;
            color: $color-error;
        }
    }
</style>