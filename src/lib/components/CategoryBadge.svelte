<script lang="ts">
	export interface CategoryBadgeProps {
		category: string;
	}

	const baseClasses =
		'inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] font-mono';

	const defaultStyle = 'bg-[#1e2126] text-[#8b95a3] border-[#2a2e35]';

	const categoryStyles: Record<string, string> = {
		alimentacion: 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/30',
		transporte: 'bg-[#22d3ee]/10 text-[#22d3ee] border-[#22d3ee]/30',
		ropa: 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30',
		ocio: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30',
		salud: 'bg-[#60a5fa]/10 text-[#60a5fa] border-[#60a5fa]/30',
		hogar: 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/30',
		suscripciones: 'bg-[#ff3e00]/10 text-[#ff3e00] border-[#ff3e00]/30'
	};

	const normalizeCategory = (value: string) =>
		value
			.trim()
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');

	const formatLabel = (value: string) => value.trim().replace(/[_-]+/g, ' ') || 'otros';

	let { category }: CategoryBadgeProps = $props();

	const normalized = $derived(normalizeCategory(category || 'otros'));
	const badgeStyle = $derived(categoryStyles[normalized] ?? defaultStyle);
	const label = $derived(formatLabel(category));
</script>

<span class={[baseClasses, badgeStyle]}>{label}</span>
