<script lang="ts">
	import { ReceiptStatus } from '$lib/types/api.types';
	import type { ReceiptCardProps } from '$lib/types/ui.types';
	import { STATUS_LABELS } from '$lib/constants/receipt-status';
	import { extractMerchant, extractAmount } from '$lib/utils/receipt';
	import { formatDate } from '$lib/utils/date';
	import { glowTracking } from '$lib/actions/interactions';
	import '$lib/styles/ReceiptCard.scss';

	const { receipt }: ReceiptCardProps = $props();

	const parsed = $derived.by(() => {
		const raw = receipt.rawText || '';
		const status = receipt.status ?? ReceiptStatus.Pending;

		return {
			status,
			statusModifier: STATUS_LABELS[status] ?? 'pending',
			merchant: extractMerchant(raw),
			amount: extractAmount(raw),
			date: formatDate(receipt.createdAt)
		};
	});
</script>

<article class="receipt-card" use:glowTracking>
	<header class="receipt-card__header">
		<div class="receipt-card__info">
			<p class="receipt-card__eyebrow">Recibo</p>
			<p class="receipt-card__merchant" title={parsed.merchant}>{parsed.merchant}</p>
			<p class="receipt-card__id">{receipt.id}</p>
		</div>

		<div class={`status-badge status-badge--${parsed.statusModifier}`}>
			{#if parsed.status === ReceiptStatus.Pending}
				<svg
					class="status-badge__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 7v5l3 2" />
				</svg>
			{:else if parsed.status === ReceiptStatus.Processing}
				<svg
					class="status-badge__icon status-badge__icon--spin"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21 12a9 9 0 1 1-3.5-7.1" />
				</svg>
			{:else if parsed.status === ReceiptStatus.Done}
				<svg
					class="status-badge__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 13l4 4L19 7" />
				</svg>
			{:else}
				<svg
					class="status-badge__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
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
