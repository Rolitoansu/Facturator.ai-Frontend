<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Facturator.ai</title>
</svelte:head>

{@render children()}
