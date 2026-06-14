<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import '$lib/styles/login.scss';

	let { form } = $props();

	let mode = $state<'login' | 'register'>('login');

	$effect(() => {
		const m = page.url.searchParams.get('mode');
		if (m === 'register' || m === 'login') {
			mode = m;
		}
	});

	const switchTo = (next: 'login' | 'register') => (mode = next);


</script>

<svelte:head>
	<title>Facturator.ai — Acceder</title>
</svelte:head>

<main class="auth-layout">
	<div class="auth">
		<header class="auth__header">
			<p class="auth__eyebrow">Facturator.ai</p>
			<h1 class="auth__title">Bienvenido</h1>
			<p class="auth__sub">Accede con tu cuenta para continuar.</p>
		</header>

		<!-- Botón Google OAuth (disponible en ambos modos) -->
		<form method="post" action="?/signInGoogle" class="oauth-form">
			<button type="submit" class="btn btn--oauth" id="btn-google-oauth">
				<svg class="oauth-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
					<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
					<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
					<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
				</svg>
				Continuar con Google
			</button>
		</form>

		<div class="divider">
			<span class="divider__line"></span>
			<span class="divider__text">o con email</span>
			<span class="divider__line"></span>
		</div>

		<div class="tabs" role="tablist" aria-label="Autenticación">
			<button
				type="button"
				class="tab"
				class:tab--active={mode === 'login'}
				onclick={() => switchTo('login')}
				role="tab"
				aria-selected={mode === 'login'}
			>
				Iniciar sesión
			</button>

			<button
				type="button"
				class="tab"
				class:tab--active={mode === 'register'}
				onclick={() => switchTo('register')}
				role="tab"
				aria-selected={mode === 'register'}
			>
				Registrarse
			</button>
		</div>

		{#if form?.message}
			<div class="auth-error" role="alert">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="8" x2="12" y2="12"></line>
					<line x1="12" y1="16" x2="12.01" y2="16"></line>
				</svg>
				{form.message}
			</div>
		{/if}

		{#if mode === 'login'}
			<form method="post" action="?/signInEmail" class="auth-form" use:enhance id="form-login">
				<label class="form-group">
					<span class="form-group__label">Email</span>
					<input type="email" name="email" required class="input" autocomplete="email" />
				</label>

				<label class="form-group">
					<span class="form-group__label">Contraseña</span>
					<input type="password" name="password" required class="input" autocomplete="current-password" />
				</label>

				<button type="submit" class="btn btn--primary auth-form__submit" id="btn-signin-email">
					Iniciar sesión
				</button>
			</form>
		{:else}
			<form method="post" action="?/signUpEmail" class="auth-form" use:enhance id="form-register">
				<label class="form-group">
					<span class="form-group__label">Nombre</span>
					<input type="text" name="name" required class="input" autocomplete="name" />
				</label>

				<label class="form-group">
					<span class="form-group__label">Email</span>
					<input type="email" name="email" required class="input" autocomplete="email" />
				</label>

				<label class="form-group">
					<span class="form-group__label">Contraseña</span>
					<input type="password" name="password" required class="input" autocomplete="new-password" minlength="6" />
				</label>

				<button type="submit" class="btn btn--primary auth-form__submit" id="btn-signup-email">
					Crear cuenta
				</button>

				<p class="auth-form__hint">
					Al registrarte aceptas nuestros términos de servicio.
				</p>
			</form>
		{/if}
	</div>
</main>

