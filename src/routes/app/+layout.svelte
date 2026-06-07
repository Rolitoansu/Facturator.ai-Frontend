<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { socketStore } from '$lib/stores/socket';
	import { NAV_LINKS } from '$lib/constants/navigation';
	import { MONTH_LABEL } from '$lib/constants/app';
	import '$lib/styles/app-layout.scss';

	let { children, data } = $props();

	const activeId = $derived(
		NAV_LINKS.find((l) => page.url.pathname.startsWith(l.href))?.id ?? 'dashboard'
	);

	let isMenuOpen = $state(false);
	let isUserMenuOpen = $state(false);
	let theme = $state<'dark' | 'light'>('dark');

	$effect(() => {
		const storedTheme = localStorage.getItem('theme') as 'dark' | 'light';
		if (storedTheme) {
			theme = storedTheme;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			theme = 'light';
		}
	});

	$effect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	});

	const toggleTheme = () => {
		theme = theme === 'dark' ? 'light' : 'dark';
	};

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};

	const closeMenu = () => {
		isMenuOpen = false;
	};

	const toggleUserMenu = () => {
		isUserMenuOpen = !isUserMenuOpen;
	};

	const closeUserMenu = () => {
		isUserMenuOpen = false;
	};

	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		const container = document.querySelector('.user-container');
		if (container && !container.contains(target)) {
			isUserMenuOpen = false;
		}
	};

	// Derived user fields
	const user = $derived(data?.user);
	const userInitials = $derived.by(() => {
		if (!user?.name) return 'US';
		return user.name
			.split(' ')
			.map((n: string) => n[0])
			.join('')
			.substring(0, 2)
			.toUpperCase();
	});
</script>

<svelte:window onclick={handleClickOutside} />

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
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>

		<nav class="nav">
			{#each NAV_LINKS as item (item.id)}
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

		<div class="user-container">
			<button
				type="button"
				class="user"
				aria-haspopup="true"
				aria-expanded={isUserMenuOpen}
				onclick={toggleUserMenu}
			>
				<div class="user__avatar">{userInitials}</div>
				<div class="user__info">
					<div class="user__name">{user?.name ?? 'Usuario'}</div>
					<div class="user__email">{user?.email ?? 'user@example.com'}</div>
				</div>
				<svg
					class="user__chevron"
					class:user__chevron--open={isUserMenuOpen}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</button>

			{#if isUserMenuOpen}
				<div class="user-menu" role="menu">
					<a
						href={resolve('/app/profile')}
						class="user-menu__item"
						onclick={closeUserMenu}
						role="menuitem"
					>
						<span class="user-menu__icon">👤</span> Mi perfil
					</a>
					<form method="post" action="/login?/logout" class="user-menu__form" role="none">
						<button
							type="submit"
							class="user-menu__item user-menu__item--logout"
							onclick={closeUserMenu}
							role="menuitem"
						>
							<span class="user-menu__icon">🚪</span> Cerrar sesión
						</button>
					</form>
				</div>
			{/if}
		</div>
	</aside>
	<main class="main">
		<header class="topbar">
			<div class="topbar__left">
				<button
					class="menu-btn"
					onclick={toggleMenu}
					aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
				>
					{#if isMenuOpen}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					{:else}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
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
				<button
					type="button"
					class="theme-toggle"
					onclick={toggleTheme}
					aria-label="Cambiar tema de color"
				>
					{#if theme === 'dark'}
						<!-- Moon Icon -->
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
						</svg>
					{:else}
						<!-- Sun Icon -->
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="5"></circle>
							<line x1="12" y1="1" x2="12" y2="3"></line>
							<line x1="12" y1="21" x2="12" y2="23"></line>
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
							<line x1="1" y1="12" x2="3" y2="12"></line>
							<line x1="21" y1="12" x2="23" y2="12"></line>
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
						</svg>
					{/if}
				</button>

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
					{MONTH_LABEL}
				</div>
			</div>
		</header>

		<div class="content">
			{@render children()}
		</div>
	</main>
</div>
