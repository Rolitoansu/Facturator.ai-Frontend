<script lang="ts">
    export interface CategoryBadgeProps {
        category: string;
    }

    const validCategories = new Set([
        'alimentacion',
        'transporte',
        'ropa',
        'ocio',
        'salud',
        'hogar',
        'suscripciones'
    ]);

    const normalizeCategory = (value: string) =>
        value
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const formatLabel = (value: string) => value.trim().replace(/[_-]+/g, ' ') || 'otros';

    const { category }: CategoryBadgeProps = $props();

    const label = $derived(formatLabel(category || ''));
    
    const modifier = $derived.by(() => {
        const normalized = normalizeCategory(category || 'otros');
        return validCategories.has(normalized) ? normalized : 'default';
    });
</script>

<span class:badge--default={modifier === 'default'} class={`badge--${modifier}`}>
    {label}
</span>

<style lang="scss">
    $font-mono: 'DM Mono', monospace;

    $color-bg-default: #1e2126;
    $color-text-default: #8b95a3;
    $color-border-default: #2a2e35;

    $category-colors: (
        'alimentacion': #4ade80,
        'transporte': #22d3ee,
        'ropa': #f87171,
        'ocio': #f59e0b,
        'salud': #60a5fa,
        'hogar': #a78bfa,
        'suscripciones': #ff3e00
    );

    .badge {
        display: inline-flex;
        align-items: center;
        border-radius: 9999px;
        border: 0.0625rem solid $color-border-default;
        background-color: $color-bg-default;
        padding: 0.25rem 0.625rem;
        font-family: $font-mono;
        font-size: 0.68rem;
        font-weight: 500;
        color: $color-text-default;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        white-space: nowrap;

        @each $name, $color in $category-colors {
            &--#{$name} {
                background-color: rgba($color, 0.1);
                color: $color;
                border-color: rgba($color, 0.3);
            }
        }
    }
</style>