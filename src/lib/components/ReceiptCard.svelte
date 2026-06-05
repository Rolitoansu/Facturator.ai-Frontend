<script lang="ts">
	import { ReceiptStatus } from '$lib/api';
	import type { Receipt } from '$lib/api';

	export interface ReceiptCardProps {
		receipt: Receipt;
	}

	const statusStyles: Record<ReceiptStatus, string> = {
		[ReceiptStatus.Pending]: 'bg-[#353b44] text-[#c8d0da] border-[#5a6170]',
		[ReceiptStatus.Processing]: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/40',
		[ReceiptStatus.Done]: 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/40',
		[ReceiptStatus.Error]: 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/40'
	};

	const statusLabels: Record<ReceiptStatus, string> = {
		[ReceiptStatus.Pending]: 'pending',
		[ReceiptStatus.Processing]: 'processing',
		[ReceiptStatus.Done]: 'done',
		[ReceiptStatus.Error]: 'error'
	};

	const extractMerchant = (value: string) =>
		value
			.split('\n')
			.map((line) => line.trim())
			.find(Boolean) ?? 'Recibo';

	const extractAmount = (value: string) => {
		const match = value.match(/(\d+[.,]\d{2})/);
		if (!match) return 'EUR --';
		const normalized = match[1].replace(',', '.');
		const numeric = Number(normalized);
		if (Number.isNaN(numeric)) return 'EUR --';
		return `EUR ${numeric.toFixed(2)}`;
	};

	const formatDate = (value: string) => {
		if (!value) return '--';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '--';
		return date.toISOString().slice(0, 10);
	};

	let { receipt }: ReceiptCardProps = $props();

	const status = $derived(receipt.status ?? ReceiptStatus.Pending);
	const statusStyle = $derived(statusStyles[status] ?? statusStyles[ReceiptStatus.Pending]);
	const statusLabel = $derived(statusLabels[status] ?? statusLabels[ReceiptStatus.Pending]);
	const merchant = $derived(extractMerchant(receipt.rawText || ''));
	const amount = $derived(extractAmount(receipt.rawText || ''));
	const date = $derived(formatDate(receipt.createdAt));
</script>

<article class="rounded-lg border border-[#2a2e35] bg-[#1e2126] p-4 text-[#c8d0da]">
	<div class="flex items-start justify-between gap-4">
		<div class="min-w-0">
			<p class="font-mono text-[0.62rem] tracking-[0.32em] text-[#8b95a3] uppercase">Recibo</p>
			<p class="mt-1 truncate text-base font-semibold text-[#eef1f5]">{merchant}</p>
			<p class="mt-1 font-mono text-[0.7rem] text-[#5a6170]">{receipt.id}</p>
		</div>
		<div
			class={[
				'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.62rem] tracking-[0.28em] uppercase',
				statusStyle
			]}
		>
			{#if status === ReceiptStatus.Pending}
				<svg
					class="h-3.5 w-3.5"
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
			{:else if status === ReceiptStatus.Processing}
				<svg
					class="h-3.5 w-3.5 animate-spin"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21 12a9 9 0 1 1-3.5-7.1" />
				</svg>
			{:else if status === ReceiptStatus.Done}
				<svg
					class="h-3.5 w-3.5"
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
					class="h-3.5 w-3.5"
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
			<span>{statusLabel}</span>
		</div>
	</div>

	<div class="mt-4 grid grid-cols-2 gap-3">
		<div class="rounded-md border border-[#2a2e35] bg-[#111316] px-3 py-2">
			<p class="font-mono text-[0.6rem] tracking-[0.28em] text-[#8b95a3] uppercase">Importe</p>
			<p class="mt-1 font-mono text-sm text-[#eef1f5]">{amount}</p>
		</div>
		<div class="rounded-md border border-[#2a2e35] bg-[#111316] px-3 py-2">
			<p class="font-mono text-[0.6rem] tracking-[0.28em] text-[#8b95a3] uppercase">Fecha</p>
			<p class="mt-1 font-mono text-sm text-[#eef1f5]">{date}</p>
		</div>
	</div>
</article>
