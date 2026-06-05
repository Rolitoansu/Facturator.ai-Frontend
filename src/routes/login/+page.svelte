<script lang="ts">
	import { enhance } from '$app/forms';

	let mode = $state<'login' | 'register'>('login');

	// better-auth demo actions will be triggered via "?/signInEmail" / "?/signUpEmail"
	// We keep this page fully mock-styled, but backed by demo auth.
	const switchTo = (next: 'login' | 'register') => {
		mode = next;
	};
</script>

<svelte:head>
	<title>LensLedger — Login</title>
</svelte:head>

<main class="min-h-screen bg-[#0b0d0f] px-6 py-10 text-[#c8d0da]">
	<div class="mx-auto w-full max-w-md">
		<header class="mb-6">
			<p class="font-mono text-[0.7rem] tracking-[0.36em] text-[#5a6170] uppercase">LensLedger</p>
			<h1 class="mt-2 font-serif text-3xl text-[#eef1f5]">Acceder</h1>
			<p class="mt-2 text-sm text-[#8b95a3]">Mock login integrado con mejor-auth (demo).</p>
		</header>

		<div class="mb-5 flex gap-3 rounded-lg border border-[#2a2e35] bg-[#111316] p-2">
			<button
				type="button"
				class="flex-1 rounded-md border px-3 py-2 font-mono text-xs tracking-[0.24em] uppercase transition"
				onclick={() => switchTo('login')}
				style="
					border-color: {mode === 'login' ? 'rgba(74,222,128,0.25)' : '#2a2e35'};
					color: {mode === 'login' ? '#4ade80' : '#8b95a3'};
					background: {mode === 'login' ? 'rgba(74,222,128,0.08)' : 'transparent'};
				"
			>
				Login
			</button>

			<button
				type="button"
				class="flex-1 rounded-md border px-3 py-2 font-mono text-xs tracking-[0.24em] uppercase transition"
				onclick={() => switchTo('register')}
				style="
					border-color: {mode === 'register' ? 'rgba(74,222,128,0.25)' : '#2a2e35'};
					color: {mode === 'register' ? '#4ade80' : '#8b95a3'};
					background: {mode === 'register' ? 'rgba(74,222,128,0.08)' : 'transparent'};
				"
			>
				Register
			</button>
		</div>

		{#if mode === 'login'}
			<form
				method="post"
				action="?/signInEmail"
				class="rounded-xl border border-[#2a2e35] bg-[#111316] p-5"
			>
				<label class="block font-mono text-xs tracking-[0.18em] text-[#5a6170] uppercase">
					Email
					<input
						type="email"
						name="email"
						required
						class="mt-2 w-full rounded-md border border-[#353b44] bg-[#0b0d0f] px-3 py-2 text-[#c8d0da] focus:border-[#4ade80] focus:outline-none"
					/>
				</label>

				<label class="mt-4 block font-mono text-xs tracking-[0.18em] text-[#5a6170] uppercase">
					Password
					<input
						type="password"
						name="password"
						required
						class="mt-2 w-full rounded-md border border-[#353b44] bg-[#0b0d0f] px-3 py-2 text-[#c8d0da] focus:border-[#4ade80] focus:outline-none"
					/>
				</label>

				<button
					type="submit"
					class="mt-6 w-full rounded-lg border border-[#4ade80] bg-[#4ade80]/10 px-4 py-2 font-mono text-xs tracking-[0.24em] text-[#4ade80] uppercase transition hover:bg-[#4ade80]/20"
				>
					Login
				</button>

				<p class="mt-3 text-[0.75rem] text-[#8b95a3]">
					Usa el formulario demo para establecer sesión y desbloquear rutas /app/*.
				</p>
			</form>
		{:else}
			<form
				method="post"
				action="?/signUpEmail"
				class="rounded-xl border border-[#2a2e35] bg-[#111316] p-5"
			>
				<label class="block font-mono text-xs tracking-[0.18em] text-[#5a6170] uppercase">
					Email
					<input
						type="email"
						name="email"
						required
						class="mt-2 w-full rounded-md border border-[#353b44] bg-[#0b0d0f] px-3 py-2 text-[#c8d0da] focus:border-[#4ade80] focus:outline-none"
					/>
				</label>

				<label class="mt-4 block font-mono text-xs tracking-[0.18em] text-[#5a6170] uppercase">
					Password
					<input
						type="password"
						name="password"
						required
						class="mt-2 w-full rounded-md border border-[#353b44] bg-[#0b0d0f] px-3 py-2 text-[#c8d0da] focus:border-[#4ade80] focus:outline-none"
					/>
				</label>

				<label class="mt-4 block font-mono text-xs tracking-[0.18em] text-[#5a6170] uppercase">
					Name
					<input
						type="text"
						name="name"
						required
						class="mt-2 w-full rounded-md border border-[#353b44] bg-[#0b0d0f] px-3 py-2 text-[#c8d0da] focus:border-[#4ade80] focus:outline-none"
					/>
				</label>

				<button
					type="submit"
					class="mt-6 w-full rounded-lg border border-[#4ade80] bg-[#4ade80]/10 px-4 py-2 font-mono text-xs tracking-[0.24em] text-[#4ade80] uppercase transition hover:bg-[#4ade80]/20"
				>
					Register
				</button>

				<p class="mt-3 text-[0.75rem] text-[#8b95a3]">Registro demo con mejor-auth.</p>
			</form>
		{/if}
	</div>
</main>
