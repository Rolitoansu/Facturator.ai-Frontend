<script lang="ts">
    import BudgetBar from '$lib/components/BudgetBarWidget.svelte';
    import type { Budget } from '$lib/api';
    import { mockBudgets } from '$lib/mock/lensledger';

    const monthLabel = 'Mayo 2026';

    const budgetsForMonth = mockBudgets.filter((b) => b.month.startsWith('2026-05'));

    const spentByCat: Record<string, number> = {
        alimentacion: 220,
        transporte: 95,
        ocio: 120
    };

    function catLabel(cat: Budget['category']) {
        if (cat === 'alimentacion') return 'alimentación';
        return cat;
    }
</script>

<main class="budget-page">
    <div class="budget-page__wrap">
        <header class="header">
            <p class="header__eyebrow">LensLedger</p>
            <h1 class="header__title">Presupuesto</h1>
            <p class="header__sub">Barras de progreso por categoría (mock).</p>
        </header>

        <section class="card">
            <h2 class="card__title">{monthLabel}</h2>

            <div class="card__grid">
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

<style lang="scss">
    $font-serif: 'DM Serif Display', serif;
    $font-mono: 'DM Mono', monospace;

    $color-bg-main: #0b0d0f;
    $color-bg-card: #111316;
    $color-border: #2a2e35;
    
    $color-text-main: #c8d0da;
    $color-text-light: #eef1f5;
    $color-text-muted: #8b95a3;
    $color-text-eyebrow: #5a6170;

    .budget-page {
        min-height: 100vh;
        background-color: $color-bg-main;
        padding: 1.5rem 1rem;
        color: $color-text-main;

        @media (min-width: 48rem) {
            padding: 2.5rem 1.5rem;
        }

        &__wrap {
            margin: 0 auto;
            display: flex;
            width: 100%;
            max-width: 72rem;
            flex-direction: column;
            gap: 1.5rem;
        }
    }

    .header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &__eyebrow {
            font-family: $font-mono;
            font-size: 0.7rem;
            letter-spacing: 0.36em;
            color: $color-text-eyebrow;
            text-transform: uppercase;
            margin: 0;
        }

        &__title {
            font-family: $font-serif;
            font-size: 1.5rem;
            color: $color-text-light;
            margin: 0;

            @media (min-width: 48rem) {
                font-size: 1.875rem;
            }
        }

        &__sub {
            font-size: 0.875rem;
            color: $color-text-muted;
            margin: 0;
        }
    }

    .card {
        border-radius: 0.75rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 1rem;

        @media (min-width: 48rem) {
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

            @media (min-width: 48rem) {
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
        }
    }
</style>