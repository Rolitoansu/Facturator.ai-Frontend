import { useState, useEffect, useRef } from 'react';

/* ─── DESIGN TOKENS ─── */
const T = {
	bg: '#0b0d0f',
	bg2: '#111316',
	bg3: '#181b1f',
	surface: '#1e2126',
	border: '#2a2e35',
	border2: '#353b44',
	muted: '#5a6170',
	subtle: '#8b95a3',
	body: '#c8d0da',
	heading: '#eef1f5',
	accent: '#4ade80',
	accent2: '#22d3ee',
	accent3: '#f59e0b',
	accent4: '#a78bfa',
	danger: '#f87171'
};

/* ─── GLOBAL STYLES ─── */
const GlobalStyle = () => (
	<style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: ${T.bg};
      color: ${T.body};
      font-family: 'Instrument Sans', sans-serif;
      font-size: 15px;
      line-height: 1.7;
      overflow-x: hidden;
    }

    /* noise overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: 0.025; pointer-events: none; z-index: 9999;
    }

    /* grid bg */
    body::after {
      content: '';
      position: fixed; inset: 0;
      background-image:
        linear-gradient(${T.border} 1px, transparent 1px),
        linear-gradient(90deg, ${T.border} 1px, transparent 1px);
      background-size: 80px 80px;
      opacity: 0.15; pointer-events: none; z-index: 0;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${T.bg}; }
    ::-webkit-scrollbar-thumb { background: ${T.border2}; border-radius: 3px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes progressFill {
      from { width: 0; }
    }
    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .anim-fade-up { animation: fadeUp 0.5s ease both; }
    .anim-d1 { animation-delay: 0.1s; }
    .anim-d2 { animation-delay: 0.2s; }
    .anim-d3 { animation-delay: 0.3s; }
    .anim-d4 { animation-delay: 0.4s; }
    .anim-d5 { animation-delay: 0.5s; }
    .anim-d6 { animation-delay: 0.6s; }

    button { cursor: pointer; font-family: inherit; }
    input, textarea { font-family: inherit; }
  `}</style>
);

/* ─── COMPONENTS ─── */

// CategoryBadge
const CATEGORY_COLORS = {
	alimentación: { bg: 'rgba(74,222,128,0.12)', color: T.accent, border: 'rgba(74,222,128,0.25)' },
	transporte: { bg: 'rgba(34,211,238,0.12)', color: T.accent2, border: 'rgba(34,211,238,0.25)' },
	ropa: { bg: 'rgba(255,62,0,0.12)', color: '#ff7a52', border: 'rgba(255,62,0,0.25)' },
	ocio: { bg: 'rgba(167,139,250,0.12)', color: T.accent4, border: 'rgba(167,139,250,0.25)' },
	salud: { bg: 'rgba(245,158,11,0.12)', color: T.accent3, border: 'rgba(245,158,11,0.25)' },
	hogar: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
	otros: { bg: 'rgba(90,97,112,0.15)', color: T.subtle, border: T.border2 }
};

const CategoryBadge = ({ cat, size = 'sm' }) => {
	const c = CATEGORY_COLORS[cat] || CATEGORY_COLORS.otros;
	return (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				padding: size === 'sm' ? '0.15rem 0.6rem' : '0.3rem 0.8rem',
				borderRadius: '4px',
				background: c.bg,
				color: c.color,
				border: `1px solid ${c.border}`,
				fontFamily: "'DM Mono', monospace",
				fontSize: size === 'sm' ? '0.68rem' : '0.75rem',
				fontWeight: 500,
				whiteSpace: 'nowrap'
			}}
		>
			{cat}
		</span>
	);
};

// ReceiptCard
const ReceiptCard = ({ receipt }) => {
	const statusColor =
		receipt.status === 'done' ? T.accent : receipt.status === 'error' ? T.danger : T.accent3;
	const statusLabel = {
		done: 'procesado',
		processing: 'procesando…',
		pending: 'en cola',
		error: 'error'
	};
	return (
		<div
			style={{
				background: T.bg2,
				border: `1px solid ${T.border}`,
				borderRadius: '8px',
				padding: '1rem 1.25rem',
				display: 'flex',
				alignItems: 'center',
				gap: '1rem',
				transition: 'border-color 0.2s'
			}}
			onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.border2)}
			onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
		>
			{/* status dot */}
			<div
				style={{
					width: 8,
					height: 8,
					borderRadius: '50%',
					background: statusColor,
					flexShrink: 0,
					animation: receipt.status === 'processing' ? 'pulse 1.4s ease infinite' : 'none'
				}}
			/>
			{/* thumb */}
			<div
				style={{
					width: 40,
					height: 40,
					borderRadius: '6px',
					background: T.surface,
					border: `1px solid ${T.border}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
					fontSize: '1.1rem'
				}}
			>
				🧾
			</div>
			{/* info */}
			<div style={{ flex: 1, minWidth: 0 }}>
				<div
					style={{ color: T.heading, fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.2rem' }}
				>
					{receipt.merchant}
				</div>
				<div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
					<CategoryBadge cat={receipt.category} />
					<span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: T.muted }}>
						{receipt.date}
					</span>
				</div>
			</div>
			{/* amount + status */}
			<div style={{ textAlign: 'right', flexShrink: 0 }}>
				<div
					style={{
						fontFamily: "'DM Serif Display', serif",
						fontSize: '1.1rem',
						color: T.heading,
						marginBottom: '0.15rem'
					}}
				>
					{receipt.status === 'done' ? receipt.amount : '—'}
				</div>
				<span
					style={{
						fontFamily: "'DM Mono', monospace",
						fontSize: '0.65rem',
						color: statusColor,
						letterSpacing: '0.05em',
						textTransform: 'uppercase'
					}}
				>
					{statusLabel[receipt.status]}
				</span>
			</div>
		</div>
	);
};

// BudgetBar
const BudgetBar = ({ label, spent, limit, cat }) => {
	const pct = Math.min((spent / limit) * 100, 100);
	const over80 = pct >= 80;
	const over100 = pct >= 100;
	const barColor = over100 ? T.danger : over80 ? T.accent3 : T.accent;
	return (
		<div style={{ marginBottom: '1rem' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '0.4rem'
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<CategoryBadge cat={cat} />
					<span style={{ fontSize: '0.83rem', color: T.body }}>{label}</span>
				</div>
				<div
					style={{
						fontFamily: "'DM Mono', monospace",
						fontSize: '0.78rem',
						color: over80 ? barColor : T.subtle
					}}
				>
					€{spent.toLocaleString()} / €{limit.toLocaleString()}
				</div>
			</div>
			<div
				style={{
					background: T.surface,
					borderRadius: '3px',
					height: 6,
					border: `1px solid ${T.border}`,
					overflow: 'hidden'
				}}
			>
				<div
					style={{
						height: '100%',
						borderRadius: '2px',
						width: `${pct}%`,
						background: barColor,
						transition: 'width 0.8s ease',
						animation: 'progressFill 0.8s ease both'
					}}
				/>
			</div>
			{over80 && (
				<div
					style={{
						marginTop: '0.3rem',
						fontFamily: "'DM Mono', monospace",
						fontSize: '0.65rem',
						color: barColor,
						display: 'flex',
						alignItems: 'center',
						gap: '0.3rem'
					}}
				>
					⚠ {over100 ? 'Presupuesto superado' : `${Math.round(pct)}% consumido`}
				</div>
			)}
		</div>
	);
};

// SpendingChart (bar chart)
const SpendingChart = ({ data }) => {
	const max = Math.max(...data.map((d) => d.value));
	return (
		<div
			style={{
				background: T.bg3,
				border: `1px solid ${T.border}`,
				borderRadius: '8px',
				padding: '1.25rem'
			}}
		>
			<div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: 120 }}>
				{data.map((d, i) => (
					<div
						key={i}
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 4,
							height: '100%'
						}}
					>
						<div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
							<div
								style={{
									width: '100%',
									height: `${(d.value / max) * 100}%`,
									minHeight: 4,
									background: d.color || T.accent,
									borderRadius: '3px 3px 0 0',
									opacity: 0.8,
									transition: 'height 0.6s ease'
								}}
							/>
						</div>
						<span
							style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: T.muted }}
						>
							{d.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

// UploadDropzone
const UploadDropzone = ({ onUpload, status }) => {
	const [dragging, setDragging] = useState(false);
	const [preview, setPreview] = useState(null);
	const inputRef = useRef(null);

	const handleFile = (file) => {
		if (!file) return;
		const url = URL.createObjectURL(file);
		setPreview(url);
		setTimeout(() => onUpload(file), 300);
	};

	return (
		<div>
			<div
				onClick={() => inputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					setDragging(true);
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={(e) => {
					e.preventDefault();
					setDragging(false);
					handleFile(e.dataTransfer.files[0]);
				}}
				style={{
					border: `2px dashed ${dragging ? T.accent : T.border2}`,
					borderRadius: '12px',
					padding: '3rem 2rem',
					textAlign: 'center',
					cursor: 'pointer',
					background: dragging ? 'rgba(74,222,128,0.04)' : T.bg3,
					transition: 'all 0.2s',
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					style={{ display: 'none' }}
					onChange={(e) => handleFile(e.target.files[0])}
				/>

				{preview ? (
					<div
						style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
					>
						<img
							src={preview}
							alt="preview"
							style={{
								maxWidth: 200,
								maxHeight: 150,
								borderRadius: '8px',
								border: `1px solid ${T.border}`,
								objectFit: 'cover'
							}}
						/>
						<div
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.75rem',
								color: status === 'processing' ? T.accent3 : T.accent,
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem'
							}}
						>
							{status === 'processing' ? (
								<>
									<div
										style={{
											width: 12,
											height: 12,
											borderRadius: '50%',
											border: `2px solid ${T.accent3}`,
											borderTopColor: 'transparent',
											animation: 'spin 0.8s linear infinite'
										}}
									/>
									analizando imagen con OCR…
								</>
							) : (
								<>
									<span>✓</span> procesado correctamente
								</>
							)}
						</div>
					</div>
				) : (
					<>
						<div
							style={{
								fontSize: '2.5rem',
								marginBottom: '1rem',
								animation: 'float 3s ease infinite'
							}}
						>
							📸
						</div>
						<p style={{ color: T.heading, fontWeight: 600, marginBottom: '0.5rem' }}>
							Arrastra tu recibo aquí
						</p>
						<p style={{ color: T.subtle, fontSize: '0.85rem', marginBottom: '1.25rem' }}>
							o haz clic para seleccionar un archivo
						</p>
						<div
							style={{
								display: 'inline-flex',
								gap: '0.5rem',
								flexWrap: 'wrap',
								justifyContent: 'center'
							}}
						>
							{['JPG', 'PNG', 'HEIC', 'PDF'].map((f) => (
								<span
									key={f}
									style={{
										fontFamily: "'DM Mono', monospace",
										fontSize: '0.65rem',
										padding: '0.2rem 0.5rem',
										borderRadius: '3px',
										border: `1px solid ${T.border2}`,
										color: T.muted
									}}
								>
									{f}
								</span>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

/* ─── SIDEBAR ─── */
const Sidebar = ({ active, setActive }) => {
	const items = [
		{ id: 'dashboard', icon: '▦', label: 'Dashboard' },
		{ id: 'upload', icon: '⊕', label: 'Subir recibo' },
		{ id: 'history', icon: '≡', label: 'Historial' },
		{ id: 'budget', icon: '◎', label: 'Presupuesto' }
	];

	return (
		<div
			style={{
				width: 220,
				flexShrink: 0,
				background: T.bg2,
				borderRight: `1px solid ${T.border}`,
				display: 'flex',
				flexDirection: 'column',
				padding: '1.5rem 1rem',
				position: 'relative',
				zIndex: 1
			}}
		>
			{/* Logo */}
			<div
				style={{
					fontFamily: "'DM Serif Display', serif",
					fontSize: '1.15rem',
					color: T.heading,
					marginBottom: '2.5rem',
					display: 'flex',
					alignItems: 'center',
					gap: '0.5rem',
					paddingLeft: '0.5rem'
				}}
			>
				<div style={{ width: 8, height: 8, borderRadius: '50%', background: T.accent }} />
				LensLedger
			</div>

			{/* Nav */}
			<nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
				{items.map((item) => (
					<button
						key={item.id}
						onClick={() => setActive(item.id)}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '0.75rem',
							padding: '0.55rem 0.75rem',
							borderRadius: '6px',
							border:
								active === item.id ? `1px solid rgba(74,222,128,0.2)` : '1px solid transparent',
							background: active === item.id ? 'rgba(74,222,128,0.08)' : 'transparent',
							color: active === item.id ? T.accent : T.subtle,
							fontSize: '0.85rem',
							fontWeight: active === item.id ? 600 : 400,
							transition: 'all 0.15s',
							cursor: 'pointer',
							textAlign: 'left'
						}}
						onMouseEnter={(e) => {
							if (active !== item.id) {
								e.currentTarget.style.background = T.surface;
								e.currentTarget.style.color = T.body;
							}
						}}
						onMouseLeave={(e) => {
							if (active !== item.id) {
								e.currentTarget.style.background = 'transparent';
								e.currentTarget.style.color = T.subtle;
							}
						}}
					>
						<span style={{ fontFamily: 'monospace', fontSize: '0.9rem', opacity: 0.8 }}>
							{item.icon}
						</span>
						{item.label}
					</button>
				))}
			</nav>

			{/* User */}
			<div
				style={{
					borderTop: `1px solid ${T.border}`,
					paddingTop: '1rem',
					marginTop: '1rem',
					display: 'flex',
					alignItems: 'center',
					gap: '0.75rem'
				}}
			>
				<div
					style={{
						width: 32,
						height: 32,
						borderRadius: '50%',
						background: 'linear-gradient(135deg, rgba(74,222,128,0.3), rgba(34,211,238,0.3))',
						border: `1px solid ${T.border2}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '0.8rem',
						color: T.accent,
						fontWeight: 700,
						fontFamily: "'DM Mono', monospace"
					}}
				>
					IV
				</div>
				<div>
					<div style={{ fontSize: '0.8rem', color: T.heading, fontWeight: 600 }}>Ivan</div>
					<div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: T.muted }}>
						ivan@hiberus.com
					</div>
				</div>
			</div>
		</div>
	);
};

/* ─── APP SHELL ─── */
const AppShell = ({ children, active, setActive }) => (
	<div
		style={{
			display: 'flex',
			height: '100vh',
			overflow: 'hidden',
			position: 'relative',
			zIndex: 1
		}}
	>
		<Sidebar active={active} setActive={setActive} />
		<div
			style={{
				flex: 1,
				overflow: 'auto',
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			{/* Topbar */}
			<div
				style={{
					background: 'rgba(11,13,15,0.8)',
					backdropFilter: 'blur(12px)',
					borderBottom: `1px solid ${T.border}`,
					padding: '0.75rem 1.75rem',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					position: 'sticky',
					top: 0,
					zIndex: 10,
					flexShrink: 0
				}}
			>
				<div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: T.muted }}>
					lensledger.app/{active}
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
					{/* WS indicator */}
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
						<div
							style={{
								width: 6,
								height: 6,
								borderRadius: '50%',
								background: T.accent,
								animation: 'pulse 2s ease infinite'
							}}
						/>
						<span
							style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: T.muted }}
						>
							ws:connected
						</span>
					</div>
					{/* Month */}
					<div
						style={{
							fontFamily: "'DM Mono', monospace",
							fontSize: '0.72rem',
							padding: '0.25rem 0.65rem',
							borderRadius: '4px',
							border: `1px solid ${T.border}`,
							color: T.subtle,
							background: T.surface
						}}
					>
						Mayo 2026
					</div>
				</div>
			</div>
			<div style={{ flex: 1, padding: '2rem 2rem', overflow: 'auto' }}>{children}</div>
		</div>
	</div>
);

/* ─── PAGES ─── */

/* LANDING */
const LandingPage = ({ onEnter }) => {
	const [typed, setTyped] = useState('');
	const full = 'Sube un recibo. La IA hace el resto.';

	useEffect(() => {
		let i = 0;
		const t = setInterval(() => {
			setTyped(full.slice(0, i + 1));
			i++;
			if (i >= full.length) clearInterval(t);
		}, 38);
		return () => clearInterval(t);
	}, []);

	const features = [
		{
			icon: '🔍',
			title: 'OCR automático',
			desc: 'EasyOCR extrae texto de cualquier recibo, ticket o factura en múltiples idiomas.'
		},
		{
			icon: '🧠',
			title: 'Clasificación ML',
			desc: 'Random Forest categoriza el gasto con >90% de precisión sin intervención manual.'
		},
		{
			icon: '⚡',
			title: 'Tiempo real',
			desc: 'WebSocket notifica al instante cuando el procesado termina. Sin polling, sin recargar.'
		},
		{
			icon: '📊',
			title: 'Dashboard financiero',
			desc: 'Gráficos interactivos por categoría y mes. Presupuestos con alertas automáticas.'
		}
	];

	return (
		<div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
			{/* Hero */}
			<div
				style={{
					padding: '0 2rem',
					maxWidth: 1100,
					margin: '0 auto'
				}}
			>
				{/* Nav */}
				<div
					style={{
						position: 'sticky',
						top: 0,
						zIndex: 100,
						backdropFilter: 'blur(16px)',
						background: 'rgba(11,13,15,0.88)',
						borderBottom: `1px solid ${T.border}`,
						padding: '0.75rem 0',
						margin: '0 -2rem',
						paddingLeft: '2rem',
						paddingRight: '2rem',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}
				>
					<div
						style={{
							fontFamily: "'DM Serif Display', serif",
							fontSize: '1.2rem',
							color: T.heading,
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem'
						}}
					>
						<div style={{ width: 8, height: 8, borderRadius: '50%', background: T.accent }} />
						LensLedger
					</div>
					<div style={{ display: 'flex', gap: '0.5rem' }}>
						{['Producto', 'Stack', 'Roadmap'].map((l) => (
							<button
								key={l}
								style={{
									background: 'none',
									border: 'none',
									color: T.subtle,
									fontSize: '0.8rem',
									fontFamily: "'DM Mono', monospace",
									padding: '0.35rem 0.75rem',
									borderRadius: '4px',
									transition: 'all 0.15s'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = T.heading;
									e.currentTarget.style.background = T.surface;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = T.subtle;
									e.currentTarget.style.background = 'none';
								}}
							>
								{l}
							</button>
						))}
						<button
							onClick={onEnter}
							style={{
								background: 'rgba(74,222,128,0.15)',
								border: `1px solid rgba(74,222,128,0.3)`,
								color: T.accent,
								padding: '0.35rem 1rem',
								borderRadius: '4px',
								fontSize: '0.8rem',
								fontFamily: "'DM Mono', monospace",
								transition: 'all 0.15s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'rgba(74,222,128,0.25)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'rgba(74,222,128,0.15)';
							}}
						>
							Entrar →
						</button>
					</div>
				</div>

				{/* Hero content */}
				<div style={{ paddingTop: '6rem', paddingBottom: '5rem', position: 'relative' }}>
					{/* glow */}
					<div
						style={{
							position: 'absolute',
							width: 600,
							height: 600,
							borderRadius: '50%',
							background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
							top: -80,
							right: -200,
							pointerEvents: 'none'
						}}
					/>

					<p
						className="anim-fade-up"
						style={{
							fontFamily: "'DM Mono', monospace",
							fontSize: '0.72rem',
							color: T.accent,
							letterSpacing: '0.15em',
							textTransform: 'uppercase',
							marginBottom: '1.5rem',
							display: 'flex',
							alignItems: 'center',
							gap: '0.75rem'
						}}
					>
						<span style={{ display: 'block', width: 32, height: 1, background: T.accent }} />
						Portfolio Project · 2026
					</p>

					<h1
						className="anim-fade-up anim-d1"
						style={{
							fontFamily: "'DM Serif Display', serif",
							fontSize: 'clamp(3.5rem, 8vw, 6rem)',
							letterSpacing: '-0.02em',
							lineHeight: 1.0,
							marginBottom: '1.5rem',
							color: T.heading
						}}
					>
						Lens<em style={{ color: T.accent, fontStyle: 'italic' }}>Ledger</em>
					</h1>

					<p
						className="anim-fade-up anim-d2"
						style={{
							fontSize: '1.25rem',
							color: T.subtle,
							maxWidth: 540,
							marginBottom: '0.5rem',
							lineHeight: 1.7
						}}
					>
						{typed}
						<span style={{ animation: 'blink 0.8s step-end infinite', color: T.accent }}>|</span>
					</p>

					<p
						className="anim-fade-up anim-d3"
						style={{
							fontSize: '0.95rem',
							color: T.muted,
							maxWidth: 540,
							marginBottom: '3rem',
							lineHeight: 1.8
						}}
					>
						Aplicación web de gestión de gastos con visión por computadora. Pipeline de IA de
						extremo a extremo: OCR + clasificación ML + dashboard en tiempo real.
					</p>

					{/* Badges */}
					<div
						className="anim-fade-up anim-d4"
						style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem' }}
					>
						{[
							{
								label: 'Go 1.22',
								bg: 'rgba(0,172,215,0.1)',
								color: '#00acd7',
								bc: 'rgba(0,172,215,0.3)'
							},
							{
								label: 'SvelteKit 2',
								bg: 'rgba(255,62,0,0.1)',
								color: '#ff3e00',
								bc: 'rgba(255,62,0,0.3)'
							},
							{
								label: 'Python 3.11',
								bg: 'rgba(59,130,246,0.1)',
								color: '#3b82f6',
								bc: 'rgba(59,130,246,0.3)'
							},
							{
								label: 'PostgreSQL',
								bg: 'rgba(51,103,145,0.1)',
								color: '#60a5fa',
								bc: 'rgba(51,103,145,0.3)'
							},
							{
								label: 'Redis',
								bg: 'rgba(220,56,45,0.1)',
								color: '#fca5a5',
								bc: 'rgba(220,56,45,0.3)'
							},
							{
								label: 'EasyOCR',
								bg: 'rgba(74,222,128,0.1)',
								color: T.accent,
								bc: 'rgba(74,222,128,0.3)'
							},
							{
								label: 'WebSockets',
								bg: 'rgba(34,211,238,0.1)',
								color: T.accent2,
								bc: 'rgba(34,211,238,0.3)'
							},
							{
								label: 'scikit-learn',
								bg: 'rgba(245,158,11,0.1)',
								color: T.accent3,
								bc: 'rgba(245,158,11,0.3)'
							}
						].map((b) => (
							<span
								key={b.label}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									padding: '0.3rem 0.8rem',
									borderRadius: '4px',
									fontFamily: "'DM Mono', monospace",
									fontSize: '0.75rem',
									fontWeight: 500,
									background: b.bg,
									color: b.color,
									border: `1px solid ${b.bc}`
								}}
							>
								{b.label}
							</span>
						))}
					</div>

					{/* Metrics */}
					<div
						className="anim-fade-up anim-d5"
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: 1,
							background: T.border,
							border: `1px solid ${T.border}`,
							borderRadius: 8,
							overflow: 'hidden',
							maxWidth: 560
						}}
					>
						{[
							['2', 'Devs'],
							['10', 'Semanas'],
							['5', 'Servicios'],
							['3', 'Capas ML']
						].map(([v, l]) => (
							<div key={l} style={{ background: T.bg2, padding: '1.25rem 1.5rem' }}>
								<div
									style={{
										fontFamily: "'DM Serif Display', serif",
										fontSize: '1.8rem',
										color: T.heading,
										lineHeight: 1
									}}
								>
									{v}
								</div>
								<div
									style={{
										fontFamily: "'DM Mono', monospace",
										fontSize: '0.68rem',
										color: T.muted,
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										marginTop: '0.3rem'
									}}
								>
									{l}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Features grid */}
				<div
					style={{ paddingBottom: '5rem', borderTop: `1px solid ${T.border}`, paddingTop: '4rem' }}
				>
					<p
						style={{
							fontFamily: "'DM Mono', monospace",
							fontSize: '0.7rem',
							color: T.muted,
							letterSpacing: '0.12em',
							textTransform: 'uppercase',
							marginBottom: '0.75rem'
						}}
					>
						01 — Funcionalidades
					</p>
					<h2
						style={{
							fontFamily: "'DM Serif Display', serif",
							fontSize: '2.4rem',
							color: T.heading,
							marginBottom: '3rem',
							letterSpacing: '-0.02em'
						}}
					>
						Pipeline completo de IA
					</h2>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '1px',
							background: T.border,
							border: `1px solid ${T.border}`,
							borderRadius: 10,
							overflow: 'hidden'
						}}
					>
						{features.map((f) => (
							<div
								key={f.title}
								style={{
									background: T.bg2,
									padding: '1.75rem',
									transition: 'background 0.2s'
								}}
								onMouseEnter={(e) => (e.currentTarget.style.background = T.bg3)}
								onMouseLeave={(e) => (e.currentTarget.style.background = T.bg2)}
							>
								<div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{f.icon}</div>
								<h3
									style={{
										fontFamily: "'DM Serif Display', serif",
										color: T.heading,
										fontSize: '1.15rem',
										marginBottom: '0.5rem'
									}}
								>
									{f.title}
								</h3>
								<p style={{ color: T.subtle, fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</p>
							</div>
						))}
					</div>
				</div>

				{/* CTA */}
				<div
					style={{
						borderTop: `1px solid ${T.border}`,
						paddingTop: '4rem',
						paddingBottom: '5rem',
						textAlign: 'center'
					}}
				>
					<h2
						style={{
							fontFamily: "'DM Serif Display', serif",
							fontSize: '2.8rem',
							color: T.heading,
							marginBottom: '1rem'
						}}
					>
						Ve el <em style={{ color: T.accent }}>pipeline</em> en acción
					</h2>
					<p style={{ color: T.subtle, marginBottom: '2rem', fontSize: '0.95rem' }}>
						Sin registro previo. Sube un recibo y observa cómo la IA lo procesa en tiempo real.
					</p>
					<button
						onClick={onEnter}
						style={{
							background: T.accent,
							color: T.bg,
							border: 'none',
							borderRadius: '6px',
							padding: '0.85rem 2.5rem',
							fontFamily: "'DM Mono', monospace",
							fontSize: '0.85rem',
							fontWeight: 600,
							letterSpacing: '0.05em',
							cursor: 'pointer',
							transition: 'all 0.2s',
							boxShadow: `0 0 30px rgba(74,222,128,0.2)`
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.boxShadow = `0 0 50px rgba(74,222,128,0.35)`;
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.boxShadow = `0 0 30px rgba(74,222,128,0.2)`;
							e.currentTarget.style.transform = 'none';
						}}
					>
						Abrir la app →
					</button>
				</div>
			</div>
		</div>
	);
};

/* LOGIN */
const LoginPage = ({ onLogin }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState('login');

	const handleSubmit = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			onLogin();
		}, 1200);
	};

	const inputStyle = {
		width: '100%',
		padding: '0.75rem 1rem',
		background: T.bg3,
		border: `1px solid ${T.border2}`,
		borderRadius: '6px',
		color: T.body,
		fontFamily: "'Instrument Sans', sans-serif",
		fontSize: '0.9rem',
		outline: 'none',
		transition: 'border-color 0.2s'
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				zIndex: 1,
				padding: '2rem'
			}}
		>
			{/* glow */}
			<div
				style={{
					position: 'fixed',
					width: 500,
					height: 500,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%)',
					top: '10%',
					left: '50%',
					transform: 'translateX(-50%)',
					pointerEvents: 'none'
				}}
			/>

			<div style={{ width: '100%', maxWidth: 420 }}>
				{/* Logo */}
				<div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
					<div
						style={{
							fontFamily: "'DM Serif Display', serif",
							fontSize: '1.8rem',
							color: T.heading,
							display: 'inline-flex',
							alignItems: 'center',
							gap: '0.5rem',
							marginBottom: '0.5rem'
						}}
					>
						<div style={{ width: 10, height: 10, borderRadius: '50%', background: T.accent }} />
						LensLedger
					</div>
					<p style={{ color: T.subtle, fontSize: '0.88rem', fontFamily: "'DM Mono', monospace" }}>
						{mode === 'login' ? 'Accede a tu dashboard' : 'Crea tu cuenta'}
					</p>
				</div>

				{/* Card */}
				<div
					style={{
						background: T.bg2,
						border: `1px solid ${T.border}`,
						borderRadius: '12px',
						padding: '2rem'
					}}
				>
					{/* Tabs */}
					<div
						style={{
							display: 'flex',
							background: T.bg3,
							border: `1px solid ${T.border}`,
							borderRadius: '6px',
							padding: '3px',
							marginBottom: '1.5rem'
						}}
					>
						{['login', 'register'].map((m) => (
							<button
								key={m}
								onClick={() => setMode(m)}
								style={{
									flex: 1,
									padding: '0.5rem',
									borderRadius: '4px',
									background: mode === m ? T.surface : 'transparent',
									border: mode === m ? `1px solid ${T.border2}` : '1px solid transparent',
									color: mode === m ? T.heading : T.muted,
									fontFamily: "'DM Mono', monospace",
									fontSize: '0.75rem',
									transition: 'all 0.15s'
								}}
							>
								{m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
							</button>
						))}
					</div>

					{/* Fields */}
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
							marginBottom: '1.5rem'
						}}
					>
						{mode === 'register' && (
							<div>
								<label
									style={{
										display: 'block',
										fontFamily: "'DM Mono', monospace",
										fontSize: '0.7rem',
										color: T.muted,
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										marginBottom: '0.4rem'
									}}
								>
									Nombre
								</label>
								<input
									style={inputStyle}
									placeholder="Tu nombre"
									onFocus={(e) => (e.target.style.borderColor = T.accent)}
									onBlur={(e) => (e.target.style.borderColor = T.border2)}
								/>
							</div>
						)}
						<div>
							<label
								style={{
									display: 'block',
									fontFamily: "'DM Mono', monospace",
									fontSize: '0.7rem',
									color: T.muted,
									textTransform: 'uppercase',
									letterSpacing: '0.08em',
									marginBottom: '0.4rem'
								}}
							>
								Email
							</label>
							<input
								style={inputStyle}
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="tu@email.com"
								onFocus={(e) => (e.target.style.borderColor = T.accent)}
								onBlur={(e) => (e.target.style.borderColor = T.border2)}
							/>
						</div>
						<div>
							<label
								style={{
									display: 'block',
									fontFamily: "'DM Mono', monospace",
									fontSize: '0.7rem',
									color: T.muted,
									textTransform: 'uppercase',
									letterSpacing: '0.08em',
									marginBottom: '0.4rem'
								}}
							>
								Contraseña
							</label>
							<input
								style={inputStyle}
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								onFocus={(e) => (e.target.style.borderColor = T.accent)}
								onBlur={(e) => (e.target.style.borderColor = T.border2)}
							/>
						</div>
					</div>

					{/* Submit */}
					<button
						onClick={handleSubmit}
						style={{
							width: '100%',
							padding: '0.8rem',
							background: loading ? T.surface : T.accent,
							border: `1px solid ${loading ? T.border2 : T.accent}`,
							borderRadius: '6px',
							color: loading ? T.subtle : T.bg,
							fontFamily: "'DM Mono', monospace",
							fontSize: '0.82rem',
							fontWeight: 600,
							letterSpacing: '0.05em',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '0.6rem',
							transition: 'all 0.2s'
						}}
					>
						{loading ? (
							<>
								<div
									style={{
										width: 14,
										height: 14,
										borderRadius: '50%',
										border: `2px solid ${T.muted}`,
										borderTopColor: T.accent,
										animation: 'spin 0.8s linear infinite'
									}}
								/>
								Autenticando…
							</>
						) : mode === 'login' ? (
							'Iniciar sesión →'
						) : (
							'Crear cuenta →'
						)}
					</button>

					{mode === 'login' && (
						<p
							style={{
								textAlign: 'center',
								marginTop: '1rem',
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.7rem',
								color: T.muted
							}}
						>
							¿Olvidaste tu contraseña?{' '}
							<span style={{ color: T.accent2, cursor: 'pointer' }}>Recuperar</span>
						</p>
					)}
				</div>

				{/* Footer */}
				<p
					style={{
						textAlign: 'center',
						marginTop: '1.5rem',
						fontFamily: "'DM Mono', monospace",
						fontSize: '0.7rem',
						color: T.muted
					}}
				>
					Go + SvelteKit + Python ML · 2026
				</p>
			</div>
		</div>
	);
};

/* DASHBOARD */
const DashboardPage = () => {
	const chartData = [
		{ label: 'Nov', value: 980, color: 'rgba(255,62,0,0.7)' },
		{ label: 'Dic', value: 1420, color: 'rgba(74,222,128,0.7)' },
		{ label: 'Ene', value: 860, color: 'rgba(59,130,246,0.7)' },
		{ label: 'Feb', value: 1100, color: 'rgba(245,158,11,0.7)' },
		{ label: 'Mar', value: 1350, color: 'rgba(167,139,250,0.7)' },
		{ label: 'Abr', value: 920, color: 'rgba(34,211,238,0.7)' },
		{ label: 'May', value: 1284, color: 'rgba(74,222,128,0.7)' }
	];

	const recent = [
		{
			merchant: 'Mercadona',
			category: 'alimentación',
			amount: '€67,40',
			date: '31 may',
			status: 'done'
		},
		{
			merchant: 'Renfe AVE',
			category: 'transporte',
			amount: '€43,50',
			date: '30 may',
			status: 'done'
		},
		{
			merchant: 'El Corte Inglés',
			category: 'ropa',
			amount: '€129,00',
			date: '29 may',
			status: 'done'
		},
		{
			merchant: 'Ticket desconocido',
			category: 'otros',
			amount: '—',
			date: '29 may',
			status: 'processing'
		},
		{
			merchant: 'Farmacia Cruz',
			category: 'salud',
			amount: '€18,90',
			date: '28 may',
			status: 'done'
		}
	];

	return (
		<div>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					marginBottom: '2rem'
				}}
			>
				<div>
					<h1
						style={{
							fontFamily: "'DM Serif Display', serif",
							fontSize: '2rem',
							color: T.heading,
							lineHeight: 1.2
						}}
					>
						Mayo 2026
					</h1>
					<p style={{ color: T.subtle, fontSize: '0.88rem', marginTop: '0.25rem' }}>
						Resumen mensual · 23 recibos procesados
					</p>
				</div>
				<button
					style={{
						background: 'rgba(74,222,128,0.12)',
						border: `1px solid rgba(74,222,128,0.25)`,
						color: T.accent,
						borderRadius: '6px',
						padding: '0.55rem 1.25rem',
						fontFamily: "'DM Mono', monospace",
						fontSize: '0.78rem',
						display: 'flex',
						alignItems: 'center',
						gap: '0.5rem'
					}}
				>
					<span>⊕</span> Subir recibo
				</button>
			</div>

			{/* Stats */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '1px',
					background: T.border,
					border: `1px solid ${T.border}`,
					borderRadius: 10,
					overflow: 'hidden',
					marginBottom: '1.5rem'
				}}
			>
				{[
					{ val: '€1.284', label: 'Total mes', color: T.heading },
					{ val: '€716', label: 'Disponible', color: T.accent },
					{ val: '23', label: 'Recibos', color: T.heading }
				].map((s) => (
					<div key={s.label} style={{ background: T.bg2, padding: '1.25rem 1.5rem' }}>
						<div
							style={{
								fontFamily: "'DM Serif Display', serif",
								fontSize: '1.9rem',
								color: s.color,
								lineHeight: 1
							}}
						>
							{s.val}
						</div>
						<div
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.68rem',
								color: T.muted,
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								marginTop: '0.3rem'
							}}
						>
							{s.label}
						</div>
					</div>
				))}
			</div>

			{/* Chart + Categories */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 280px',
					gap: '1.25rem',
					marginBottom: '1.5rem'
				}}
			>
				<div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: '0.75rem'
						}}
					>
						<h2
							style={{
								fontFamily: "'DM Serif Display', serif",
								fontSize: '1.1rem',
								color: T.heading
							}}
						>
							Gasto mensual
						</h2>
						<span
							style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.68rem', color: T.muted }}
						>
							últimos 7 meses
						</span>
					</div>
					<SpendingChart data={chartData} />
				</div>
				<div>
					<h2
						style={{
							fontFamily: "'DM Serif Display', serif",
							fontSize: '1.1rem',
							color: T.heading,
							marginBottom: '0.75rem'
						}}
					>
						Por categoría
					</h2>
					<div
						style={{
							background: T.bg2,
							border: `1px solid ${T.border}`,
							borderRadius: '8px',
							padding: '1rem',
							display: 'flex',
							flexDirection: 'column',
							gap: 0
						}}
					>
						{[
							{ cat: 'alimentación', pct: 35, amt: '€449' },
							{ cat: 'ropa', pct: 22, amt: '€282' },
							{ cat: 'transporte', pct: 18, amt: '€231' },
							{ cat: 'ocio', pct: 12, amt: '€154' },
							{ cat: 'salud', pct: 8, amt: '€103' },
							{ cat: 'otros', pct: 5, amt: '€65' }
						].map((c, i) => (
							<div
								key={c.cat}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.75rem',
									padding: '0.6rem 0',
									borderBottom: i < 5 ? `1px solid ${T.border}` : 'none'
								}}
							>
								<div
									style={{
										width: 28,
										height: 4,
										borderRadius: 2,
										background: Object.values(CATEGORY_COLORS)[i]?.color || T.muted,
										opacity: 0.8
									}}
								/>
								<span style={{ fontSize: '0.82rem', color: T.body, flex: 1 }}>{c.cat}</span>
								<span
									style={{
										fontFamily: "'DM Mono', monospace",
										fontSize: '0.75rem',
										color: T.subtle
									}}
								>
									{c.pct}%
								</span>
								<span
									style={{
										fontFamily: "'DM Mono', monospace",
										fontSize: '0.78rem',
										color: T.heading
									}}
								>
									{c.amt}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Recent receipts */}
			<div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: '0.75rem'
					}}
				>
					<h2
						style={{
							fontFamily: "'DM Serif Display', serif",
							fontSize: '1.1rem',
							color: T.heading
						}}
					>
						Recibos recientes
					</h2>
					<span
						style={{
							fontFamily: "'DM Mono', monospace",
							fontSize: '0.72rem',
							color: T.accent2,
							cursor: 'pointer'
						}}
					>
						Ver todos →
					</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
					{recent.map((r, i) => (
						<ReceiptCard key={i} receipt={r} />
					))}
				</div>
			</div>
		</div>
	);
};

/* UPLOAD */
const UploadPage = () => {
	const [uploadStatus, setUploadStatus] = useState('idle');
	const [jobId, setJobId] = useState(null);
	const [result, setResult] = useState(null);

	const handleUpload = (file) => {
		const id = Math.random().toString(36).slice(2, 10);
		setJobId(id);
		setUploadStatus('processing');
		// Simulate ML pipeline
		setTimeout(() => {
			setUploadStatus('done');
			setResult({
				merchant: 'Mercadona',
				amount: '€67,40',
				category: 'alimentación',
				date: '31/05/2026',
				confidence: 0.94,
				raw: 'MERCADONA S.A.\nTotal: 67,40€\n31/05/2026 19:42'
			});
		}, 3500);
	};

	return (
		<div style={{ maxWidth: 680, margin: '0 auto' }}>
			<div style={{ marginBottom: '2rem' }}>
				<h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: T.heading }}>
					Subir recibo
				</h1>
				<p style={{ color: T.subtle, fontSize: '0.88rem', marginTop: '0.25rem' }}>
					OCR automático + clasificación ML. Procesado en segundos.
				</p>
			</div>

			{/* Flow steps */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(5, 1fr)',
					gap: 1,
					background: T.border,
					border: `1px solid ${T.border}`,
					borderRadius: 8,
					overflow: 'hidden',
					marginBottom: '1.75rem'
				}}
			>
				{[
					{ n: '01', t: 'Upload', d: 'Arrastra o selecciona' },
					{ n: '02', t: 'Enqueue', d: '202 Accepted' },
					{ n: '03', t: 'OCR+ML', d: 'EasyOCR + RF' },
					{ n: '04', t: 'Persist', d: '→ PostgreSQL' },
					{ n: '05', t: 'Notify', d: 'WS push' }
				].map((s, i) => {
					const done = uploadStatus === 'done' ? true : uploadStatus === 'processing' && i < 2;
					const active = uploadStatus === 'processing' && i === 2;
					return (
						<div
							key={s.n}
							style={{
								background: T.bg2,
								padding: '0.9rem 0.75rem',
								borderTop: `2px solid ${done ? T.accent : active ? T.accent3 : T.border}`,
								transition: 'border-color 0.4s'
							}}
						>
							<div
								style={{
									fontFamily: "'DM Mono', monospace",
									fontSize: '0.6rem',
									color: T.muted,
									marginBottom: '0.3rem'
								}}
							>
								paso {s.n}
							</div>
							<div
								style={{
									fontSize: '0.8rem',
									fontWeight: 600,
									color: done ? T.accent : active ? T.accent3 : T.heading,
									marginBottom: '0.15rem'
								}}
							>
								{s.t}
							</div>
							<div style={{ fontSize: '0.72rem', color: T.subtle }}>{s.d}</div>
						</div>
					);
				})}
			</div>

			{/* Dropzone */}
			<UploadDropzone onUpload={handleUpload} status={uploadStatus} />

			{/* Job status */}
			{jobId && (
				<div
					style={{
						marginTop: '1.25rem',
						background: T.bg2,
						border: `1px solid ${T.border}`,
						borderRadius: '8px',
						padding: '1rem 1.25rem',
						display: 'flex',
						alignItems: 'center',
						gap: '1rem'
					}}
				>
					<div
						style={{
							width: 8,
							height: 8,
							borderRadius: '50%',
							background: uploadStatus === 'done' ? T.accent : T.accent3,
							animation: uploadStatus === 'processing' ? 'pulse 1.2s ease infinite' : 'none'
						}}
					/>
					<div style={{ flex: 1 }}>
						<div
							style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: T.muted }}
						>
							job_id: {jobId}
						</div>
						<div
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.8rem',
								color: uploadStatus === 'done' ? T.accent : T.accent3
							}}
						>
							status: {uploadStatus === 'processing' ? 'PROCESSING' : 'DONE'}
						</div>
					</div>
					{uploadStatus === 'processing' && (
						<div
							style={{
								width: 16,
								height: 16,
								borderRadius: '50%',
								border: `2px solid ${T.accent3}`,
								borderTopColor: 'transparent',
								animation: 'spin 0.8s linear infinite'
							}}
						/>
					)}
				</div>
			)}

			{/* Result */}
			{result && (
				<div
					style={{
						marginTop: '1.25rem',
						background: T.bg2,
						border: `1px solid rgba(74,222,128,0.25)`,
						borderRadius: '10px',
						overflow: 'hidden',
						animation: 'fadeUp 0.4s ease both'
					}}
				>
					<div
						style={{
							background: 'rgba(74,222,128,0.06)',
							borderBottom: `1px solid rgba(74,222,128,0.15)`,
							padding: '0.75rem 1.25rem',
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem'
						}}
					>
						<span style={{ color: T.accent, fontSize: '0.9rem' }}>✓</span>
						<span
							style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: T.accent }}
						>
							Recibo procesado correctamente
						</span>
						<span
							style={{
								marginLeft: 'auto',
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.65rem',
								color: T.muted
							}}
						>
							confianza: {(result.confidence * 100).toFixed(0)}%
						</span>
					</div>
					<div
						style={{
							padding: '1.25rem',
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '1rem'
						}}
					>
						{[
							{ label: 'Comercio', value: result.merchant },
							{ label: 'Importe', value: result.amount, serif: true },
							{ label: 'Fecha', value: result.date },
							{ label: 'Categoría', value: <CategoryBadge cat={result.category} size="md" /> }
						].map((f) => (
							<div key={f.label}>
								<div
									style={{
										fontFamily: "'DM Mono', monospace",
										fontSize: '0.65rem',
										color: T.muted,
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										marginBottom: '0.3rem'
									}}
								>
									{f.label}
								</div>
								{f.serif ? (
									<div
										style={{
											fontFamily: "'DM Serif Display', serif",
											fontSize: '1.5rem',
											color: T.heading
										}}
									>
										{f.value}
									</div>
								) : typeof f.value === 'string' ? (
									<div style={{ fontSize: '0.9rem', color: T.body }}>{f.value}</div>
								) : (
									f.value
								)}
							</div>
						))}
					</div>
					<div style={{ borderTop: `1px solid ${T.border}`, padding: '0.75rem 1.25rem' }}>
						<div
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.65rem',
								color: T.muted,
								marginBottom: '0.4rem',
								textTransform: 'uppercase',
								letterSpacing: '0.08em'
							}}
						>
							raw_text
						</div>
						<pre
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.72rem',
								color: T.subtle,
								lineHeight: 1.6,
								whiteSpace: 'pre-wrap'
							}}
						>
							{result.raw}
						</pre>
					</div>
				</div>
			)}
		</div>
	);
};

/* HISTORY */
const HistoryPage = () => {
	const [search, setSearch] = useState('');
	const [catFilter, setCatFilter] = useState('all');
	const [page, setPage] = useState(1);

	const allData = [
		{
			merchant: 'Mercadona',
			category: 'alimentación',
			amount: '€67,40',
			date: '31/05',
			status: 'done'
		},
		{
			merchant: 'Renfe AVE',
			category: 'transporte',
			amount: '€43,50',
			date: '30/05',
			status: 'done'
		},
		{
			merchant: 'El Corte Inglés',
			category: 'ropa',
			amount: '€129,00',
			date: '29/05',
			status: 'done'
		},
		{
			merchant: 'Farmacia Cruz Verde',
			category: 'salud',
			amount: '€18,90',
			date: '28/05',
			status: 'done'
		},
		{ merchant: 'Zara', category: 'ropa', amount: '€59,95', date: '27/05', status: 'done' },
		{ merchant: 'Uber', category: 'transporte', amount: '€12,30', date: '27/05', status: 'done' },
		{ merchant: 'Netflix', category: 'ocio', amount: '€15,99', date: '26/05', status: 'done' },
		{
			merchant: 'Consum',
			category: 'alimentación',
			amount: '€45,20',
			date: '25/05',
			status: 'done'
		},
		{ merchant: 'IKEA', category: 'hogar', amount: '€89,00', date: '24/05', status: 'done' },
		{
			merchant: 'Clínica dental',
			category: 'salud',
			amount: '€120,00',
			date: '23/05',
			status: 'done'
		},
		{ merchant: 'Spotify', category: 'ocio', amount: '€9,99', date: '22/05', status: 'done' },
		{
			merchant: 'Correos Express',
			category: 'otros',
			amount: '€7,50',
			date: '21/05',
			status: 'done'
		}
	];

	const filtered = allData.filter(
		(r) =>
			(catFilter === 'all' || r.category === catFilter) &&
			r.merchant.toLowerCase().includes(search.toLowerCase())
	);

	const cats = ['all', 'alimentación', 'transporte', 'ropa', 'ocio', 'salud', 'hogar', 'otros'];

	return (
		<div>
			<div style={{ marginBottom: '2rem' }}>
				<h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: T.heading }}>
					Historial
				</h1>
				<p style={{ color: T.subtle, fontSize: '0.88rem', marginTop: '0.25rem' }}>
					{allData.length} recibos · Mayo 2026
				</p>
			</div>

			{/* Filters */}
			<div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
				{/* Search */}
				<div style={{ position: 'relative', flex: '0 0 220px' }}>
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Buscar comercio…"
						style={{
							width: '100%',
							padding: '0.55rem 0.75rem 0.55rem 2rem',
							background: T.bg2,
							border: `1px solid ${T.border2}`,
							borderRadius: '6px',
							color: T.body,
							fontFamily: "'Instrument Sans', sans-serif",
							fontSize: '0.85rem',
							outline: 'none'
						}}
					/>
					<span
						style={{
							position: 'absolute',
							left: '0.6rem',
							top: '50%',
							transform: 'translateY(-50%)',
							color: T.muted,
							fontSize: '0.8rem'
						}}
					>
						🔍
					</span>
				</div>

				{/* Category pills */}
				<div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
					{cats.map((c) => (
						<button
							key={c}
							onClick={() => setCatFilter(c)}
							style={{
								padding: '0.4rem 0.75rem',
								borderRadius: '4px',
								border:
									catFilter === c ? `1px solid rgba(74,222,128,0.3)` : `1px solid ${T.border}`,
								background: catFilter === c ? 'rgba(74,222,128,0.1)' : T.bg2,
								color: catFilter === c ? T.accent : T.subtle,
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.72rem',
								transition: 'all 0.15s'
							}}
						>
							{c === 'all' ? 'todos' : c}
						</button>
					))}
				</div>
			</div>

			{/* Table */}
			<div
				style={{
					background: T.bg2,
					border: `1px solid ${T.border}`,
					borderRadius: '10px',
					overflow: 'hidden'
				}}
			>
				{/* Header */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 140px 100px 80px 90px',
						padding: '0.65rem 1.25rem',
						borderBottom: `1px solid ${T.border}`,
						fontFamily: "'DM Mono', monospace",
						fontSize: '0.65rem',
						color: T.muted,
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
						background: T.surface
					}}
				>
					<span>Comercio</span>
					<span>Categoría</span>
					<span style={{ textAlign: 'right' }}>Importe</span>
					<span style={{ textAlign: 'center' }}>Fecha</span>
					<span style={{ textAlign: 'center' }}>Estado</span>
				</div>

				{filtered.map((r, i) => (
					<div
						key={i}
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 140px 100px 80px 90px',
							padding: '0.75rem 1.25rem',
							alignItems: 'center',
							borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : 'none',
							transition: 'background 0.15s'
						}}
						onMouseEnter={(e) => (e.currentTarget.style.background = T.bg3)}
						onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
					>
						<span style={{ fontSize: '0.88rem', color: T.body, fontWeight: 500 }}>
							{r.merchant}
						</span>
						<span>
							<CategoryBadge cat={r.category} />
						</span>
						<span
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.85rem',
								color: T.heading,
								textAlign: 'right'
							}}
						>
							{r.amount}
						</span>
						<span
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.72rem',
								color: T.muted,
								textAlign: 'center'
							}}
						>
							{r.date}
						</span>
						<span style={{ textAlign: 'center' }}>
							<span
								style={{
									fontFamily: "'DM Mono', monospace",
									fontSize: '0.65rem',
									color: T.accent,
									textTransform: 'uppercase',
									letterSpacing: '0.05em'
								}}
							>
								✓ done
							</span>
						</span>
					</div>
				))}
			</div>

			{/* Pagination */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginTop: '1rem'
				}}
			>
				<span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: T.muted }}>
					{filtered.length} resultados
				</span>
				<div style={{ display: 'flex', gap: '0.4rem' }}>
					{[1, 2, 3].map((p) => (
						<button
							key={p}
							onClick={() => setPage(p)}
							style={{
								width: 32,
								height: 32,
								borderRadius: '4px',
								border: `1px solid ${page === p ? T.border2 : T.border}`,
								background: page === p ? T.surface : 'transparent',
								color: page === p ? T.heading : T.muted,
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.75rem'
							}}
						>
							{p}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

/* BUDGET */
const BudgetPage = () => {
	const budgets = [
		{ cat: 'alimentación', label: 'Alimentación', spent: 449, limit: 500 },
		{ cat: 'transporte', label: 'Transporte', spent: 231, limit: 200 },
		{ cat: 'ropa', label: 'Ropa', spent: 282, limit: 300 },
		{ cat: 'ocio', label: 'Ocio', spent: 154, limit: 150 },
		{ cat: 'salud', label: 'Salud', spent: 103, limit: 200 },
		{ cat: 'hogar', label: 'Hogar', spent: 65, limit: 150 }
	];

	const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
	const totalLimit = budgets.reduce((a, b) => a + b.limit, 0);

	return (
		<div>
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					marginBottom: '2rem'
				}}
			>
				<div>
					<h1
						style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: T.heading }}
					>
						Presupuesto
					</h1>
					<p style={{ color: T.subtle, fontSize: '0.88rem', marginTop: '0.25rem' }}>
						Mayo 2026 · Límites por categoría
					</p>
				</div>
				<button
					style={{
						background: T.surface,
						border: `1px solid ${T.border2}`,
						color: T.body,
						borderRadius: '6px',
						padding: '0.55rem 1.1rem',
						fontFamily: "'DM Mono', monospace",
						fontSize: '0.75rem'
					}}
				>
					✎ Editar límites
				</button>
			</div>

			{/* Global progress */}
			<div
				style={{
					background: T.bg2,
					border: `1px solid ${T.border}`,
					borderRadius: '10px',
					padding: '1.5rem',
					marginBottom: '1.5rem'
				}}
			>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
					<div>
						<div
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.68rem',
								color: T.muted,
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								marginBottom: '0.4rem'
							}}
						>
							Total mes
						</div>
						<div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
							<span
								style={{
									fontFamily: "'DM Serif Display', serif",
									fontSize: '2.2rem',
									color: T.heading
								}}
							>
								€{totalSpent.toLocaleString()}
							</span>
							<span
								style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: T.subtle }}
							>
								/ €{totalLimit.toLocaleString()}
							</span>
						</div>
					</div>
					<div style={{ textAlign: 'right' }}>
						<div
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: '0.68rem',
								color: T.muted,
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								marginBottom: '0.4rem'
							}}
						>
							Disponible
						</div>
						<div
							style={{
								fontFamily: "'DM Serif Display', serif",
								fontSize: '2.2rem',
								color: T.accent
							}}
						>
							€{(totalLimit - totalSpent).toLocaleString()}
						</div>
					</div>
				</div>
				<div style={{ background: T.surface, borderRadius: '4px', height: 8, overflow: 'hidden' }}>
					<div
						style={{
							height: '100%',
							borderRadius: '3px',
							width: `${(totalSpent / totalLimit) * 100}%`,
							background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`,
							backgroundSize: '200% 100%',
							animation: 'progressFill 1s ease both, gradientShift 3s ease infinite'
						}}
					/>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
					<span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: T.muted }}>
						0%
					</span>
					<span
						style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.68rem', color: T.accent }}
					>
						{Math.round((totalSpent / totalLimit) * 100)}% consumido
					</span>
					<span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: T.muted }}>
						100%
					</span>
				</div>
			</div>

			{/* Per category */}
			<div
				style={{
					background: T.bg2,
					border: `1px solid ${T.border}`,
					borderRadius: '10px',
					padding: '1.5rem'
				}}
			>
				<h2
					style={{
						fontFamily: "'DM Serif Display', serif",
						fontSize: '1.15rem',
						color: T.heading,
						marginBottom: '1.5rem'
					}}
				>
					Por categoría
				</h2>
				{budgets.map((b) => (
					<BudgetBar key={b.cat} cat={b.cat} label={b.label} spent={b.spent} limit={b.limit} />
				))}
			</div>

			{/* Alerts */}
			<div
				style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
			>
				{budgets
					.filter((b) => b.spent >= b.limit * 0.8)
					.map((b) => (
						<div
							key={b.cat}
							style={{
								padding: '0.75rem 1rem',
								background: b.spent > b.limit ? 'rgba(248,113,113,0.06)' : 'rgba(245,158,11,0.06)',
								border: `1px solid ${b.spent > b.limit ? 'rgba(248,113,113,0.2)' : 'rgba(245,158,11,0.2)'}`,
								borderRadius: '8px',
								display: 'flex',
								alignItems: 'center',
								gap: '0.75rem'
							}}
						>
							<span style={{ fontSize: '0.9rem' }}>{b.spent > b.limit ? '🚨' : '⚠️'}</span>
							<div style={{ flex: 1 }}>
								<span
									style={{
										fontFamily: "'DM Mono', monospace",
										fontSize: '0.75rem',
										color: b.spent > b.limit ? T.danger : T.accent3
									}}
								>
									{b.spent > b.limit
										? `${b.label}: superado en €${(b.spent - b.limit).toLocaleString()}`
										: `${b.label}: ${Math.round((b.spent / b.limit) * 100)}% del límite`}
								</span>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

/* ─── ROOT ─── */
export default function LensLedger() {
	const [screen, setScreen] = useState('landing'); // landing | login | app
	const [appPage, setAppPage] = useState('dashboard');

	const handleAppNav = (page) => {
		setAppPage(page);
	};

	if (screen === 'landing')
		return (
			<>
				<GlobalStyle />
				<LandingPage onEnter={() => setScreen('login')} />
			</>
		);

	if (screen === 'login')
		return (
			<>
				<GlobalStyle />
				<LoginPage onLogin={() => setScreen('app')} />
			</>
		);

	return (
		<>
			<GlobalStyle />
			<AppShell active={appPage} setActive={handleAppNav}>
				{appPage === 'dashboard' && <DashboardPage />}
				{appPage === 'upload' && <UploadPage />}
				{appPage === 'history' && <HistoryPage />}
				{appPage === 'budget' && <BudgetPage />}
			</AppShell>
		</>
	);
}
