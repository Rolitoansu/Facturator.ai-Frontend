<script lang="ts">
    import CategoryBadge from '$lib/components/CategoryBadge.svelte';

    interface Props {
        cat: string;
        label: string;
        spent: number;
        limit: number;
        month?: string;
    }

    const { cat, label, spent, limit, month }: Props = $props();

    const pct = $derived(limit > 0 ? spent / limit : 0);
    const pctDisplay = $derived(Math.round(pct * 100));
    const progressWidth = $derived(Math.min(pct * 100, 100));
    
    const isOver = $derived(spent > limit);
    const isWarning = $derived(!isOver && pct >= 0.8);
    const diffAmount = $derived(Math.abs(spent - limit).toFixed(2));
</script>

<article class="budget-widget" class:budget-widget--over={isOver}>
    <header class="budget-widget__header">
        <div class="budget-widget__info">
            <CategoryBadge category={cat} />
            <div class="budget-widget__text">
                <p class="budget-widget__label">{label}</p>
                {#if month}
                    <p class="budget-widget__month">{month}</p>
                {/if}
            </div>
        </div>

        <div class="budget-widget__stats">
            <p class="budget-widget__amounts">{spent.toFixed(2)} / {limit.toFixed(2)} EUR</p>
            <p class="budget-widget__pct">{pctDisplay}% del límite</p>
        </div>
    </header>

    <div class="budget-widget__track" aria-label="budget progress">
        <div
            class="budget-widget__bar"
            class:budget-widget__bar--over={isOver}
            style="width: {progressWidth}%;"
        ></div>
    </div>

    {#if isOver}
        <div class="alert alert--danger">
            <span class="alert__icon">🚨</span>
            <span class="alert__text">
                Superado por {diffAmount} EUR
            </span>
        </div>
    {:else if isWarning}
        <div class="alert alert--warning">
            <span class="alert__icon">⚠️</span>
            <span class="alert__text">
                Queda el {Math.max(0, 100 - pctDisplay)}% (alerta > 80%)
            </span>
        </div>
    {/if}
</article>

<style lang="scss">
    $font-mono: 'DM Mono', monospace;

    $color-bg-card: #1e2126;
    $color-bg-track: #111316;
    $color-border: #2a2e35;

    $color-text-main: #eef1f5;
    $color-text-muted: #8b95a3;
    $color-text-eyebrow: #5a6170;

    $color-success-border: rgba(74, 222, 128, 0.9);
    $color-success-bar: rgba(74, 222, 128, 0.85);

    $color-danger-main: #f87171;
    $color-danger-border: rgba(248, 113, 113, 0.9);
    $color-danger-bar: rgba(248, 113, 113, 0.85);
    $color-danger-bg: rgba(248, 113, 113, 0.1);
    $color-danger-alert-border: rgba(248, 113, 113, 0.3);

    $color-warning-main: #f59e0b;
    $color-warning-bg: rgba(245, 158, 11, 0.1);
    $color-warning-alert-border: rgba(245, 158, 11, 0.3);

    .budget-widget {
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        border-left: 0.1875rem solid $color-success-border;
        background-color: $color-bg-card;
        padding: 1rem;
        transition: border-color 0.3s ease;

        &--over {
            border-left-color: $color-danger-border;
        }

        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
        }

        &__info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
			min-width: 0;
        }

        &__text {
            display: flex;
            flex-direction: column;
        }

        &__label {
            margin: 0;
            font-family: $font-mono;
            font-size: 0.62rem;
            letter-spacing: 0.28em;
            color: $color-text-eyebrow;
            text-transform: uppercase;
        }

        &__month {
            margin: 0.125rem 0 0 0;
            font-family: $font-mono;
            font-size: 0.7rem;
            color: $color-text-muted;
        }

        &__stats {
            text-align: right;
        }

        &__amounts {
            margin: 0;
            font-family: $font-mono;
            font-size: 1rem;
            color: $color-text-main;
        }

        &__pct {
            margin: 0;
            font-family: $font-mono;
            font-size: 0.65rem;
            color: $color-text-muted;
        }

        &__track {
            margin-top: 1rem;
            height: 0.5rem;
            width: 100%;
            overflow: hidden;
            border-radius: 9999px;
            border: 0.0625rem solid $color-border;
            background-color: $color-bg-track;
        }

        &__bar {
            height: 100%;
            border-radius: 9999px;
            background: $color-success-bar;
            transition: width 0.3s ease, background-color 0.3s ease;

            &--over {
                background: $color-danger-bar;
            }
        }
    }

    .alert {
        margin-top: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 0.375rem;
        border: 0.0625rem solid transparent;
        padding: 0.5rem;

        &__icon {
            font-size: 0.875rem;
        }

        &__text {
            font-family: $font-mono;
            font-size: 0.75rem;
        }

        &--danger {
            background-color: $color-danger-bg;
            border-color: $color-danger-alert-border;
            
            .alert__text {
                color: $color-danger-main;
            }
        }

        &--warning {
            background-color: $color-warning-bg;
            border-color: $color-warning-alert-border;
            
            .alert__text {
                color: $color-warning-main;
            }
        }
    }
</style>