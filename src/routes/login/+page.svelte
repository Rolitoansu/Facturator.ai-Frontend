<script lang="ts">
    import { enhance } from "$app/forms";

    let mode = $state<'login' | 'register'>('login');
    const switchTo = (next: 'login' | 'register') => mode = next;
</script>

<svelte:head>
    <title>LensLedger — Login</title>
</svelte:head>

<main class="auth-layout">
    <div class="auth">
        <header class="auth__header">
            <p class="auth__eyebrow">LensLedger</p>
            <h1 class="auth__title">Acceder</h1>
            <p class="auth__sub">Mock login integrado con mejor-auth (demo).</p>
        </header>

        <div class="tabs" role="tablist" aria-label="Autenticación">
            <button
                type="button"
                class="tab"
                class:tab--active={mode === 'login'}
                onclick={() => switchTo('login')}
                role="tab"
                aria-selected={mode === 'login'}
            >
                Login
            </button>

            <button
                type="button"
                class="tab"
                class:tab--active={mode === 'register'}
                onclick={() => switchTo('register')}
                role="tab"
                aria-selected={mode === 'register'}
            >
                Register
            </button>
        </div>

        {#if mode === 'login'}
            <form
                method="post"
                action="?/signInEmail"
                class="auth-form"
                use:enhance
            >
                <label class="form-group">
                    <span class="form-group__label">Email</span>
                    <input type="email" name="email" required class="input" />
                </label>

                <label class="form-group">
                    <span class="form-group__label">Password</span>
                    <input type="password" name="password" required class="input" />
                </label>

                <button type="submit" class="btn btn--primary auth-form__submit">
                    Login
                </button>

                <p class="auth-form__hint">
                    Usa el formulario demo para establecer sesión y desbloquear rutas /app/*.
                </p>
            </form>
        {:else}
            <form
                method="post"
                action="?/signUpEmail"
                class="auth-form"
                use:enhance
            >
                <label class="form-group">
                    <span class="form-group__label">Email</span>
                    <input type="email" name="email" required class="input" />
                </label>

                <label class="form-group">
                    <span class="form-group__label">Password</span>
                    <input type="password" name="password" required class="input" />
                </label>

                <label class="form-group">
                    <span class="form-group__label">Name</span>
                    <input type="text" name="name" required class="input" />
                </label>

                <button type="submit" class="btn btn--primary auth-form__submit">
                    Register
                </button>

                <p class="auth-form__hint">Registro demo con mejor-auth.</p>
            </form>
        {/if}
    </div>
</main>

<style lang="scss">
    $font-serif: 'DM Serif Display', serif;
    $font-mono: 'DM Mono', monospace;

    $color-green: #4ade80;
    $color-green-light: rgba(74, 222, 128, 0.1);
    $color-green-hover: rgba(74, 222, 128, 0.2);
    
    $color-bg-main: #0b0d0f;
    $color-bg-card: #111316;
    $color-border: #2a2e35;
    $color-border-input: #353b44;
    
    $color-text-main: #c8d0da;
    $color-text-title: #eef1f5;
    $color-text-muted: #8b95a3;
    $color-text-eyebrow: #5a6170;

    .auth-layout {
        min-height: 100vh;
        background-color: $color-bg-main;
        padding: 2.5rem 1.5rem;
        color: $color-text-main;
        display: flex;
        flex-direction: column;
    }

    .auth {
        margin: 0 auto;
        width: 100%;
        max-width: 28rem;

        &__header {
            margin-bottom: 1.5rem;
        }

        &__eyebrow {
            font-family: $font-mono;
            font-size: 0.7rem;
            letter-spacing: 0.36em;
            color: $color-text-eyebrow;
            text-transform: uppercase;
        }

        &__title {
            margin-top: 0.5rem;
            font-family: $font-serif;
            font-size: 1.875rem;
            color: $color-text-title;
        }

        &__sub {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: $color-text-muted;
        }
    }

    .tabs {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 0.5rem;
    }

    .tab {
        flex: 1;
        border-radius: 0.375rem;
        border: 0.0625rem solid $color-border;
        background: transparent;
        padding: 0.5rem 0.75rem;
        font-family: $font-mono;
        font-size: 0.75rem;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: $color-text-muted;
        transition: all 0.2s ease;
        cursor: pointer;

        &--active {
            border-color: rgba($color-green, 0.25);
            color: $color-green;
            background: rgba($color-green, 0.08);
        }

        &:not(.tab--active):hover {
            color: $color-text-main;
            border-color: $color-border-input;
        }
    }

    .auth-form {
        border-radius: 0.75rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 1.25rem;

        &__submit {
            margin-top: 1.5rem;
            width: 100%;
        }

        &__hint {
            margin-top: 0.75rem;
            font-size: 0.75rem;
            color: $color-text-muted;
        }
    }

    .form-group {
        display: block;
        
        & + & {
            margin-top: 1rem;
        }

        &__label {
            display: block;
            font-family: $font-mono;
            font-size: 0.75rem;
            letter-spacing: 0.18em;
            color: $color-text-eyebrow;
            text-transform: uppercase;
        }
    }

    .input {
		box-sizing: border-box;
        margin-top: 0.5rem;
        width: 100%;
        border-radius: 0.375rem;
        border: 0.0625rem solid $color-border-input;
        background-color: $color-bg-main;
        padding: 0.5rem 0.75rem;
        color: $color-text-main;
        transition: border-color 0.2s ease;

        &:focus {
            border-color: $color-green;
            outline: none;
        }
    }

    .btn {
		box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-family: $font-mono;
        font-size: 0.75rem;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        transition: all 0.2s ease;
        cursor: pointer;

        &--primary {
            border: 0.0625rem solid $color-green;
            background: $color-green-light;
            color: $color-green;

            &:hover, &:focus-visible {
                background: $color-green-hover;
                transform: translateY(-1px);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }
</style>