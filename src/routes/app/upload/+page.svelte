<script lang="ts">
	import UploadDropzone from '$lib/components/UploadDropzone.svelte';
	import { transactionsStore } from '$lib/stores/transactions';
	import type { Receipt } from '$lib/api';
	import '$lib/styles/upload-page.scss';

	function handleUploaded(receipt: Receipt) {
		transactionsStore.addProcessingReceipt(receipt);
		// Note: The websocket will automatically handle transitioning it to done.
	}
</script>

<main class="upload-page">
	<div class="upload-page__wrap">
		<header class="header">
			<p class="header__eyebrow">Facturator.ai</p>
			<h1 class="header__title">Subir recibo</h1>
			<p class="header__sub">Arrastra una imagen y dispara el flujo OCR.</p>
		</header>

		<section class="upload-panel">
			<UploadDropzone onUploaded={handleUploaded} />
		</section>
	</div>
</main>
