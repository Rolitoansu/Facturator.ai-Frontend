<script lang="ts">
    import { uploadReceipt } from '$lib/api';
    import type { Receipt } from '$lib/api';

    export interface UploadDropzoneProps {
        userId: string;
        onUploaded?: (receipt: Receipt) => void;
    }

    let { userId, onUploaded }: UploadDropzoneProps = $props();

    let dragActive = $state(false);
    let selectedFile = $state<File | null>(null);
    let previewUrl = $state<string | null>(null);
    let isUploading = $state(false);
    let errorMessage = $state<string | null>(null);
    
    let fileInput: HTMLInputElement;

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

        <span class="dropzone__btn">
            Elegir archivo
        </span>

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

<style lang="scss">
    $font-mono: 'DM Mono', monospace;

    $color-green: #4ade80;
    $color-green-alpha: rgba(74, 222, 128, 0.1);
    $color-green-hover: rgba(74, 222, 128, 0.2);
    
    $color-bg-inner: #0b0d0f;
    $color-bg-idle: #111316;
    $color-bg-busy: #1e2126;
    
    $color-border-idle: #2a2e35;
    $color-border-busy: #353b44;
    
    $color-text-main: #c8d0da;
    $color-text-light: #eef1f5;
    $color-text-muted: #8b95a3;
    $color-text-darker: #5a6170;
    
    $color-error: #f87171;

    .upload-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .dropzone {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        border-radius: 0.75rem;
        border: 0.0625rem dashed $color-border-idle;
        background-color: $color-bg-idle;
        padding: 2.5rem 1.5rem;
        text-align: center;
        color: $color-text-muted;
        transition: all 0.2s ease;
        cursor: pointer;

        &--active {
            border-color: $color-green;
            background-color: $color-green-alpha;
            color: $color-green;
        }

        &--busy {
            border-color: $color-border-busy;
            background-color: $color-bg-busy;
            color: $color-text-darker;
            cursor: wait;
        }

        &__input {
            display: none;
        }

        &__icon-wrap {
            display: flex;
            height: 3rem;
            width: 3rem;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 0.0625rem solid $color-border-idle;
        }

        &__icon {
            height: 1.5rem;
            width: 1.5rem;
        }

        &__text-wrap {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        &__title {
            margin: 0;
            font-size: 0.875rem;
            font-weight: 500;
            color: $color-text-light;
        }

        &__subtitle {
            margin: 0;
            font-size: 0.75rem;
        }

        &__btn {
            border-radius: 9999px;
            border: 0.0625rem solid $color-border-idle;
            background-color: $color-bg-busy;
            padding: 0.5rem 1rem;
            font-family: $font-mono;
            font-size: 0.75rem;
            letter-spacing: 0.24em;
            color: $color-text-main;
            text-transform: uppercase;
            transition: all 0.2s ease;

            .dropzone:hover:not(.dropzone--busy) & {
                border-color: $color-green;
                color: $color-green;
            }
        }

        &__filename {
            margin: 0;
            font-family: $font-mono;
            font-size: 0.75rem;
            color: $color-text-main;
        }
    }

    .preview {
        overflow: hidden;
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border-idle;
        background-color: $color-bg-inner;

        &__img {
            height: 12rem;
            width: 100%;
            object-fit: cover;
            display: block;
        }
    }

    .error-msg {
        margin: 0;
        font-family: $font-mono;
        font-size: 0.75rem;
        color: $color-error;
    }

    .submit-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-green;
        background-color: $color-green-alpha;
        padding: 0.5rem 1rem;
        font-family: $font-mono;
        font-size: 0.75rem;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: $color-green;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover:not(&--disabled) {
            background-color: $color-green-hover;
        }

        &--disabled {
            cursor: not-allowed;
            border-color: $color-border-idle;
            background-color: $color-bg-idle;
            color: $color-text-darker;
        }
    }
</style>