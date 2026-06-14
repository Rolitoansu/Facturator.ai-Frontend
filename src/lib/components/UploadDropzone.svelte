<script lang="ts">
	import { uploadReceipt, getReceipts } from '$lib/api/receipts';
	import type { UploadDropzoneProps } from '$lib/types/ui.types';
	import '$lib/styles/UploadDropzone.scss';

	let { onUploaded }: UploadDropzoneProps = $props();

	let dragActive = $state(false);
	let selectedFile = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let uploadStep = $state('');
	let errorMessage = $state<string | null>(null);

	let fileInput = $state<HTMLInputElement>();
	let scanInterval: ReturnType<typeof setInterval> | undefined;

	const updatePreview = (file: File | null) => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		if (file && file.type.startsWith('image/')) {
			previewUrl = URL.createObjectURL(file);
		} else {
			previewUrl = null;
		}
	};

	const setFile = (file: File | null) => {
		selectedFile = file;
		errorMessage = null;
		updatePreview(file);
	};

	const isSupportedFile = (file: File) => file.type.startsWith('image/') || file.type === 'application/pdf';

	const openFileDialog = () => {
		fileInput?.click();
	};

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

		if (!isSupportedFile(file)) {
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

		if (!isSupportedFile(file)) {
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
		uploadProgress = 0;
		uploadStep = 'Detectando bordes de la imagen...';

		// Iniciar simulación de progreso (asintótico, se frena al llegar al 90%)
		scanInterval = setInterval(() => {
			if (uploadProgress < 95) {
				const remaining = 95 - uploadProgress;
				// Avanza un 3% de lo que queda, más un mínimo de 0.1 para que nunca pare
				uploadProgress += remaining * 0.03 + 0.1; 
				if (uploadProgress > 95) uploadProgress = 95;
			}
			
			if (uploadProgress >= 20 && uploadProgress < 50) {
				uploadStep = 'Procesando texto con OCR...';
			} else if (uploadProgress >= 50 && uploadProgress < 85) {
				uploadStep = 'Extrayendo importe y comercio...';
			} else if (uploadProgress >= 85) {
				uploadStep = 'Analizando con la IA de Facturator...';
			}
		}, 300);

		try {
			const receipt = await uploadReceipt(selectedFile);
			
			// Hacemos polling al backend de Go hasta que el ML termine
			let isProcessingDone = false;
			while (!isProcessingDone) {
				try {
					const allReceipts = await getReceipts();
					const match = allReceipts.find(r => r.id === receipt.id);
					
					if (match && (
						match.status === 'done' || 
						match.status === 'processed' || 
						match.status === 'completed' || 
						match.status === 'error' || 
						match.status === 'failed' || 
						match.status === 'review'
					)) {
						isProcessingDone = true;
						break;
					}
				} catch (e) {
					console.error("Error polling receipts:", e);
				}
				// Esperamos 1.5s antes de volver a preguntar
				await new Promise(resolve => setTimeout(resolve, 1500));
			}

			clearInterval(scanInterval);
			uploadProgress = 100;
			uploadStep = '¡Ticket extraído con éxito!';
			
			// Dejar que el usuario vea el 100% durante un momento
			setTimeout(() => {
				onUploaded?.(receipt);
				setFile(null);
				isUploading = false;
			}, 1000);
		} catch (error) {
			clearInterval(scanInterval);
			errorMessage = error instanceof Error ? error.message : 'Upload failed';
			isUploading = false;
		}
	};

	const submitLabel = $derived(isUploading ? 'Cargando...' : 'Subir recibo');
	const submitDisabled = $derived(!selectedFile || isUploading);
</script>

<section class="upload-section">
	{#if !isUploading}
		<div
			class="dropzone"
			class:dropzone--active={dragActive}
			role="button"
			tabindex="0"
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
				accept="image/*,application/pdf"
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

			<span class="dropzone__btn"> Elegir archivo </span>

			{#if selectedFile}
				<p class="dropzone__filename">{selectedFile.name}</p>
			{/if}
		</div>
	{/if}

	{#if previewUrl || isUploading}
		<div class="preview-container" class:is-scanning={isUploading}>
			{#if previewUrl}
				<div class="preview">
					<img src={previewUrl} alt="Preview" class="preview__img" />
					{#if isUploading}
						<div class="ticket-view__laser"></div>
					{/if}
				</div>
			{:else if selectedFile}
				<div class="preview" style="display: flex; align-items: center; justify-content: center; background-color: var(--color-bg2, #18181b);">
					<p style="color: var(--color-muted, #a1a1aa); font-family: monospace; font-size: 0.875rem;">
						📄 {selectedFile.name}
					</p>
				</div>
			{/if}

			{#if isUploading}
				<div class="scanner-console">
					<div class="progress-container">
						<div class="progress-bar">
							<div class="progress-bar__fill" style="width: {uploadProgress}%;"></div>
						</div>
						<span class="progress-text">{Math.round(uploadProgress)}%</span>
					</div>
					<div class="scanner-console__log">
						<span class="log-dot" class:log-dot--done={uploadProgress === 100}></span> {uploadStep}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	{#if errorMessage}
		<p class="error-msg">{errorMessage}</p>
	{/if}

	{#if !isUploading}
		<button
			type="button"
			class="submit-btn"
			class:submit-btn--disabled={submitDisabled}
			disabled={submitDisabled}
			onclick={handleSubmit}
		>
			{submitLabel}
		</button>
	{/if}
</section>
