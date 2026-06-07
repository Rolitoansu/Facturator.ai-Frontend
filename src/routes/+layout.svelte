<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import './layout.css';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>LensLedger</title>
</svelte:head>

{@render children()}
