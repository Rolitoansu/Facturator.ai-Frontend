<script lang="ts">
	import { BADGES, METRICS } from '$lib/constants/landing';
	import { Camera, Tag, BarChart, Bell, FileText, Image as ImageIcon, Mail, MessageCircle, Table, CheckCircle2, RotateCcw, Rocket, Zap, Workflow, ShieldCheck } from 'lucide-svelte';
	import '$lib/styles/home.scss';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/dist/ScrollTrigger';
	import { magnetic, glowTracking, tilt } from '$lib/actions/interactions';

	// Scanning Simulator State
	let scanState = $state<'idle' | 'scanning' | 'processing' | 'done'>('idle');
	let scanProgress = $state(0);

	// FAQs State
	let openFaqIndex = $state<number | null>(null);

	const startScanSimulator = () => {
		if (scanState !== 'idle') return;
		scanState = 'scanning';
		scanProgress = 0;

		const interval = setInterval(() => {
			scanProgress += Math.random() * 15;
			if (scanProgress >= 100) {
				clearInterval(interval);
				scanProgress = 100;
				scanState = 'processing';
				setTimeout(() => {
					scanState = 'done';
				}, 800);
			}
		}, 200);
	};

	const resetScan = () => {
		scanState = 'idle';
		scanProgress = 0;
	};

	const toggleFaq = (index: number) => {
		openFaqIndex = openFaqIndex === index ? null : index;
	};

	onMount(() => {
		// Register ScrollTrigger
		gsap.registerPlugin(ScrollTrigger);

		// Scrollytelling Hero
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: ".scrolly-container",
				start: "top top",
				end: "+=150%",
				scrub: 1.5,
				pin: true,
			}
		});

		tl.to(".hero-sticky", {
			scale: 0.85,
			opacity: 0,
			y: -50,
			ease: "none"
		}, 0);

		tl.from(".bento-layer", {
			y: "100vh",
			opacity: 0.5,
			scale: 0.95,
			ease: "none"
		}, 0);

		// Aggressive Hero Load Animations
		const heroTl = gsap.timeline();
		heroTl.from(".hero-sticky__label", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" })
			  .from(".hero-sticky__title", { y: 40, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.6")
			  .from(".hero-sticky__sub", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
			  .from(".hero-sticky__actions > *", { scale: 0.9, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.4")
			  .from(".metric-mini", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.2");

		// Reveal texts using GSAP batch
		gsap.utils.toArray('.reveal-text').forEach((el: any) => {
			gsap.fromTo(el, 
				{ opacity: 0, y: 50, scale: 0.98 },
				{
					scrollTrigger: {
						trigger: el,
						start: "top 85%",
						toggleActions: "play none none reverse"
					},
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.8,
					ease: "power3.out"
				}
			);
		});

		return () => {
			ScrollTrigger.getAll().forEach(t => t.kill());
		};
	});
</script>

<svelte:head>
	<title>Facturator.ai — The New Standard in Invoice Automation</title>
</svelte:head>

<!-- Scrollytelling Wrapper -->
<div class="scrolly-container">
	
	<!-- Layer 1: Sticky Hero -->
	<div class="hero-sticky">
		<div class="hero-sticky__glow hero-sticky__glow--green"></div>
		<div class="hero-sticky__glow hero-sticky__glow--cyan"></div>
		
		<div class="hero-sticky__content container">
			<div class="hero-sticky__label">
				<span class="hero-sticky__label-dot"></span>
				Facturator.ai v2.0
			</div>
			
			<h1 class="hero-sticky__title">
				La plataforma inteligente para <br/>
				<span class="gradient-text">tus finanzas.</span>
			</h1>
			
			<p class="hero-sticky__sub">
				Reemplaza el caos de hojas de cálculo y carpetas físicas. Extraemos datos, cuadramos presupuestos y organizamos tus recibos a la velocidad de la luz.
			</p>
			
			<div class="hero-sticky__actions">
				<a href="/login?mode=register" class="btn btn--accent btn--large" use:magnetic={{ power: 0.5 }}>
					INICIAR AHORA
				</a>
				<button class="btn btn--outline btn--large" use:magnetic={{ power: 0.3 }} onclick={() => document.querySelector('.bento-layer')?.scrollIntoView({ behavior: 'smooth' })}>
					VER DEMO
				</button>
			</div>

		</div>
	</div>

	<!-- Layer 2: The Bento Grid Glass Layer -->
	<div class="bento-layer container">
		<div class="bento-grid">
			
			<!-- Bento Main: Interactive Scanner -->
			<div class="bento-card bento-card--main" use:glowTracking use:tilt={{ intensity: 3 }}>
				<div class="bento-card__header">
					<div class="bento-card__icon"><Zap size={18} /></div>
					<h3 class="bento-card__title">Procesamiento en Tiempo Real</h3>
				</div>
				<div class="bento-card__body bento-card__body--interactive">
					<!-- Interactive Scanner -->
					<div class="scanner-widget">
						<div class="scanner-widget__header">
							<span>sys/scan_engine.ts</span>
							<div class="scanner-widget__dots">
								<div class="scanner-widget__dot scanner-widget__dot--red"></div>
								<div class="scanner-widget__dot scanner-widget__dot--yellow"></div>
								<div class="scanner-widget__dot scanner-widget__dot--green"></div>
							</div>
						</div>
						
						<div class="scanner-widget__area">
							<div class="scanner-ticket">
								<div class="scanner-ticket__brand">RESTAURANTE EL VALLE</div>
								<div class="scanner-ticket__date">14 Mayo 2024 - 14:30</div>
								<div class="scanner-ticket__line"><span>Menú del día</span><span>€15.00</span></div>
								<div class="scanner-ticket__line"><span>Café Solo</span><span>€1.50</span></div>
								<div class="scanner-ticket__total"><span>TOTAL</span><span>€16.50</span></div>
								
								{#if scanState === 'scanning' || scanState === 'processing'}
									<div class="scanner-beam" style="top: {scanProgress}%"></div>
								{/if}
							</div>
							
							<div class="scanner-overlay" class:scanner-overlay--active={scanState === 'done'}>
								{#if scanState === 'done'}
									<div class="scanner-success">
										<CheckCircle2 size={32} class="scanner-success__icon" />
										<p>Datos extraídos con éxito</p>
										<div class="scanner-data">
											<span class="badge badge--green">€16.50</span>
											<span class="badge badge--cyan">Alimentación</span>
										</div>
									</div>
								{/if}
							</div>
						</div>
						
						<div class="scanner-widget__actions">
							{#if scanState === 'idle'}
								<button class="btn btn--accent btn--full" onclick={startScanSimulator} use:magnetic={{ power: 0.2 }}>
									<Camera size={14} /> Iniciar Escaneo Neural
								</button>
							{:else if scanState === 'done'}
								<button class="btn btn--outline btn--full" onclick={resetScan} use:magnetic={{ power: 0.2 }}>
									<RotateCcw size={14} /> Escanear Nuevo Documento
								</button>
							{:else}
								<div class="scanner-progress">
									<div class="scanner-progress__bar">
										<div class="scanner-progress__fill" style="width: {scanProgress}%"></div>
									</div>
									<span class="scanner-progress__text">Extrayendo datos... {Math.round(scanProgress)}%</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Bento Secondary 1 -->
			<div class="bento-card" use:glowTracking use:tilt={{ intensity: 5 }}>
				<div class="bento-card__header">
					<div class="bento-card__icon"><BarChart size={18} /></div>
					<h3 class="bento-card__title">Analítica predictiva</h3>
				</div>
				<div class="bento-card__body">
					<p class="bento-card__desc">Tus datos financieros transformados en gráficos accionables. Descubre patrones de gasto automáticamente.</p>
					<div class="bento-chart">
						<div class="bento-chart__bar" style="height: 40%"></div>
						<div class="bento-chart__bar" style="height: 70%"></div>
						<div class="bento-chart__bar" style="height: 50%"></div>
						<div class="bento-chart__bar" style="height: 90%"></div>
						<div class="bento-chart__bar bento-chart__bar--accent" style="height: 100%"></div>
					</div>
				</div>
			</div>

			<!-- Bento Secondary 2 -->
			<div class="bento-card" use:glowTracking use:tilt={{ intensity: 5 }}>
				<div class="bento-card__header">
					<div class="bento-card__icon"><Workflow size={18} /></div>
					<h3 class="bento-card__title">Auto-Categorización</h3>
				</div>
				<div class="bento-card__body">
					<p class="bento-card__desc">Nuestra IA aprende de tus hábitos y categoriza cada recibo. Sin reglas manuales, sin esfuerzo.</p>
					<div class="bento-tags">
						<span class="bento-tag">Software</span>
						<span class="bento-tag bento-tag--active">Viajes</span>
						<span class="bento-tag">Oficina</span>
					</div>
				</div>
			</div>
			
			<!-- Bento Secondary 3 (Wide) -->
			<div class="bento-card bento-card--wide" use:glowTracking use:tilt={{ intensity: 3 }}>
				<div class="bento-card__header">
					<div class="bento-card__icon"><ShieldCheck size={18} /></div>
					<h3 class="bento-card__title">Seguridad Criptográfica y Exportación</h3>
				</div>
				<div class="bento-card__body bento-card__body--row">
					<p class="bento-card__desc">Cumplimos con las normativas europeas. Exporta a Excel, PDF o conéctate con tu ERP en un clic.</p>
					<div class="bento-logos">
						<span class="bento-logo">Excel</span>
						<span class="bento-logo">PDF</span>
						<span class="bento-logo">CSV</span>
					</div>
				</div>
			</div>

		</div>
	</div>
</div>

<!-- Continuous Flow Section -->
<section class="deep-dive">
	<div class="container">
		<div class="reveal-text deep-dive__header">
			<h2 class="section-title">Construido para <span class="gradient-text">velocidad.</span></h2>
			<p class="section-sub">Hemos optimizado cada milisegundo. Desde el login hasta la generación de informes, la experiencia es instantánea y sin fricciones.</p>
		</div>

		<div class="deep-dive__grid">
			{#each [
				{ t: 'Multi-dispositivo', d: 'Accede desde tu móvil, tablet o desktop con sincronización en tiempo real.', i: ImageIcon },
				{ t: 'Colaboración', d: 'Invita a tu equipo o gestor para revisar y aprobar gastos juntos.', i: MessageCircle },
				{ t: 'Notificaciones', d: 'Alertas tempranas de desviación de presupuestos.', i: Bell }
			] as feat}
				{@const Icon = feat.i}
				<div class="feature-minimal reveal-text" use:glowTracking>
					<Icon size={24} class="feature-minimal__icon" />
					<h4 class="feature-minimal__title">{feat.t}</h4>
					<p class="feature-minimal__desc">{feat.d}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Pricing Section (Immersive) -->
<section class="pricing-immersive">
	<div class="container">
		<div class="pricing-immersive__header reveal-text">
			<h2 class="section-title">Precios transparentes</h2>
		</div>
		<div class="pricing-grid">
			<div class="pricing-card reveal-text" use:glowTracking>
				<h4 class="pricing-card__title">Básico</h4>
				<div class="pricing-card__price">€0<span>/mes</span></div>
				<ul class="pricing-card__list">
					<li>50 escaneos IA / mes</li>
					<li>Exportación CSV</li>
					<li>Soporte comunitario</li>
				</ul>
				<button class="btn btn--outline btn--full" use:magnetic>EMPEZAR GRATIS</button>
			</div>

			<div class="pricing-card pricing-card--featured reveal-text" use:glowTracking>
				<div class="pricing-card__badge">MOST POPULAR</div>
				<h4 class="pricing-card__title">Pro</h4>
				<div class="pricing-card__price">€12<span>/mes</span></div>
				<ul class="pricing-card__list">
					<li>Escaneos ilimitados</li>
					<li>Reglas de categorización avanzadas</li>
					<li>Exportación PDF/Excel y API</li>
					<li>Soporte prioritario</li>
				</ul>
				<button class="btn btn--accent btn--full" use:magnetic>PRUEBA DE 14 DÍAS</button>
			</div>
		</div>
	</div>
</section>

<!-- Call to Action Banner -->
<section class="cta-banner reveal-text">
	<div class="cta-banner__glow"></div>
	<div class="container">
		<h2 class="cta-banner__title">El estándar industrial en gestión de recibos</h2>
		<a href="/login?mode=register" class="btn btn--accent btn--large" use:magnetic>
			<Rocket size={16} /> ÚNETE A LA BETA
		</a>
	</div>
</section>
