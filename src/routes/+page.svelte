<script lang="ts">
    import { resolve } from '$app/paths';

	const badges = [
        { label: 'EasyOCR', modifier: 'green' },
        { label: 'WebSockets', modifier: 'cyan' },
        { label: 'SvelteKit 2', modifier: 'svelte' },
        { label: 'Go 1.22', modifier: 'go' }
    ];

    const metrics = [
        { val: '2', label: 'Devs' },
        { val: '10', label: 'Semanas' },
        { val: '5', label: 'Servicios' },
        { val: '3', label: 'Capas ML' }
    ];
</script>

<section class="hero" id="hero" aria-labelledby="hero-title">
    <div class="hero__wrap">
        <p class="hero__eyebrow">Portfolio Project · 2026</p>
        <h1 class="hero__title" id="hero-title">Lens<em class="hero__title-emphasis">Ledger</em></h1>
        <p class="hero__sub">
            Aplicación web de gestión de gastos personales con visión por computadora. Sube un recibo, la
            IA extrae los datos automáticamente e integra tu dashboard financiero en tiempo real.
        </p>

        <ul class="hero__badges" aria-label="Tecnologías utilizadas">
            {#each badges as badge (badge.label)}
                <li>
                    <span class="badge badge--{badge.modifier}">{badge.label}</span>
                </li>
            {/each}
        </ul>

        <div class="hero__actions">
            <a href={resolve('/login')} class="hero__button">
                Entrar
            </a>
            <p class="hero__actions-text">
                Mock de UI (login protegido) listo para conectar backend después.
            </p>
        </div>

        <div class="hero__metrics">
            {#each metrics as metric (metric.label)}
                <div class="metric">
                    <div class="metric__val">{metric.val}</div>
                    <div class="metric__label">{metric.label}</div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    $font-serif: 'DM Serif Display', serif;
    $font-mono: 'DM Mono', monospace;

    $color-green: #4ade80;
    $color-cyan: #22d3ee;
    $color-svelte: #ff3e00;
    $color-go: #00acd7;
    $color-muted: #8b95a3;
    $color-border-dark: #2a2e35;
    $color-bg-metric: #111316;
    $color-text-light: #eef1f5;
    $color-text-metric-label: #5a6170;

    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(1.25rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero {
        padding: 7rem 0 6rem;
        position: relative;
        overflow: hidden;

        &__wrap {
            max-width: 68.75rem;
            margin: 0 auto;
            padding: 0 2rem;
            position: relative;
        }

        &__eyebrow {
            font-family: $font-mono;
            font-size: 0.72rem;
            color: $color-green;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        &__title {
            font-family: $font-serif;
            font-weight: 700;
            font-size: clamp(3.5rem, 8vw, 6.5rem);
            letter-spacing: -0.02em;
            margin-bottom: 1.5rem;
            line-height: 1;
            animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;

            &-emphasis {
                font-style: italic;
                color: $color-green;
            }
        }

        &__sub {
            font-size: 1.15rem;
            color: $color-muted;
            max-width: 36.25rem;
            margin-bottom: 3rem;
            line-height: 1.8;
        }

        &__badges {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 3rem;
            padding: 0;
            list-style: none;
        }

        &__actions {
            margin-top: 2.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;

            &-text {
                font-size: 0.875rem;
                color: $color-muted;
                max-width: 20rem;
            }
        }

        &__button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            border: 0.0625rem solid $color-green;
            background: rgba($color-green, 0.1);
            padding: 0.75rem 1.25rem;
            font-family: $font-mono;
            font-size: 0.75rem;
            letter-spacing: 0.24em;
            color: $color-green;
            text-transform: uppercase;
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;

            &:hover, &:focus-visible {
                background: rgba($color-green, 0.2);
                transform: translateY(-2px);
            }
            
            &:active {
                transform: translateY(0);
            }
        }

        &__metrics {
            margin-top: 3rem;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.0625rem;
            background: $color-border-dark;
            border: 0.0625rem solid $color-border-dark;
            border-radius: 0.5rem;
            overflow: hidden;
            max-width: 37.5rem;

            @media (max-width: 48rem) {
                grid-template-columns: 1fr 1fr;
                max-width: unset;
            }
        }
    }

    .metric {
        background: $color-bg-metric;
        padding: 1.25rem 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;

        &__val {
            font-family: $font-serif;
            font-size: 1.8rem;
            color: $color-text-light;
            line-height: 1;
        }
        
        &__label {
            font-family: $font-mono;
            font-size: 0.68rem;
            color: $color-text-metric-label;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-top: 0.3rem;
        }
    }

    .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.3rem 0.8rem;
        border-radius: 0.25rem;
        font-family: $font-mono;
        font-size: 0.75rem;
        font-weight: 500;
        border: 0.0625rem solid rgba(42, 46, 53, 1);

        &--green {
            background: rgba($color-green, 0.1);
            color: $color-green;
            border-color: rgba($color-green, 0.3);
        }
        &--cyan {
            background: rgba($color-cyan, 0.1);
            color: $color-cyan;
            border-color: rgba($color-cyan, 0.3);
        }
        &--svelte {
            background: rgba($color-svelte, 0.1);
            color: $color-svelte;
            border-color: rgba($color-svelte, 0.3);
        }
        &--go {
            background: rgba($color-go, 0.1);
            color: $color-go;
            border-color: rgba($color-go, 0.3);
        }
    }
</style>