<script lang="ts">
    import { resolve } from '$app/paths';

    const badges = [
        { label: 'Go 1.22', modifier: 'go' },
        { label: 'SvelteKit 2', modifier: 'svelte' },
        { label: 'Python 3.11', modifier: 'python' },
        { label: 'PostgreSQL', modifier: 'pg' },
        { label: 'Redis', modifier: 'redis' },
        { label: 'EasyOCR', modifier: 'green' },
        { label: 'WebSockets', modifier: 'cyan' },
        { label: 'scikit-learn', modifier: 'amber' }
    ];

    const metrics = [
        { val: '2', label: 'Devs' },
        { val: '10', label: 'Semanas' },
        { val: '5', label: 'Servicios' },
        { val: '3', label: 'Capas ML' }
    ];

    const pitchCards = [
        {
            title: 'Portfolio que se demuestra en 30 segundos',
            body: 'Cualquier reclutador puede ver el funcionamiento real en vivo: subir una foto y ver el resultado procesado. No es un CRUD con UI bonita, es un pipeline de IA funcionando de extremo a extremo.'
        },
        {
            title: 'Stack inusual y diferenciador',
            body: 'Go en el backend + SvelteKit en el frontend es una combinación que aparece muy poco en portfolios junior. Demuestra criterio técnico propio y capacidad de aprender más allá de los caminos más trillados.'
        },
        {
            title: 'ML real, no decorativo',
            body: 'EasyOCR + clasificador scikit-learn no es una demo de "Hello World con TensorFlow". Es un pipeline de inferencia con un modelo entrenado, servido via FastAPI y consumido desde Go.'
        }
    ];
</script>

<svelte:head>
    <title>LensLedger — Project Blueprint</title>
</svelte:head>

<div class="landing-layout">
    <nav class="nav">
        <div class="nav__inner">
            <a class="nav__logo" href={resolve('/')}>
                <span class="nav__logo-dot"></span>LensLedger
            </a>
        </div>
    </nav>

    <header class="hero" id="hero" aria-labelledby="hero-title">
        <div class="hero__glow"></div>
        <div class="container">
            <p class="hero__eyebrow">Portfolio Project · 2026</p>
            <h1 class="hero__title" id="hero-title">Lens<em class="hero__title-emphasis">Ledger</em></h1>
            <p class="hero__sub">
                Aplicación web de gestión de gastos personales con visión por computadora. Sube un recibo, la IA extrae los datos automáticamente y los integra en tu dashboard financiero en tiempo real.
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
    </header>

    <section class="pitch" id="pitch">
        <div class="container">
            <p class="section-label">01 — El Problema</p>
            <h2 class="section-title">¿Por qué LensLedger?</h2>
            
            <div class="pitch__grid">
                <div class="pitch__text">
                    <p class="pitch__desc">
                        La gente no lleva control de sus gastos, no por falta de voluntad, sino porque registrarlos es tedioso. Las apps actuales requieren introducir datos manualmente. LensLedger elimina esa fricción con una sola acción: subir una foto.
                    </p>
                    <p class="pitch__desc pitch__desc--subtle">
                        El usuario fotografía cualquier ticket, recibo o extracto. El sistema procesa la imagen con OCR, extrae importe, comercio, fecha y categoría automáticamente, y lo añade al historial financiero. Cero formularios. Cero importaciones manuales. Cero CSV.
                    </p>
                </div>
                <div class="pitch__cards">
                    {#each pitchCards as card (card.title)}
                        <article class="card">
                            <h3 class="card__title">{card.title}</h3>
                            <p class="card__body">{card.body}</p>
                        </article>
                    {/each}
                </div>
            </div>
        </div>
    </section>
</div>

<style lang="scss">
    $font-serif: 'DM Serif Display', serif;
    $font-mono: 'DM Mono', monospace;
    $font-sans: 'Instrument Sans', sans-serif;

    $color-bg: #0b0d0f;
    $color-bg2: #111316;
    $color-surface: #1e2126;
    $color-border: #2a2e35;
    $color-border2: #353b44;
    
    $color-muted: #5a6170;
    $color-subtle: #8b95a3;
    $color-body: #c8d0da;
    $color-heading: #eef1f5;
    
    $color-accent: #4ade80;
    $color-cyan: #22d3ee;
    $color-amber: #f59e0b;
    $color-go: #00acd7;
    $color-python: #3b82f6;
    $color-svelte: #ff3e00;
    $color-pg: #60a5fa;
    $color-redis: #fca5a5;

    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(1.25rem); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* ── BASE & LAYOUT ── */
    .landing-layout {
        background-color: $color-bg;
        color: $color-body;
        font-family: $font-sans;
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;

        &::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
            opacity: 0.025;
            pointer-events: none;
            z-index: 9999;
        }

        &::after {
            content: '';
            position: fixed;
            inset: 0;
            background-image:
                linear-gradient($color-border 0.0625rem, transparent 0.0625rem),
                linear-gradient(90deg, $color-border 0.0625rem, transparent 0.0625rem);
            background-size: 5rem 5rem;
            opacity: 0.15;
            pointer-events: none;
            z-index: 0;
        }
    }

    .container {
        max-width: 68.75rem;
        margin: 0 auto;
        padding: 0 1.5rem;
        position: relative;
        z-index: 1;

        @media (min-width: 48rem) {
            padding: 0 2rem;
        }
    }

    /* ── TYPOGRAPHY GLOBALS ── */
    .section-label {
        font-family: $font-mono;
        font-size: 0.7rem;
        color: $color-muted;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
    }

    .section-title {
        font-family: $font-serif;
        font-size: clamp(2rem, 4vw, 2.8rem);
        color: $color-heading;
        line-height: 1.15;
        margin: 0 0 1rem 0;
        letter-spacing: -0.02em;
    }

    /* ── NAVIGATION ── */
    .nav {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(11, 13, 15, 0.88);
        backdrop-filter: blur(1rem);
        border-bottom: 0.0625rem solid $color-border;
        padding: 0.75rem 0;

        &__inner {
            max-width: 68.75rem;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__logo {
            font-family: $font-serif;
            font-size: 1.25rem;
            color: $color-heading;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;

            &-dot {
                display: inline-block;
                width: 0.5rem;
                height: 0.5rem;
                background: $color-accent;
                border-radius: 50%;
            }
        }

        &__link {
            color: $color-subtle;
            text-decoration: none;
            font-size: 0.8rem;
            font-family: $font-mono;
            padding: 0.35rem 0.75rem;
            border-radius: 0.25rem;
            transition: all 0.2s ease;

            &:hover, &:focus-visible {
                color: $color-heading;
                background: $color-surface;
                outline: none;
            }
        }
    }

    .hero {
        padding: 5rem 0;
        position: relative;
        overflow: hidden;

        @media (min-width: 48rem) {
            padding: 7rem 0 6rem;
        }

        &__glow {
            position: absolute;
            width: 37.5rem;
            height: 37.5rem;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(74, 222, 128, 0.06) 0%, transparent 70%);
            top: -6.25rem;
            right: -9.375rem;
            pointer-events: none;
            z-index: 0;
        }

        &__eyebrow {
            font-family: $font-mono;
            font-size: 0.72rem;
            color: $color-accent;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: fadeUp 0.5s ease both;

            &::before {
                content: '';
                display: inline-block;
                width: 2rem;
                height: 0.0625rem;
                background: $color-accent;
            }
        }

        &__title {
            font-family: $font-serif;
            font-size: clamp(3.5rem, 8vw, 6.5rem);
            color: $color-heading;
            letter-spacing: -0.02em;
            margin: 0 0 1.5rem 0;
            line-height: 1;
            animation: fadeUp 0.5s ease 0.1s both;

            &-emphasis {
                font-style: italic;
                color: $color-accent;
            }
        }

        &__sub {
            font-size: 1.15rem;
            color: $color-subtle;
            max-width: 36.25rem;
            margin: 0 0 3rem 0;
            line-height: 1.8;
            animation: fadeUp 0.5s ease 0.2s both;
        }

        &__badges {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 0 0 3rem 0;
            padding: 0;
            list-style: none;
            animation: fadeUp 0.5s ease 0.3s both;
        }

        &__metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.0625rem;
            background: $color-border;
            border: 0.0625rem solid $color-border;
            border-radius: 0.5rem;
            overflow: hidden;
            max-width: 37.5rem;
            animation: fadeUp 0.5s ease 0.4s both;

            @media (min-width: 48rem) {
                grid-template-columns: repeat(4, 1fr);
            }
        }

        &__actions {
            margin: 0 0 3rem 0;
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
            animation: fadeUp 0.5s ease 0.35s both;

            &-text {
                font-size: 0.875rem;
                color: $color-muted;
                max-width: 20rem;
                margin: 0;
            }
        }

        &__button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.25rem;
            border: 0.0625rem solid $color-accent;
            background: rgba(74, 222, 128, 0.1);
            padding: 0.75rem 1.25rem;
            font-family: $font-mono;
            font-size: 0.75rem;
            letter-spacing: 0.24em;
            color: $color-accent;
            text-transform: uppercase;
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;

            &:hover, &:focus-visible {
                background: rgba(74, 222, 128, 0.2);
                transform: translateY(-0.125rem);
            }
            
            &:active {
                transform: translateY(0);
            }
        }
    }

    .metric {
        background: $color-bg2;
        padding: 1.25rem 1.5rem;

        &__val {
            font-family: $font-serif;
            font-size: 1.8rem;
            color: $color-heading;
            line-height: 1;
        }

        &__label {
            font-family: $font-mono;
            font-size: 0.68rem;
            color: $color-muted;
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
        border: 0.0625rem solid;

        &--go { background: rgba($color-go, 0.1); color: $color-go; border-color: rgba($color-go, 0.3); }
        &--svelte { background: rgba($color-svelte, 0.1); color: $color-svelte; border-color: rgba($color-svelte, 0.3); }
        &--python { background: rgba($color-python, 0.1); color: $color-python; border-color: rgba($color-python, 0.3); }
        &--pg { background: rgba(51, 103, 145, 0.1); color: $color-pg; border-color: rgba(51, 103, 145, 0.3); }
        &--redis { background: rgba(220, 56, 45, 0.1); color: $color-redis; border-color: rgba(220, 56, 45, 0.3); }
        &--green { background: rgba($color-accent, 0.1); color: $color-accent; border-color: rgba($color-accent, 0.3); }
        &--cyan { background: rgba($color-cyan, 0.1); color: $color-cyan; border-color: rgba($color-cyan, 0.3); }
        &--amber { background: rgba($color-amber, 0.1); color: $color-amber; border-color: rgba($color-amber, 0.3); }
    }

    .pitch {
        padding: 5rem 0;
        position: relative;
        z-index: 1;

        &__grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;

            @media (min-width: 64rem) {
                grid-template-columns: 1fr 1fr;
            }
        }

        &__text {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        &__desc {
            color: $color-subtle;
            font-size: 1.05rem;
            line-height: 1.8;
            margin: 0;

            &--subtle {
                font-size: 0.9rem;
            }
        }

        &__cards {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    }

    .card {
        background: $color-bg2;
        border: 0.0625rem solid $color-border;
        border-radius: 0.625rem;
        padding: 1.5rem;
        transition: border-color 0.2s, transform 0.2s;

        &:hover {
            border-color: $color-border2;
            transform: translateY(-0.125rem);
        }

        &__title {
            font-family: $font-serif;
            font-size: 1.1rem;
            color: $color-heading;
            margin: 0 0 0.5rem 0;
        }

        &__body {
            color: $color-subtle;
            font-size: 0.9rem;
            line-height: 1.75;
            margin: 0;
        }
    }
</style>