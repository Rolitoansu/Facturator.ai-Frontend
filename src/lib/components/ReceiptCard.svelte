<script lang="ts">
    import { ReceiptStatus, type Receipt } from '$lib/api';

    export interface ReceiptCardProps {
        receipt: Receipt;
    }

    const statusLabels: Record<ReceiptStatus, string> = {
        [ReceiptStatus.Pending]: 'pending',
        [ReceiptStatus.Processing]: 'processing',
        [ReceiptStatus.Done]: 'done',
        [ReceiptStatus.Error]: 'error'
    };

    const extractMerchant = (value: string) =>
        value.split('\n').map((line) => line.trim()).find(Boolean) ?? 'Recibo';

    const extractAmount = (value: string) => {
        const match = value.match(/(\d+[.,]\d{2})/);
        if (!match) return 'EUR --';
        
        const numeric = Number(match[1].replace(',', '.'));
        return Number.isNaN(numeric) ? 'EUR --' : `EUR ${numeric.toFixed(2)}`;
    };

    const formatDate = (value: string) => {
        if (!value) return '--';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '--' : date.toISOString().slice(0, 10);
    };

    const { receipt }: ReceiptCardProps = $props();

    const parsed = $derived.by(() => {
        const raw = receipt.rawText || '';
        const status = receipt.status ?? ReceiptStatus.Pending;
        
        return {
            status,
            statusModifier: statusLabels[status] ?? 'pending',
            merchant: extractMerchant(raw),
            amount: extractAmount(raw),
            date: formatDate(receipt.createdAt)
        };
    });
</script>

<article class="receipt-card">
    <header class="receipt-card__header">
        <div class="receipt-card__info">
            <p class="receipt-card__eyebrow">Recibo</p>
            <p class="receipt-card__merchant" title={parsed.merchant}>{parsed.merchant}</p>
            <p class="receipt-card__id">{receipt.id}</p>
        </div>
        
        <div class={`status-badge status-badge--${parsed.statusModifier}`}>
            {#if parsed.status === ReceiptStatus.Pending}
                <svg class="status-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </svg>
            {:else if parsed.status === ReceiptStatus.Processing}
                <svg class="status-badge__icon status-badge__icon--spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 1 1-3.5-7.1" />
                </svg>
            {:else if parsed.status === ReceiptStatus.Done}
                <svg class="status-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 13l4 4L19 7" />
                </svg>
            {:else}
                <svg class="status-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                </svg>
            {/if}
            <span class="status-badge__text">{parsed.statusModifier}</span>
        </div>
    </header>

    <div class="receipt-card__details">
        <div class="detail-box">
            <p class="detail-box__label">Importe</p>
            <p class="detail-box__value">{parsed.amount}</p>
        </div>
        <div class="detail-box">
            <p class="detail-box__label">Fecha</p>
            <p class="detail-box__value">{parsed.date}</p>
        </div>
    </div>
</article>

<style lang="scss">
    $font-mono: 'DM Mono', monospace;

    $color-bg-card: #1e2126;
    $color-bg-inner: #111316;
    $color-border: #2a2e35;
    
    $color-text-main: #c8d0da;
    $color-text-light: #eef1f5;
    $color-text-muted: #8b95a3;
    $color-text-darker: #5a6170;

    $color-pending-bg: #353b44;
    $color-pending-border: #5a6170;
    $color-pending-text: #c8d0da;

    $color-processing: #f59e0b;
    $color-done: #4ade80;
    $color-error: #f87171;

    @keyframes spin {
        100% { transform: rotate(360deg); }
    }

    .receipt-card {
        container-type: inline-size;
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 1rem;
        color: $color-text-main;
        display: flex;
        flex-direction: column;

        &__header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1rem;
        }

        &__info {
            min-width: 0;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        &__eyebrow {
            margin: 0;
            font-family: $font-mono;
            font-size: 0.62rem;
            letter-spacing: 0.32em;
            color: $color-text-muted;
            text-transform: uppercase;
        }

        &__merchant {
            margin: 0.25rem 0 0 0;
            font-size: 1rem;
            font-weight: 600;
            color: $color-text-light;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &__id {
            margin: 0.25rem 0 0 0;
            font-family: $font-mono;
            font-size: 0.7rem;
            color: $color-text-darker;
        }

        &__details {
            margin-top: 1rem;
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.75rem;

            @container (min-width: 18rem) {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    }

    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 999rem;
        border: 0.0625rem solid transparent;
        padding: 0.25rem 0.5rem;
        font-family: $font-mono;
        font-size: 0.55rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        white-space: nowrap;
        flex-shrink: 0;
        transition: all 0.2s ease;

        @container (min-width: 18rem) {
            padding: 0.25rem 0.75rem;
            font-size: 0.62rem;
            letter-spacing: 0.28em;
        }

        &__icon {
            width: 0.875rem;
            height: 0.875rem;

            &--spin {
                animation: spin 1s linear infinite;
            }
        }

        &--pending {
            background-color: $color-pending-bg;
            border-color: $color-pending-border;
            color: $color-pending-text;
        }

        &--processing {
            background-color: rgba($color-processing, 0.1);
            border-color: rgba($color-processing, 0.4);
            color: $color-processing;
        }

        &--done {
            background-color: rgba($color-done, 0.1);
            border-color: rgba($color-done, 0.4);
            color: $color-done;
        }

        &--error {
            background-color: rgba($color-error, 0.1);
            border-color: rgba($color-error, 0.4);
            color: $color-error;
        }
    }

    .detail-box {
        border-radius: 0.375rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-inner;
        padding: 0.5rem 0.75rem;

        &__label {
            margin: 0;
            font-family: $font-mono;
            font-size: 0.6rem;
            letter-spacing: 0.28em;
            color: $color-text-muted;
            text-transform: uppercase;
        }

        &__value {
            margin: 0.25rem 0 0 0;
            font-family: $font-mono;
            font-size: 0.875rem;
            color: $color-text-light;
        }
    }
</style>