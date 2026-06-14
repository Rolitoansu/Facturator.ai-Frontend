<script lang="ts">
	import { resolve } from '$app/paths';
	import { BADGES, METRICS } from '$lib/constants/landing';
	import { Camera, Tag, BarChart, Bell, FileText, Image as ImageIcon, Mail, MessageCircle, Table, CheckCircle2, RotateCcw, Rocket } from 'lucide-svelte';
	import '$lib/styles/home.scss';

	// Scanning Simulator State
	let scanState = $state<'idle' | 'scanning' | 'processing' | 'done'>('idle');
	let scanProgress = $state(0);
	let scanStep = $state('');

	// Pricing Billing Cycle State
	let billingCycle = $state<'monthly' | 'yearly'>('monthly');

	// FAQ Accordion State
	let openFaqIndex = $state<number | null>(null);

	// Theme state synchronized with document structure
	let theme = $state<'dark' | 'light'>('dark');

	$effect(() => {
		const storedTheme = localStorage.getItem('theme') as 'dark' | 'light';
		if (storedTheme) {
			theme = storedTheme;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			theme = 'light';
		}
	});

	$effect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	});

	const toggleTheme = () => {
		theme = theme === 'dark' ? 'light' : 'dark';
	};

	const faqs = [
		{
			q: '¿Cómo funciona exactamente la extracción con IA?',
			a: 'Utilizamos visión por computadora avanzada (OCR) combinada con modelos de procesamiento de lenguaje natural. Cuando subes una foto o PDF de un recibo, nuestro motor localiza el comercio, extrae la fecha, calcula el importe total y categoriza el gasto de manera automática sin que tengas que rellenar ningún formulario.'
		},
		{
			q: '¿Es seguro almacenar mis tickets y datos financieros aquí?',
			a: 'Absolutamente. Todas las imágenes y datos se cifran en tránsito y en reposo. Además, no enlazamos directamente con tus cuentas bancarias reales, lo que proporciona una capa de privacidad y aislamiento total frente a accesos no autorizados.'
		},
		{
			q: '¿Puedo definir presupuestos mensuales personalizados?',
			a: 'Sí. Puedes establecer presupuestos independientes para diferentes categorías (como alimentación, transporte, ocio, etc.). El sistema te avisará con micro-alertas cuando te acerques al 80% o superes el límite configurado.'
		},
		{
			q: '¿Se pueden exportar los datos para contabilidad?',
			a: 'Por supuesto. Toda tu información se almacena estructurada y lista para ser consultada, permitiendo mantener un registro ordenado ideal para exportar de cara a deducciones fiscales, autónomos o control presupuestario personal.'
		}
	];

	const triggerScan = () => {
		if (scanState !== 'idle') return;
		scanState = 'scanning';
		scanProgress = 0;
		scanStep = 'Detectando bordes de la imagen...';

		const interval = setInterval(() => {
			scanProgress += 2;
			if (scanProgress === 30) {
				scanStep = 'Procesando texto con OCR...';
			} else if (scanProgress === 65) {
				scanStep = 'Extrayendo importe y comercio...';
			} else if (scanProgress === 85) {
				scanStep = 'Categorizando automáticamente...';
			}

			if (scanProgress >= 100) {
				clearInterval(interval);
				scanState = 'done';
				scanStep = '¡Escaneo finalizado con éxito!';
			}
		}, 50);
	};

	const resetScan = () => {
		scanState = 'idle';
		scanProgress = 0;
		scanStep = '';
	};

	const toggleFaq = (index: number) => {
		openFaqIndex = openFaqIndex === index ? null : index;
	};
</script>

<svelte:head>
	<title>Facturator.ai — Facturación Automática y Control de Gastos</title>
</svelte:head>

<div class="landing-layout">
	<!-- Navigation bar -->
	<nav class="nav">
		<div class="nav__inner">
			<a class="nav__logo" href={resolve('/')}>
				<span class="nav__logo-dot"></span>Facturator.ai
			</a>
			<div class="nav__links">
				<a class="nav__link" href="#features">Características</a>
				<a class="nav__link" href="#demo">Escáner</a>
				<a class="nav__link" href="#pricing">Precios</a>
				<a class="nav__link" href="#faqs">Preguntas</a>
			</div>
			<div class="nav__actions">
				<!-- Theme toggle -->
				<button
					type="button"
					class="theme-toggle"
					onclick={toggleTheme}
					aria-label="Cambiar tema de color"
					style="background: transparent; border: none; cursor: pointer; color: var(--color-heading); display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: 0.375rem; transition: background 0.2s;"
				>
					{#if theme === 'dark'}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							style="width: 1.1rem; height: 1.1rem;"
						>
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
						</svg>
					{:else}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							style="width: 1.1rem; height: 1.1rem;"
						>
							<circle cx="12" cy="12" r="5"></circle>
							<line x1="12" y1="1" x2="12" y2="3"></line>
							<line x1="12" y1="21" x2="12" y2="23"></line>
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
							<line x1="1" y1="12" x2="3" y2="12"></line>
							<line x1="21" y1="12" x2="23" y2="12"></line>
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
						</svg>
					{/if}
				</button>
				<a href={resolve('/login?mode=login')} class="nav__btn nav__btn--secondary">Entrar</a>
				<a href={resolve('/login?mode=register')} class="nav__btn nav__btn--primary">Registrarse</a>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<header class="hero" id="hero" aria-labelledby="hero-title">
		<div class="hero__glow"></div>
		<div class="hero__glow hero__glow--purple"></div>
		<div class="container hero__grid">
			<div class="hero__left">
				<p class="hero__eyebrow">Digitalización Financiera Inteligente</p>
				<h1 class="hero__title" id="hero-title">
					Tus facturas bajo control, <span class="gradient-text">de un vistazo</span>
				</h1>
				<p class="hero__sub">
					Sube tus tickets y facturas. Nuestro sistema extrae importes, comercios, fechas y categorías de
					forma automática. Observa cómo tus presupuestos y estadísticas se actualizan al instante en
					un dashboard impecable y dinámico.
				</p>

				<div class="hero__actions">
					<a href={resolve('/login?mode=register')} class="btn btn--accent btn--large">Pruébalo Gratis</a>
					<a href="#demo" class="btn btn--outline btn--large">Ver Demostración</a>
				</div>

				<div class="hero__metrics">
					{#each METRICS as metric (metric.label)}
						<div class="metric">
							<div class="metric__val">{metric.val}</div>
							<div class="metric__label">{metric.label}</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="hero__right">
				<!-- Application CSS Mockup Preview -->
				<div class="app-mockup">
					<div class="app-mockup__header">
						<span class="app-mockup__dot app-mockup__dot--red"></span>
						<span class="app-mockup__dot app-mockup__dot--yellow"></span>
						<span class="app-mockup__dot app-mockup__dot--green"></span>
						<span class="app-mockup__title">facturator.ai/app/dashboard</span>
					</div>
					<div class="app-mockup__body">
						<!-- Mini metrics -->
						<div class="mock-row mock-row--three">
							<div class="mock-card">
								<span class="mock-card__label">Total Mayo</span>
								<span class="mock-card__val">€642,80</span>
							</div>
							<div class="mock-card">
								<span class="mock-card__label">Disponible</span>
								<span class="mock-card__val mock-card__val--green">€257,20</span>
							</div>
							<div class="mock-card">
								<span class="mock-card__label">Escaneados</span>
								<span class="mock-card__val">12 items</span>
							</div>
						</div>

						<!-- Mini Budget card -->
						<div class="mock-card mock-card--wide">
							<div class="mock-card__head">
								<span class="badge badge--green">Alimentación</span>
								<span class="mock-card__meta">€220.00 / €350.00 EUR</span>
							</div>
							<div class="mock-bar">
								<div class="mock-bar__fill" style="width: 63%;"></div>
							</div>
						</div>

						<!-- Mini Chart -->
						<div class="mock-card mock-card--wide mock-chart">
							<span class="mock-card__label">Historial de Gastos</span>
							<div class="mock-chart__bars">
								<div class="mock-chart__bar" style="height: 40%;"></div>
								<div class="mock-chart__bar" style="height: 65%;"></div>
								<div class="mock-chart__bar" style="height: 30%;"></div>
								<div class="mock-chart__bar" style="height: 50%;"></div>
								<div class="mock-chart__bar" style="height: 80%;"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Trust Logos Area -->
	<section class="trust-bar">
		<div class="container">
			<p class="trust-bar__title">Compatible con tus formatos e integraciones favoritas</p>
			<div class="trust-bar__logos">
				<span class="trust-logo" style="display:inline-flex; align-items:center; gap:0.4rem;"><FileText size={20} /> PDFs</span>
				<span class="trust-logo" style="display:inline-flex; align-items:center; gap:0.4rem;"><ImageIcon size={20} /> Imágenes (PNG/JPG)</span>
				<span class="trust-logo" style="display:inline-flex; align-items:center; gap:0.4rem;"><Mail size={20} /> Email Forwarding</span>
				<span class="trust-logo" style="display:inline-flex; align-items:center; gap:0.4rem;"><MessageCircle size={20} /> WhatsApp Upload</span>
				<span class="trust-logo" style="display:inline-flex; align-items:center; gap:0.4rem;"><Table size={20} /> Exportación Excel</span>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="features" id="features">
		<div class="container">
			<div class="section-header">
				<p class="section-label">01 — Características</p>
				<h2 class="section-title">Olvídate de rellenar tablas a mano</h2>
				<p class="section-sub">
					Facturator.ai elimina la fricción de llevar la contabilidad personal. Sube una foto y observa
					lo rápido que se procesa la información.
				</p>
			</div>

			<div class="features__grid">
				<article class="feature-card">
					<div class="feature-card__icon"><Camera size={32} /></div>
					<h3 class="feature-card__title">Escaneo Inteligente OCR</h3>
					<p class="feature-card__body">
						Digitaliza cualquier ticket impreso o factura digital. Nuestro extractor automatizado lee y
						estructura la información al instante.
					</p>
				</article>

				<article class="feature-card">
					<div class="feature-card__icon"><Tag size={32} /></div>
					<h3 class="feature-card__title">Categorización Automática</h3>
					<p class="feature-card__body">
						El sistema deduce de forma automática si un recibo pertenece a Alimentación, Transporte, Ocio
						o Salud, ordenándolos en tu dashboard.
					</p>
				</article>

				<article class="feature-card">
					<div class="feature-card__icon"><BarChart size={32} /></div>
					<h3 class="feature-card__title">Gráficos Analíticos</h3>
					<p class="feature-card__body">
						Visualiza de manera intuitiva a dónde va tu dinero cada mes para tomar mejores decisiones
						y optimizar tu capacidad de ahorro.
					</p>
				</article>

				<article class="feature-card">
					<div class="feature-card__icon"><Bell size={32} /></div>
					<h3 class="feature-card__title">Límites y Alertas</h3>
					<p class="feature-card__body">
						Configura presupuestos máximos por categoría. El sistema te avisará con micro-alertas
						visuales antes de que superes tus límites.
					</p>
				</article>
			</div>
		</div>
	</section>

	<!-- Interactive Demo / Scanner Simulator Section -->
	<section class="demo-section" id="demo">
		<div class="container">
			<div class="section-header">
				<p class="section-label">02 — Simulador de Escaneo</p>
				<h2 class="section-title">Compruébalo en tiempo real</h2>
				<p class="section-sub">Haz clic abajo para simular cómo Facturator.ai procesa un ticket real.</p>
			</div>

			<div class="demo-box">
				<div class="demo-box__grid">
					<!-- Ticket display -->
					<div class="ticket-view">
						<div class="ticket-view__paper" class:ticket-view__paper--scanning={scanState === 'scanning'}>
							<!-- Absolute Bounding Boxes to simulate OCR scanning zones -->
							{#if scanState === 'scanning'}
								{#if scanProgress >= 15 && scanProgress < 45}
									<div class="ocr-bounding-box" style="top: 8%; left: 5%; width: 90%; height: 12%; border-color: var(--color-cyan);"></div>
								{/if}
								{#if scanProgress >= 45 && scanProgress < 75}
									<div class="ocr-bounding-box" style="top: 25%; left: 5%; width: 90%; height: 32%; border-color: var(--color-amber);"></div>
								{/if}
								{#if scanProgress >= 75}
									<div class="ocr-bounding-box" style="top: 70%; left: 5%; width: 90%; height: 18%; border-color: var(--color-accent); border-width: 2px;"></div>
								{/if}
							{/if}

							<span class="ticket-view__title">SUPERMERCADOS DIA</span>
							<span class="ticket-view__divider">-------------------------</span>
							<span class="ticket-view__item">Pan Rústico ......... 1.20€</span>
							<span class="ticket-view__item">Manzanas 1kg ........ 2.45€</span>
							<span class="ticket-view__item">Aceite de Oliva ..... 8.50€</span>
							<span class="ticket-view__item">Pechuga Pollo ....... 5.35€</span>
							<span class="ticket-view__divider">-------------------------</span>
							<span class="ticket-view__total">TOTAL 17.50 EUR</span>
							<span class="ticket-view__date">Fecha: 07/06/2026</span>
							
							{#if scanState === 'scanning'}
								<div class="ticket-view__laser"></div>
							{/if}
						</div>
					</div>

					<!-- Scan console and results -->
					<div class="scanner-console">
						{#if scanState === 'idle'}
							<h3 class="scanner-console__title">Demostración en vivo</h3>
							<p class="scanner-console__text">
								Inicia la demostración para observar el proceso de lectura OCR, análisis de texto e integración financiera de un ticket de compra.
							</p>
							<button type="button" class="btn btn--accent btn--large" style="display:inline-flex; align-items:center; gap:0.5rem;" onclick={triggerScan}>
								<Rocket size={20} /> Escanear Ticket de Ejemplo
							</button>
						{:else if scanState === 'scanning'}
							<h3 class="scanner-console__title">Procesando imagen...</h3>
							<div class="progress-container">
								<div class="progress-bar">
									<div class="progress-bar__fill" style="width: {scanProgress}%;"></div>
								</div>
								<span class="progress-text">{scanProgress}%</span>
							</div>
							<div class="scanner-console__log">
								<span class="log-dot"></span> {scanStep}
							</div>
						{:else if scanState === 'done'}
							<h3 class="scanner-console__title">¡Gasto Extraído Correctamente!</h3>
							
							<!-- Structural extracted result card -->
							<div class="extracted-card">
								<div class="extracted-card__header">
									<span class="badge badge--green">Alimentación</span>
									<span class="extracted-card__date">2026-06-07</span>
								</div>
								<h4 class="extracted-card__merchant">Supermercados Dia</h4>
								<span class="extracted-card__amount">€17.50 EUR</span>
								<p class="extracted-card__status" style="display:flex; align-items:center; gap:0.4rem;"><CheckCircle2 size={16} /> Estado: Añadido al Dashboard</p>
							</div>

							<div class="scanner-console__actions">
								<button type="button" class="btn btn--secondary" style="display:inline-flex; align-items:center; gap:0.5rem;" onclick={resetScan}>
									<RotateCcw size={16} /> Restablecer
								</button>
								<a href={resolve('/login?mode=register')} class="btn btn--accent">
									Probar Con Mis Tickets
								</a>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section class="pricing" id="pricing">
		<div class="container">
			<div class="section-header">
				<p class="section-label">03 — Planes de Precios</p>
				<h2 class="section-title">Elige el plan ideal para tus finanzas</h2>
				<p class="section-sub">Empieza gratis y escala a medida que crezcan tus necesidades.</p>

				<!-- Billing cycle switcher -->
				<div class="pricing-toggle">
					<button
						type="button"
						class="pricing-toggle__btn"
						class:pricing-toggle__btn--active={billingCycle === 'monthly'}
						onclick={() => (billingCycle = 'monthly')}
					>
						Mensual
					</button>
					<button
						type="button"
						class="pricing-toggle__btn"
						class:pricing-toggle__btn--active={billingCycle === 'yearly'}
						onclick={() => (billingCycle = 'yearly')}
					>
						Anual <span class="pricing-toggle__discount">Ahorra 20%</span>
					</button>
				</div>
			</div>

			<div class="pricing__grid">
				<!-- Card 1 -->
				<div class="pricing-card">
					<h3 class="pricing-card__title">Plan Inicial</h3>
					<span class="pricing-card__price">
						€0
						<span class="pricing-card__meta">
							{billingCycle === 'monthly' ? '/ mes' : '/ mes (anual)'}
						</span>
					</span>
					<p class="pricing-card__desc">Ideal para probar la herramienta y llevar un control básico.</p>
					<hr class="pricing-card__divider" />
					<ul class="pricing-card__features">
						<li>Hasta 15 tickets escaneados al mes</li>
						<li>Extracción automática de datos con OCR</li>
						<li>Dashboard financiero mensual</li>
						<li>Visualización básica de categorías</li>
					</ul>
					<a
						href={resolve('/login?mode=register')}
						class="btn btn--outline btn--full"
						style="margin-top: auto;"
					>
						Empezar Gratis
					</a>
				</div>

				<!-- Card 2 -->
				<div class="pricing-card pricing-card--featured">
					<span class="pricing-card__badge">RECOMENDADO</span>
					<h3 class="pricing-card__title">Plan Pro</h3>
					<span class="pricing-card__price">
						{billingCycle === 'monthly' ? '€5.99' : '€4.79'}
						<span class="pricing-card__meta">
							{billingCycle === 'monthly' ? '/ mes' : '/ mes (anual)'}
						</span>
					</span>
					<p class="pricing-card__desc">Perfecto para usuarios habituales y autónomos organizados.</p>
					{#if billingCycle === 'yearly'}
						<p class="pricing-card__submeta">Facturado anualmente (€57.50 / año)</p>
					{/if}
					<hr class="pricing-card__divider" />
					<ul class="pricing-card__features">
						<li>Escaneos ilimitados sin restricciones</li>
						<li>Categorización automatizada</li>
						<li>Alertas y presupuestos ilimitados</li>
						<li>Exportación de informes en PDF y CSV</li>
						<li>Soporte técnico prioritario</li>
					</ul>
					<a
						href={resolve('/login?mode=register')}
						class="btn btn--accent btn--full"
						style="margin-top: auto;"
					>
						Obtener Pro
					</a>
				</div>

				<!-- Card 3 -->
				<div class="pricing-card">
					<h3 class="pricing-card__title">Plan Business</h3>
					<span class="pricing-card__price">
						{billingCycle === 'monthly' ? '€19.99' : '€15.99'}
						<span class="pricing-card__meta">
							{billingCycle === 'monthly' ? '/ mes' : '/ mes (anual)'}
						</span>
					</span>
					<p class="pricing-card__desc">Pensado para pequeños equipos y negocios multi-usuario.</p>
					{#if billingCycle === 'yearly'}
						<p class="pricing-card__submeta">Facturado anualmente (€191.90 / año)</p>
					{/if}
					<hr class="pricing-card__divider" />
					<ul class="pricing-card__features">
						<li>Cuentas de usuario compartidas (hasta 5)</li>
						<li>Escaneo masivo de tickets en lote</li>
						<li>Integración directa con software contable</li>
						<li>Exportación de datos de impuestos directa</li>
					</ul>
					<a
						href={resolve('/login?mode=register')}
						class="btn btn--outline btn--full"
						style="margin-top: auto;"
					>
						Contactar Soporte
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- FAQs Section -->
	<section class="faqs" id="faqs">
		<div class="container">
			<div class="section-header">
				<p class="section-label">04 — Preguntas Frecuentes</p>
				<h2 class="section-title">Resuelve tus dudas sobre Facturator.ai</h2>
			</div>

			<div class="faqs__list">
				{#each faqs as faq, i (i)}
					<div class="faq-item" class:faq-item--open={openFaqIndex === i}>
						<button type="button" class="faq-item__header" onclick={() => toggleFaq(i)}>
							<span class="faq-item__question">{faq.q}</span>
							<span class="faq-item__icon">{openFaqIndex === i ? '−' : '＋'}</span>
						</button>
						{#if openFaqIndex === i}
							<div class="faq-item__body">
								<p class="faq-item__answer">{faq.a}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Call to Action Banner -->
	<section class="cta-banner">
		<div class="cta-banner__glow"></div>
		<div class="container">
			<h2 class="cta-banner__title">Comienza a ahorrar tiempo hoy mismo</h2>
			<p class="cta-banner__sub">Regístrate y experimenta la tranquilidad de tener todas tus facturas y presupuestos organizados automáticamente.</p>
			<a href={resolve('/login?mode=register')} class="btn btn--accent btn--large">Crear Mi Cuenta Gratis</a>
		</div>
	</section>

	<!-- Technology Footer -->
	<footer class="footer">
		<div class="container footer__inner">
			<div class="footer__brand">
				<span class="footer__logo">Facturator.ai</span>
				<p class="footer__tagline">Organización financiera simplificada y automatizada.</p>
			</div>
			
			<div class="footer__tech">
				<span class="footer__tech-title">Tecnología Sólida Detrás:</span>
				<div class="footer__tech-badges">
					{#each BADGES as badge (badge.label)}
						<span class="badge badge--{badge.modifier}">{badge.label}</span>
					{/each}
				</div>
			</div>
		</div>
		<div class="footer__bottom">
			<div class="container footer__bottom-inner">
				<p class="footer__copy">© 2026 Facturator.ai. Todos los derechos reservados.</p>
				<div class="footer__links">
					<a href="#hero">Inicio</a>
					<a href="#features">Características</a>
					<a href={resolve('/login?mode=login')}>Acceso</a>
				</div>
			</div>
		</div>
	</footer>
</div>
