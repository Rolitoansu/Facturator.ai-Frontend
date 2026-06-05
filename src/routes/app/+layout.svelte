<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { onDestroy } from 'svelte';

	let { children } = $props();

	import { socketStore } from '$lib/stores/socket';

	const links = [
		{ id: 'dashboard', label: 'Dashboard', icon: '▦', href: '/app/dashboard' },
		{ id: 'upload', label: 'Subir recibo', icon: '⊕', href: '/app/upload' },
		{ id: 'history', label: 'Historial', icon: '≡', href: '/app/history' },
		{ id: 'budget', label: 'Presupuesto', icon: '◎', href: '/app/budget' }
	];

	const activeId = derived(page, ($p) => {
		const path = $p.url.pathname;
		const match = links.find((l) => path.startsWith(l.href));
		return match?.id ?? 'dashboard';
	});

	let wsStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
	const unsub = socketStore.subscribe((s) => {
		wsStatus = s;
	});

	const monthLabel = 'Mayo 2026';

	onDestroy(() => unsub());
</script>

<svelte:head>
	<title>LensLedger</title>
</svelte:head>

<div
	style="
		display: flex;
		height: 100vh;
		overflow: hidden;
		position: relative;
		z-index: 1;
	"
>
	<!-- Sidebar -->
	<div
		style="
			width: 220px;
			flex-shrink: 0;
			background: #111316;
			border-right: 1px solid #2a2e35;
			display: flex;
			flex-direction: column;
			padding: 1.5rem 1rem;
			position: relative;
			z-index: 1;
		"
	>
		<!-- Logo -->
		<div
			style="
				font-family: 'DM Serif Display', serif;
				font-size: 1.15rem;
				color: #eef1f5;
				margin-bottom: 2.5rem;
				display: flex;
				align-items: center;
				gap: 0.5rem;
				padding-left: 0.5rem;
			"
		>
			<div style="width: 8px; height: 8px; border-radius: 50%; background: #4ade80;"></div>
			LensLedger
		</div>

		<!-- Nav -->
		<nav style="display: flex; flex-direction: column; gap: 0.2rem; flex: 1;">
			{#each links as item (item.id)}
				<button
					type="button"
					onclick={() => window.location.assign(item.href)}
					style="
						display: flex;
						align-items: center;
						gap: 0.75rem;
						padding: 0.55rem 0.75rem;
						border-radius: 6px;
						border: {$activeId === item.id ? '1px solid rgba(74,222,128,0.2)' : '1px solid transparent'};
						background: {$activeId === item.id ? 'rgba(74,222,128,0.08)' : 'transparent'};
						color: {$activeId === item.id ? '#4ade80' : '#5a6170'};
						font-size: 0.85rem;
						font-weight: {$activeId === item.id ? 600 : 400};
						transition: all 0.15s;
						cursor: pointer;
						text-align: left;
						text-decoration: none;
					"
				>
					<span style="font-family: monospace; font-size: 0.9rem; opacity: 0.8">{item.icon}</span>
					{item.label}
				</button>
			{/each}
		</nav>

		<!-- User (mock) -->
		<div
			style="
				border-top: 1px solid #2a2e35;
				padding-top: 1rem;
				margin-top: 1rem;
				display: flex;
				align-items: center;
				gap: 0.75rem;
			"
		>
			<div
				style="
					width: 32px;
					height: 32px;
					border-radius: 50%;
					background: linear-gradient(135deg, rgba(74,222,128,0.3), rgba(34,211,238,0.3));
					border: 1px solid #353b44;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 0.8rem;
					color: #4ade80;
					font-weight: 700;
					font-family: 'DM Mono', monospace;
				"
			>
				IV
			</div>
			<div>
				<div style="font-size: 0.8rem; color: #eef1f5; font-weight: 600;">Ivan</div>
				<div style="font-family: 'DM Mono', monospace; font-size: 0.65rem; color: #5a6170;">
					ivan@hiberus.com
				</div>
			</div>
		</div>
	</div>

	<!-- Main -->
	<div style="flex: 1; overflow: auto; display: flex; flex-direction: column;">
		<!-- Topbar -->
		<div
			style="
				background: rgba(11, 13, 15, 0.8);
				backdrop-filter: blur(12px);
				border-bottom: 1px solid #2a2e35;
				padding: 0.75rem 1.75rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: sticky;
				top: 0;
				z-index: 10;
				flex-shrink: 0;
			"
		>
			<div style="font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #5a6170;">
				lensledger.app/{$activeId}
			</div>

			<div style="display: flex; align-items: center; gap: 1rem;">
				<!-- WS indicator (mock) -->
				<div style="display: flex; align-items: center; gap: 0.4rem;">
					<div
						style="
							width: 6px;
							height: 6px;
							border-radius: 50%;
							background: #4ade80;
							animation: wsStatus === 'connected' ? 'pulse 2s ease infinite' : 'none';
						"
					></div>
					<span style="font-family: 'DM Mono', monospace; font-size: 0.65rem; color: #5a6170;">
						ws:{wsStatus}
					</span>
				</div>

				<!-- Month -->
				<div
					style="
						font-family: 'DM Mono', monospace;
						font-size: 0.72rem;
						padding: 0.25rem 0.65rem;
						border-radius: 4px;
						border: 1px solid #353b44;
						color: #8b95a3;
						background: #1e2126;
					"
				>
					{monthLabel}
				</div>
			</div>
		</div>

		<div style="flex: 1; padding: 2rem 2rem; overflow: auto;">
			{@render children()}
		</div>
	</div>
</div>
