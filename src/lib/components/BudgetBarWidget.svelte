<script lang="ts">
    import CategoryBadge from '$lib/components/CategoryBadge.svelte';

    export interface BudgetBarProps {
        cat: string;
        label: string;
        spent: number;
        limit: number;
        month?: string;
    }

    const { cat, label, spent, limit, month = 'Mes actual' }: BudgetBarProps = $props();

    const stats = $derived.by(() => {
        const pct = limit > 0 ? (spent / limit) : 0;
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

    const formatCurrency = (val: number) => val.toFixed(2);
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
                <span class="budget-bar__spent">{formatCurrency(spent)}</span>
                <span class="budget-bar__limit">/ {formatCurrency(limit)} EUR</span>
            </p>
            <p class="budget-bar__pct">{stats.pctDisplay}% del límite</p>
        </div>
        
    </header>

    <div class="budget-bar__track">
        <div 
            class="budget-bar__fill" 
            style="width: {stats.progressWidth}%;"
        ></div>
    </div>

    {#if stats.isOver}
        <div class="budget-bar__alert budget-bar__alert--danger">
            <span class="budget-bar__alert-icon" aria-hidden="true">🚨</span>
            Superado por {stats.diffAmount} EUR
        </div>
    {:else if stats.isWarning}
        <div class="budget-bar__alert budget-bar__alert--warning">
            <span class="budget-bar__alert-icon" aria-hidden="true">⚠️</span>
            Queda el {100 - stats.pctDisplay}% (alerta > 80%)
        </div>
    {/if}
</article>

<style lang="scss">
    $font-serif: 'DM Serif Display', serif;
    $font-mono: 'DM Mono', monospace;

    $color-bg-card: #1e2126;
    $color-bg-track: #111316;
    $color-border: #2a2e35;
    
    $color-text-main: #c8d0da;
    $color-text-light: #eef1f5;
    $color-text-muted: #8b95a3;
    $color-text-darker: #5a6170;

    $color-success: #4ade80;
    $color-warning: #f59e0b;
    $color-danger: #f87171;

    .budget-bar {
        container-type: inline-size;
        
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        border-left: 0.25rem solid transparent;
        background-color: $color-bg-card;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        transition: border-color 0.2s ease;

        @media (min-width: 48rem) {
            padding: 1.25rem;
        }

        &--success {
            border-left-color: rgba($color-success, 0.7);
            .budget-bar__fill { background-color: $color-success; }
        }
        
        &--warning {
            border-left-color: rgba($color-warning, 0.7);
            .budget-bar__fill { background-color: $color-warning; }
        }
        
        &--danger {
            border-left-color: rgba($color-danger, 0.7);
            .budget-bar__fill { background-color: $color-danger; }
        }

        &__header {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1rem;

            @container (min-width: 24rem) {
                flex-direction: row;
                align-items: flex-start;
                justify-content: space-between;
            }
        }

        &__info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
            min-width: 0;

            @container (min-width: 24rem) {
                width: auto;
                flex: 1;
            }
        }

        &__badge-wrap {
            flex-shrink: 0;
        }

        &__meta {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        &__title {
            margin: 0;
            font-family: $font-mono;
            font-size: 0.65rem;
            letter-spacing: 0.15em;
            color: $color-text-muted;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &__month {
            margin: 0.25rem 0 0 0;
            font-family: $font-mono;
            font-size: 0.65rem;
            color: $color-text-darker;
            white-space: nowrap;
        }

        &__stats {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            width: 100%;

            @container (min-width: 24rem) {
                align-items: flex-end;
                text-align: right;
                width: auto;
                flex-shrink: 0;
            }
        }

        &__amounts {
            margin: 0;
            font-family: $font-mono;
            white-space: nowrap;
        }

        &__spent {
            font-size: 1rem;
            color: $color-text-light;
            font-weight: 500;

            @container (min-width: 24rem) {
                font-size: 1.15rem;
            }
        }

        &__limit {
            font-size: 0.85rem;
            color: $color-text-main;

            @container (min-width: 24rem) {
                font-size: 1rem;
            }
        }

        &__pct {
            margin: 0.25rem 0 0 0;
            font-family: $font-mono;
            font-size: 0.65rem;
            color: $color-text-muted;
        }

        &__track {
            width: 100%;
            height: 0.375rem;
            background-color: $color-bg-track;
            border-radius: 9999px;
            overflow: hidden;
        }

        &__fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        &__alert {
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            border: 0.0625rem solid transparent;
            font-family: $font-mono;
            font-size: 0.7rem;

            &-icon {
                font-size: 0.8rem;
            }

            &--warning {
                background-color: rgba($color-warning, 0.05);
                border-color: rgba($color-warning, 0.2);
                color: $color-warning;
            }

            &--danger {
                background-color: rgba($color-danger, 0.05);
                border-color: rgba($color-danger, 0.2);
                color: $color-danger;
            }
        }
    }
</style>