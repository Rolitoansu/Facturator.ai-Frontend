<script lang="ts">
	import UploadDropzone from '$lib/components/UploadDropzone.svelte';
	import { socketStore } from '$lib/stores/socket';
	import { transactionsStore } from '$lib/stores/transactions';
	import { getCurrentUserMock, type Receipt } from '$lib/api';
	import '$lib/styles/upload-page.scss';

	const currentUser = getCurrentUserMock();

	function handleUploaded(receipt: Receipt) {
		transactionsStore.addProcessingReceipt(receipt);
	}
</script>

<main class="upload-page">
	<div class="upload-page__wrap">
		<header class="header">
			<p class="header__eyebrow">LensLedger</p>
			<h1 class="header__title">Subir recibo</h1>
			<p class="header__sub">Arrastra una imagen y dispara el flujo OCR.</p>
		</header>

		<section class="upload-panel">
			<UploadDropzone userId={currentUser.id} onUploaded={handleUploaded} />
		</section>
	</div>
</main>
