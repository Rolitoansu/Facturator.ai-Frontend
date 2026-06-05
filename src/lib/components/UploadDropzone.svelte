<script lang="ts">
	import { uploadReceipt } from '$lib/api';
	import type { Receipt } from '$lib/api';

	export interface UploadDropzoneProps {
		userId: string;
		onUploaded?: (receipt: Receipt) => void;
	}

	const dropzoneBase =
		'relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center transition';

	const dropzoneIdle = 'border-[#2a2e35] bg-[#111316] text-[#8b95a3]';
	const dropzoneActive = 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]';
	const dropzoneBusy = 'border-[#353b44] bg-[#1e2126] text-[#5a6170]';

	const fileInputId = 'upload-dropzone-input';

	let { userId, onUploaded }: UploadDropzoneProps = $props();

	let dragActive = $state(false);
	let selectedFile = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let isUploading = $state(false);
	let errorMessage = $state<string | null>(null);

	const updatePreview = (file: File | null) => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}

		previewUrl = file ? URL.createObjectURL(file) : null;
	};

	const setFile = (file: File | null) => {
		selectedFile = file;
		errorMessage = null;
		updatePreview(file);
	};

	const isImageFile = (file: File) => file.type.startsWith('image/');

	const openFileDialog = () => {
		const input = document.getElementById(fileInputId) as HTMLInputElement | null;
		input?.click();
	};

	const handleDragEnter = (event: DragEvent) => {
		event.preventDefault();
		if (!isUploading) {
			dragActive = true;
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		if (!isUploading) {
			dragActive = true;
		}
	};

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();

		const currentTarget = event.currentTarget as HTMLElement | null;
		const relatedTarget = event.relatedTarget as Node | null;

		if (currentTarget && relatedTarget && currentTarget.contains(relatedTarget)) {
			return;
		}

		dragActive = false;
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		dragActive = false;

		const file = event.dataTransfer?.files?.[0];
		if (!file) return;

		if (!isImageFile(file)) {
			setFile(null);
			errorMessage = 'Unsupported file type';
			return;
		}

		setFile(file);
	};

	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement | null;
		const file = target?.files?.[0] ?? null;

		if (!file) {
			setFile(null);
			return;
		}

		if (!isImageFile(file)) {
			setFile(null);
			errorMessage = 'Unsupported file type';
			return;
		}

		setFile(file);
	};

	const handleSubmit = async () => {
		if (!selectedFile || isUploading) return;

		isUploading = true;
		errorMessage = null;
		dragActive = false;

		try {
			const receipt = await uploadReceipt(selectedFile, userId);
			onUploaded?.(receipt);
			setFile(null);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Upload failed';
		} finally {
			isUploading = false;
		}
	};

	const dropzoneState = $derived(
		isUploading ? dropzoneBusy : dragActive ? dropzoneActive : dropzoneIdle
	);

	const submitLabel = $derived(isUploading ? 'Cargando...' : 'Subir recibo');
	const submitDisabled = $derived(!selectedFile || isUploading);
</script>

<section class="flex flex-col gap-4">
	<div
		class={[dropzoneBase, dropzoneState]}
		role="button"
		tabindex="0"
		aria-busy={isUploading}
		ondragenter={handleDragEnter}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={openFileDialog}
		onkeydown={(event) => event.key === 'Enter' && openFileDialog()}
	>
		<input
			id={fileInputId}
			type="file"
			accept="image/*"
			class="hidden"
			onchange={handleFileChange}
		/>

		<div class="flex h-12 w-12 items-center justify-center rounded-full border border-[#2a2e35]">
			<svg
				class="h-6 w-6"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 16V4" />
				<path d="M8 8l4-4 4 4" />
				<path d="M4 20h16" />
			</svg>
		</div>

		<div class="space-y-1">
			<p class="text-sm font-medium text-[#eef1f5]">Arrastra una imagen</p>
			<p class="text-xs text-[#8b95a3]">o selecciona desde tu equipo</p>
		</div>

		<span
			class="rounded-full border border-[#2a2e35] bg-[#1e2126] px-4 py-2 font-mono text-xs tracking-[0.24em] text-[#c8d0da] uppercase transition hover:border-[#4ade80] hover:text-[#4ade80]"
		>
			Elegir archivo
		</span>

		{#if selectedFile}
			<p class="font-mono text-xs text-[#c8d0da]">{selectedFile.name}</p>
		{/if}
	</div>

	{#if previewUrl}
		<div class="overflow-hidden rounded-lg border border-[#2a2e35] bg-[#0b0d0f]">
			<img src={previewUrl} alt="Preview" class="h-48 w-full object-cover" />
		</div>
	{/if}

	{#if errorMessage}
		<p class="font-mono text-xs text-[#f87171]">{errorMessage}</p>
	{/if}

	<button
		type="button"
		class={[
			'inline-flex items-center justify-center rounded-lg border px-4 py-2 font-mono text-xs tracking-[0.24em] uppercase transition',
			submitDisabled
				? 'cursor-not-allowed border-[#2a2e35] bg-[#111316] text-[#5a6170]'
				: 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20'
		]}
		disabled={submitDisabled}
		onclick={handleSubmit}
	>
		{submitLabel}
	</button>
</section>
