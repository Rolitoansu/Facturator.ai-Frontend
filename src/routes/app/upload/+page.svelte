<script lang="ts">
    import UploadDropzone from '$lib/components/UploadDropzone.svelte';
    import { socketStore } from '$lib/stores/socket';
    import { transactionsStore } from '$lib/stores/transactions';
    import { getCurrentUserMock, type Receipt } from '$lib/api';

    const currentUser = getCurrentUserMock();

    function handleUploaded(receipt: Receipt) {
        transactionsStore.addProcessingReceipt(receipt);
        socketStore.simulateReceiptProcessed(receipt.id);
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

<style lang="scss">
    $font-serif: 'DM Serif Display', serif;
    $font-mono: 'DM Mono', monospace;

    $color-bg-main: #0b0d0f;
    $color-bg-card: #111316;
    $color-border: #2a2e35;
    
    $color-text-main: #c8d0da;
    $color-text-light: #eef1f5;
    $color-text-muted: #8b95a3;
    $color-text-eyebrow: #5a6170;

    .upload-page {
        min-height: 100vh;
        background-color: $color-bg-main;
        padding: 2.5rem 1.5rem;
        color: $color-text-main;

        &__wrap {
            margin: 0 auto;
            display: flex;
            width: 100%;
            max-width: 64rem;
            flex-direction: column;
            gap: 1.5rem;
        }
    }

    .header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &__eyebrow {
            font-family: $font-mono;
            font-size: 0.7rem;
            letter-spacing: 0.36em;
            color: $color-text-eyebrow;
            text-transform: uppercase;
            margin: 0;
        }

        &__title {
            font-family: $font-serif;
            font-size: 1.875rem;
            color: $color-text-light;
            margin: 0;
        }

        &__sub {
            font-size: 0.875rem;
            color: $color-text-muted;
            margin: 0;
        }
    }

    .upload-panel {
        border-radius: 0.75rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 1.5rem;
    }
</style>