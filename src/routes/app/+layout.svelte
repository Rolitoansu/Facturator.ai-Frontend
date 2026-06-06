<script lang="ts">
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import { socketStore } from '$lib/stores/socket';

    let { children } = $props();

    const links = [
        { id: 'dashboard', label: 'Dashboard', icon: '▦', href: '/app/dashboard' },
        { id: 'upload', label: 'Subir recibo', icon: '⊕', href: '/app/upload' },
        { id: 'history', label: 'Historial', icon: '≡', href: '/app/history' },
        { id: 'budget', label: 'Presupuesto', icon: '◎', href: '/app/budget' }
    ] as const;

    const activeId = $derived(
        links.find((l) => page.url.pathname.startsWith(l.href))?.id ?? 'dashboard'
    );

    const monthLabel = 'Mayo 2026';

    let isMenuOpen = $state(false);

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
    };

    const closeMenu = () => {
        isMenuOpen = false;
    };
</script>

<svelte:head>
    <title>LensLedger</title>
</svelte:head>

<div class="layout" class:layout--locked={isMenuOpen}>
    {#if isMenuOpen}
        <div 
            class="overlay" 
            role="button" 
            tabindex="0" 
            onclick={closeMenu} 
            onkeydown={(e) => e.key === 'Escape' && closeMenu()}
            aria-label="Cerrar menú"
        ></div>
    {/if}
    <aside class="sidebar" class:sidebar--open={isMenuOpen}>
		<div class="sidebar__brand">
			LensLedger
			<button class="close-btn" onclick={closeMenu} aria-label="Cerrar menú">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>

		<nav class="nav">
			{#each links as item (item.id)}
				<a
					href={resolve(item.href)}
					class="nav__link"
					class:nav__link--active={activeId === item.id}
					onclick={closeMenu}
				>
					<span class="nav__icon">{item.icon}</span>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="user">
			<div class="user__avatar">IV</div>
			<div class="user__info">
				<div class="user__name">Ivan</div>
				<div class="user__email">ivan@hiberus.com</div>
			</div>
		</div>
	</aside>
    <main class="main">
        <header class="topbar">
            <div class="topbar__left">
				<button class="menu-btn" onclick={toggleMenu} aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>
					{#if isMenuOpen}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					{/if}
				</button>
                <div class="topbar__path">
                    lensledger.app/{activeId}
                </div>
            </div>

            <div class="topbar__actions">
                <div class="ws-status">
                    <div 
                        class="ws-status__dot" 
                        class:ws-status__dot--connected={$socketStore === 'connected'}
                    ></div>
                    <span class="ws-status__label">
                        ws:{$socketStore}
                    </span>
                </div>

                <div class="month-badge">
                    {monthLabel}
                </div>
            </div>
        </header>

        <div class="content">
            {@render children()}
        </div>
    </main>
</div>

<style lang="scss">
    $font-serif: 'DM Serif Display', serif;
    $font-mono: 'DM Mono', monospace;

    $color-green: #4ade80;
    $color-green-light: rgba(74, 222, 128, 0.08);
    $color-green-border: rgba(74, 222, 128, 0.2);
    $color-cyan-alpha: rgba(34, 211, 238, 0.3);
    
    $color-bg-dark: #111316;
    $color-bg-blur: rgba(11, 13, 15, 0.8);
    $color-bg-badge: #1e2126;
    $color-border: #2a2e35;
    $color-border-avatar: #353b44;
    
    $color-text-light: #eef1f5;
    $color-text-muted: #5a6170;
    $color-text-badge: #8b95a3;

    @keyframes pulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 0.375rem rgba(74, 222, 128, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
    }

    .layout {
        display: flex;
        height: 100dvh;
        overflow: hidden;
        position: relative;
        z-index: 1;

		&--locked {
			overflow: hidden;
			height: 100dvh;
    	}
    }

    .overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(0.25rem);
        z-index: 90;

        @media (min-width: 64rem) {
            display: none;
        }
    }

    .sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 16rem;
        background: $color-bg-dark;
        border-right: 0.0625rem solid $color-border;
        display: flex;
        flex-direction: column;
        padding: 1.5rem 1rem;
        z-index: 100;
        transform: translateX(-100%);
        transition: transform 0.3s ease;

        &--open {
            transform: translateX(0);
        }

        @media (min-width: 64rem) {
            position: relative;
            transform: translateX(0);
            width: 13.75rem;
            flex-shrink: 0;
            z-index: 1;
        }

        &__brand {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: $font-serif;
            font-size: 1.15rem;
            color: $color-text-light;
            margin-bottom: 2.5rem;
            padding-left: 0.5rem;
            gap: 0.5rem;

			@media (min-width: 64rem) {
				padding-left: 0;
			}
        }

        &__logo {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background: $color-green;
        }
    }

	.close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: $color-text-muted;
        padding: 0.25rem;
        cursor: pointer;
        
        svg { width: 1.25rem; height: 1.25rem; }

        @media (min-width: 64rem) {
            display: none;
        }
    }

    .nav {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        flex: 1;

        &__link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.55rem 0.75rem;
            border-radius: 0.375rem;
            border: 0.0625rem solid transparent;
            background: transparent;
            color: $color-text-muted;
            font-size: 0.85rem;
            font-weight: 400;
            transition: all 0.15s ease;
            text-decoration: none;

            &:hover {
                color: $color-text-light;
                background: rgba(255, 255, 255, 0.03);
            }

            &--active {
                border-color: $color-green-border;
                background: $color-green-light;
                color: $color-green;
                font-weight: 600;

                &:hover {
                    background: $color-green-light;
                    color: $color-green;
                }
            }
        }

        &__icon {
            font-family: monospace;
            font-size: 0.9rem;
            opacity: 0.8;
        }
    }

    .user {
        border-top: 0.0625rem solid $color-border;
        padding-top: 1rem;
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        &__avatar {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(74, 222, 128, 0.3), $color-cyan-alpha);
            border: 0.0625rem solid $color-border-avatar;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            color: $color-green;
            font-weight: 700;
            font-family: $font-mono;
        }

        &__name {
            font-size: 0.8rem;
            color: $color-text-light;
            font-weight: 600;
        }

        &__email {
            font-family: $font-mono;
            font-size: 0.65rem;
            color: $color-text-muted;
        }
    }

    .main {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .topbar {
        background: $color-bg-blur;
        backdrop-filter: blur(0.75rem);
        border-bottom: 0.0625rem solid $color-border;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 10;
        flex-shrink: 0;

        @media (min-width: 64rem) {
            padding: 0.75rem 1.75rem;
        }

        &__left {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        &__path {
            font-family: $font-mono;
            font-size: 0.72rem;
            color: $color-text-muted;
            display: none;

            @media (min-width: 30rem) {
                display: block;
            }
        }

        &__actions {
            display: flex;
            align-items: center;
            gap: 0.75rem;

            @media (min-width: 64rem) {
                gap: 1rem;
            }
        }
    }

    .menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: $color-text-light;
        padding: 0.25rem;
        cursor: pointer;

        svg {
            width: 1.5rem;
            height: 1.5rem;
        }

        @media (min-width: 64rem) {
            display: none;
        }
    }

    .ws-status {
        display: flex;
        align-items: center;
        gap: 0.4rem;

        &__dot {
            width: 0.375rem;
            height: 0.375rem;
            border-radius: 50%;
            background: $color-text-muted;

            &--connected {
                background: $color-green;
                animation: pulse 2s ease infinite;
            }
        }

        &__label {
            font-family: $font-mono;
            font-size: 0.65rem;
            color: $color-text-muted;
        }
    }

    .month-badge {
        font-family: $font-mono;
        font-size: 0.72rem;
        padding: 0.25rem 0.65rem;
        border-radius: 0.25rem;
        border: 0.0625rem solid $color-border-avatar;
        color: $color-text-badge;
        background: $color-bg-badge;
    }

    .content {
        flex: 1;
        padding: 1rem;
        overflow: auto;

        @media (min-width: 64rem) {
            padding: 2rem;
        }
    }
</style>