<script lang="ts">
    import { mockHistoryReceipts } from '$lib/mock/lensledger';
    import { receiptStatusLabel } from '$lib/mock/lensledger';
    import { ReceiptStatus } from '$lib/api';

    const statusMap: Record<string, ReceiptStatus> = {
        done: ReceiptStatus.Done,
        processing: ReceiptStatus.Processing,
        pending: ReceiptStatus.Pending,
        error: ReceiptStatus.Error
    };

    const labelForMock = (s: (typeof mockHistoryReceipts)[number]['status']) => {
        const status = statusMap[s] ?? ReceiptStatus.Error;
        
        return receiptStatusLabel(status);
    };
</script>

<main class="history">
    <div class="history__wrap">
        <header class="header">
            <p class="header__eyebrow">LensLedger</p>
            <h1 class="header__title">Historial</h1>
            <p class="header__sub">Mock listo para completar UI.</p>
        </header>

        <section class="panel">
            <h2 class="panel__title">Recibos (mock)</h2>
            <div class="panel__list">
                {#each mockHistoryReceipts.slice(0, 6) as r (r.merchant + r.date)}
                    <article class="receipt-item">
                        <div class="receipt-item__details">
                            <p class="receipt-item__merchant" title={r.merchant}>{r.merchant}</p>
                            <p class="receipt-item__amount">{r.amount}</p>
                            <p class="receipt-item__meta">
                                {r.category} · {r.date}
                            </p>
                        </div>
                        <div class="receipt-item__status">
                            <p class="receipt-item__status-label">estado</p>
                            <p class="receipt-item__status-value">{labelForMock(r.status)}</p>
                        </div>
                    </article>
                {/each}
            </div>
        </section>
    </div>
</main>

<style lang="scss">
    $font-serif: 'DM Serif Display', serif;
    $font-mono: 'DM Mono', monospace;

    $color-bg-main: #0b0d0f;
    $color-bg-card: #111316;
    $color-bg-item: rgba(11, 13, 15, 0.2);
    $color-border: #2a2e35;

    $color-text-main: #c8d0da;
    $color-text-light: #eef1f5;
    $color-text-muted: #8b95a3;
    $color-text-eyebrow: #5a6170;

    .history {
        min-height: 100vh;
        background-color: $color-bg-main;
        padding: 1.5rem 1rem;
        color: $color-text-main;

        @media (min-width: 48rem) {
            padding: 2.5rem 1.5rem;
        }

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
            font-size: 1.5rem;
            color: $color-text-light;
            margin: 0;

            @media (min-width: 48rem) {
                font-size: 1.875rem;
            }
        }

        &__sub {
            font-size: 0.875rem;
            color: $color-text-muted;
            margin: 0;
        }
    }

    .panel {
        border-radius: 0.75rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 1rem;

        @media (min-width: 48rem) {
            padding: 1.25rem;
        }

        &__title {
            margin: 0 0 0.75rem 0;
            font-size: 0.875rem;
            font-weight: 600;
            color: $color-text-light;
        }

        &__list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
    }

    .receipt-item {
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-item;
        padding: 1rem;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        transition: border-color 0.2s ease, background-color 0.2s ease;

        &:hover {
            border-color: rgba(238, 241, 245, 0.1);
            background-color: rgba(11, 13, 15, 0.4);
        }

        &__details {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            min-width: 0;
            flex: 1;
        }

        &__merchant {
            margin: 0;
            font-size: 0.875rem;
            font-weight: 600;
            color: $color-text-light;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &__amount {
            margin: 0;
            font-size: 0.875rem;
            color: $color-text-main;
        }

        &__meta {
            margin: 0.25rem 0 0 0;
            font-family: $font-mono;
            font-size: 0.55rem;
            letter-spacing: 0.28em;
            color: $color-text-eyebrow;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @media (min-width: 48rem) {
                font-size: 0.6rem;
            }
        }

        &__status {
            text-align: right;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            flex-shrink: 0;
        }

        &__status-label {
            margin: 0;
            font-family: $font-mono;
            font-size: 0.55rem;
            letter-spacing: 0.28em;
            color: $color-text-muted;
            text-transform: uppercase;

            @media (min-width: 48rem) {
                font-size: 0.62rem;
            }
        }

        &__status-value {
            margin: 0;
            font-family: $font-mono;
            font-size: 0.75rem;
            color: $color-text-light;

            @media (min-width: 48rem) {
                font-size: 0.875rem;
            }
        }
    }
</style>