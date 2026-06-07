<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import '$lib/styles/login.scss';

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
			<form method="post" action="?/signInEmail" class="auth-form" use:enhance>
				<label class="form-group">
					<span class="form-group__label">Email</span>
					<input type="email" name="email" required class="input" />
				</label>

				<label class="form-group">
					<span class="form-group__label">Password</span>
					<input type="password" name="password" required class="input" />
				</label>

				<button type="submit" class="btn btn--primary auth-form__submit"> Login </button>

				<p class="auth-form__hint">
					Usa el formulario demo para establecer sesión y desbloquear rutas /app/*.
				</p>
			</form>
		{:else}
			<form method="post" action="?/signUpEmail" class="auth-form" use:enhance>
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

				<button type="submit" class="btn btn--primary auth-form__submit"> Register </button>

				<p class="auth-form__hint">Registro demo con mejor-auth.</p>
			</form>
		{/if}
	</div>
</main>
