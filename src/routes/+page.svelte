<script lang="ts">
	// Landing usa navegación con full reload para evitar warnings ESLint de goto()
</script>

<svelte:head>
	<title>LensLedger — Project Blueprint</title>
</svelte:head>

<!-- HERO / LANDING -->
<section id="hero">
	<div class="wrap">
		<p class="hero-eyebrow">Portfolio Project · 2026</p>
		<h1 class="hero-title">Lens<em>Ledger</em></h1>
		<p class="hero-sub">
			Aplicación web de gestión de gastos personales con visión por computadora. Sube un recibo, la
			IA extrae los datos automáticamente e integra tu dashboard financiero en tiempo real.
		</p>

		<div class="hero-badges">
			<span class="badge badge-green">EasyOCR</span>
			<span class="badge badge-cyan">WebSockets</span>
			<span class="badge badge-svelte">SvelteKit 2</span>
			<span class="badge badge-go">Go 1.22</span>
		</div>

		<div class="mt-10 flex items-center gap-4">
			<button
				type="button"
				class="inline-flex items-center justify-center rounded-lg border border-[#4ade80] bg-[#4ade80]/10 px-5 py-3 font-mono text-xs tracking-[0.24em] text-[#4ade80] uppercase transition hover:bg-[#4ade80]/20"
				onclick={() => window.location.assign('/login')}
			>
				Entrar
			</button>
			<p class="text-sm text-[#8b95a3]">
				Mock de UI (login protegido) listo para conectar backend después.
			</p>
		</div>

		<!-- Quick metrics (simple, mock) -->
		<div class="hero-metrics mt-12">
			<div class="metric">
				<div class="metric-val">2</div>
				<div class="metric-label">Devs</div>
			</div>
			<div class="metric">
				<div class="metric-val">10</div>
				<div class="metric-label">Semanas</div>
			</div>
			<div class="metric">
				<div class="metric-val">5</div>
				<div class="metric-label">Servicios</div>
			</div>
			<div class="metric">
				<div class="metric-val">3</div>
				<div class="metric-label">Capas ML</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Reuse some classes from blueprint via local minimal styling */
	:global(body) {
		margin: 0;
	}
	:global(html) {
		scroll-behavior: smooth;
	}

	.wrap {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 2rem;
		position: relative;
	}

	#hero {
		padding: 7rem 0 6rem;
		position: relative;
		overflow: hidden;
	}

	.hero-eyebrow {
		font-family: 'DM Mono', monospace;
		font-size: 0.72rem;
		color: #4ade80;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.hero-title {
		font-size: clamp(3.5rem, 8vw, 6.5rem);
		letter-spacing: -0.02em;
		margin-bottom: 1.5rem;
		line-height: 1;
	}

	.hero-title em {
		font-style: italic;
		color: #4ade80;
	}

	.hero-sub {
		font-size: 1.15rem;
		color: #8b95a3;
		max-width: 580px;
		margin-bottom: 3rem;
		line-height: 1.8;
	}

	.hero-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 3rem;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.8rem;
		border-radius: 4px;
		font-family: 'DM Mono', monospace;
		font-size: 0.75rem;
		font-weight: 500;
		border: 1px solid rgba(42, 46, 53, 1);
	}

	.badge-green {
		background: rgba(74, 222, 128, 0.1);
		color: #4ade80;
		border-color: rgba(74, 222, 128, 0.3);
	}
	.badge-cyan {
		background: rgba(34, 211, 238, 0.1);
		color: #22d3ee;
		border-color: rgba(34, 211, 238, 0.3);
	}
	.badge-svelte {
		background: rgba(255, 62, 0, 0.1);
		color: #ff3e00;
		border-color: rgba(255, 62, 0, 0.3);
	}
	.badge-go {
		background: rgba(0, 172, 215, 0.1);
		color: #00acd7;
		border-color: rgba(0, 172, 215, 0.3);
	}

	.hero-metrics {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		background: #2a2e35;
		border: 1px solid #2a2e35;
		border-radius: 8px;
		overflow: hidden;
		max-width: 600px;
	}

	.metric {
		background: #111316;
		padding: 1.25rem 1.5rem;
	}
	.metric-val {
		font-family: 'DM Serif Display', serif;
		font-size: 1.8rem;
		color: #eef1f5;
		line-height: 1;
	}
	.metric-label {
		font-family: 'DM Mono', monospace;
		font-size: 0.68rem;
		color: #5a6170;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-top: 0.3rem;
	}

	@media (max-width: 768px) {
		.hero-metrics {
			grid-template-columns: 1fr 1fr;
			max-width: unset;
		}
	}
</style>
