<script lang="ts">
	import { uploadReceipt } from '$lib/api/receipts';
	import type { UploadDropzoneProps } from '$lib/types/ui.types';
	import '$lib/styles/UploadDropzone.scss';

	let { userId, onUploaded }: UploadDropzoneProps = $props();

	let dragActive = $state(false);
	let selectedFile = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let isUploading = $state(false);
	let errorMessage = $state<string | null>(null);

	let fileInput: HTMLInputElement;

	const updatePreview = (file: File | null) => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = file ? URL.createObjectURL(file) : null;
	};

	const setFile = (file: File | null) => {
		selectedFile = file;
		errorMessage = null;
		updatePreview(file);
	};

	const isImageFile = (file: File) => file.type.startsWith('image/');
	const openFileDialog = () => fileInput?.click();

	const handleDragEnter = (event: DragEvent) => {
		event.preventDefault();
		if (!isUploading) dragActive = true;
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		if (!isUploading) dragActive = true;
	};

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		const currentTarget = event.currentTarget as HTMLElement | null;
		const relatedTarget = event.relatedTarget as Node | null;
		if (currentTarget && relatedTarget && currentTarget.contains(relatedTarget)) return;
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

	const submitLabel = $derived(isUploading ? 'Cargando...' : 'Subir recibo');
	const submitDisabled = $derived(!selectedFile || isUploading);
</script>

<section class="upload-section">
	<div
		class="dropzone"
		class:dropzone--active={dragActive && !isUploading}
		class:dropzone--busy={isUploading}
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
			bind:this={fileInput}
			type="file"
			accept="image/*"
			class="dropzone__input"
			onchange={handleFileChange}
		/>

		<div class="dropzone__icon-wrap">
			<svg
				class="dropzone__icon"
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

		<div class="dropzone__text-wrap">
			<p class="dropzone__title">Arrastra una imagen</p>
			<p class="dropzone__subtitle">o selecciona desde tu equipo</p>
		</div>

		<span class="dropzone__btn">Elegir archivo</span>

		{#if selectedFile}
			<p class="dropzone__filename">{selectedFile.name}</p>
		{/if}
	</div>

	{#if previewUrl}
		<div class="preview">
			<img src={previewUrl} alt="Preview" class="preview__img" />
		</div>
	{/if}

	{#if errorMessage}
		<p class="error-msg">{errorMessage}</p>
	{/if}

	<button
		type="button"
		class="submit-btn"
		class:submit-btn--disabled={submitDisabled}
		disabled={submitDisabled}
		onclick={handleSubmit}
	>
		{submitLabel}
	</button>
</section>
