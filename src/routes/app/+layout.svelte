<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { socketStore } from '$lib/stores/socket';
	import { transactionsStore } from '$lib/stores/transactions';
	import { categoriesStore } from '$lib/stores/categories';
	import { budgetsStore } from '$lib/stores/budgets';
	import { NAV_LINKS } from '$lib/constants/navigation';
	import { MONTH_LABEL } from '$lib/constants/app';
	import { enhance } from '$app/forms';
	import { User, LogOut } from 'lucide-svelte';
	import '$lib/styles/app-layout.scss';

	let { children, data } = $props();

	const activeId = $derived(
		NAV_LINKS.find((l) => page.url.pathname.startsWith(l.href))?.id ?? 'dashboard'
	);

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

	// Connect/disconnect real WebSocket and fetch initial data when user changes
	$effect(() => {
		if (user?.id) {
			socketStore.connect(user.id);
			transactionsStore.reload();
			categoriesStore.reload();
			budgetsStore.reload();
		} else {
			socketStore.disconnect();
		}
	});
</script>

<svelte:window onclick={handleClickOutside} />

<svelte:head>
	<title>Facturator.ai</title>
</svelte:head>

<div class="layout">
	<!-- TOPBAR -->
	<header class="topbar">
		<div class="topbar__left">
			<a href={resolve('/app/dashboard')} class="topbar__brand">
				<span class="topbar__dot"></span>Facturator.ai
			</a>
			<div class="topbar__path">
				/app/{activeId}
			</div>
		</div>

		<div class="topbar__right">
			<div class="ws-status">
				<div class="ws-status__dot" class:ws-status__dot--connected={$socketStore === 'connected'}></div>
			</div>
			
			<div class="month-badge">
				{MONTH_LABEL}
			</div>

			<button type="button" class="theme-toggle" onclick={toggleTheme} aria-label="Cambiar tema de color">
				{#if theme === 'dark'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
				{/if}
			</button>

			<div class="user-container">
				<button type="button" class="user-btn" aria-haspopup="true" aria-expanded={isUserMenuOpen} onclick={toggleUserMenu}>
					{userInitials}
				</button>

				{#if isUserMenuOpen}
					<div class="user-menu" role="menu">
						<div class="user-menu__info">
							<strong>{user?.name ?? 'Usuario'}</strong>
							<span>{user?.email ?? 'user@example.com'}</span>
						</div>
						<div class="user-menu__divider"></div>
						<a href={resolve('/app/profile')} class="user-menu__item" onclick={closeUserMenu} role="menuitem">
							<span class="user-menu__icon"><User size={16} /></span> Mi perfil
						</a>
						<form method="post" action="/login?/logout" use:enhance class="user-menu__form" role="none">
							<button type="submit" class="user-menu__item user-menu__item--logout" role="menuitem">
								<span class="user-menu__icon"><LogOut size={16} /></span> Cerrar sesión
							</button>
						</form>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<main class="main">
		<div class="content">
			{@render children()}
		</div>
	</main>

	<!-- FLOATING DOCK -->
	<nav class="dock">
		{#each NAV_LINKS as item (item.id)}
			{@const Icon = item.icon}
			<a
				href={resolve(item.href)}
				class="dock__link"
				class:dock__link--active={activeId === item.id}
				title={item.label}
			>
				{#if activeId === item.id}
					<div class="dock__indicator" style="view-transition-name: dock-indicator"></div>
				{/if}
				<span class="dock__icon">
					<Icon size={22} strokeWidth={2.5} />
				</span>
				<span class="dock__label">{item.label}</span>
			</a>
		{/each}
	</nav>
</div>
