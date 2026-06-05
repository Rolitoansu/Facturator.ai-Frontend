<script lang="ts">
	import { mockHistoryReceipts } from '$lib/mock/lensledger';
	import { receiptStatusLabel } from '$lib/mock/lensledger';
	import { ReceiptStatus } from '$lib/api';

	const labelForMock = (s: (typeof mockHistoryReceipts)[number]['status']) => {
		return receiptStatusLabel(
			s === 'done'
				? ReceiptStatus.Done
				: s === 'processing'
					? ReceiptStatus.Processing
					: s === 'pending'
						? ReceiptStatus.Pending
						: ReceiptStatus.Error
		);
	};
</script>

<main class="min-h-screen bg-[#0b0d0f] px-6 py-10 text-[#c8d0da]">
	<div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
		<header class="flex flex-col gap-2">
			<p class="font-mono text-[0.7rem] tracking-[0.36em] text-[#5a6170] uppercase">LensLedger</p>
			<h1 class="font-serif text-3xl text-[#eef1f5]">Historial</h1>
			<p class="text-sm text-[#8b95a3]">Mock listo para completar UI.</p>
		</header>

		<section class="rounded-xl border border-[#2a2e35] bg-[#111316] p-5">
			<h2 class="mb-3 text-sm font-semibold text-[#eef1f5]">Recibos (mock)</h2>
			<div class="grid grid-cols-1 gap-3">
				{#each mockHistoryReceipts.slice(0, 6) as r (r.merchant + r.date)}
					<div class="rounded-lg border border-[#2a2e35] bg-[#0b0d0f]/20 p-4">
						<div class="flex items-start justify-between gap-4">
							<div>
								<p class="text-sm font-semibold text-[#eef1f5]">{r.merchant}</p>
								<p class="text-sm text-[#c8d0da]">{r.amount}</p>
								<p class="font-mono text-[0.6rem] tracking-[0.28em] text-[#5a6170] uppercase">
									{r.category} · {r.date}
								</p>
							</div>
							<div class="text-right">
								<p class="font-mono text-[0.62rem] tracking-[0.28em] text-[#8b95a3] uppercase">
									estado
								</p>
								<p class="mt-1 font-mono text-sm text-[#eef1f5]">{labelForMock(r.status)}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</main>
