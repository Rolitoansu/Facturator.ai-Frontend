<script lang="ts">
	import UploadDropzone from '$lib/components/UploadDropzone.svelte';
	import { socketStore } from '$lib/stores/socket';
	import { transactionsStore } from '$lib/stores/transactions';
	import { getCurrentUserMock, type Receipt } from '$lib/api';

	const currentUser = getCurrentUserMock();

	function handleUploaded(receipt: Receipt) {
		// Mock: simular el job de OCR/ML y posterior update por WS
		transactionsStore.addProcessingReceipt(receipt);

		// simulateReceiptProcessed solo necesita receiptId; el store ya actualiza el estado.
		// Se mantiene la firma estricta para evitar `any`.
		socketStore.simulateReceiptProcessed(receipt.id);
	}
</script>

<main class="min-h-screen bg-[#0b0d0f] px-6 py-10 text-[#c8d0da]">
	<div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
		<header class="flex flex-col gap-2">
			<p class="font-mono text-[0.7rem] tracking-[0.36em] text-[#5a6170] uppercase">LensLedger</p>
			<h1 class="font-serif text-3xl text-[#eef1f5]">Subir recibo</h1>
			<p class="text-sm text-[#8b95a3]">Arrastra una imagen y dispara el flujo OCR.</p>
		</header>

		<section class="rounded-xl border border-[#2a2e35] bg-[#111316] p-6">
			<UploadDropzone userId={currentUser.id} onUploaded={handleUploaded} />
		</section>
	</div>
</main>
