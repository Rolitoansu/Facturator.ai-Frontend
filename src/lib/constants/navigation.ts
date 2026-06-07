/**
 * Links de navegación principal de la aplicación.
 * Usados en el sidebar del layout /app/*.
 */
export const NAV_LINKS = [
	{ id: 'dashboard', label: 'Dashboard', icon: '▦', href: '/app/dashboard' },
	{ id: 'upload', label: 'Subir recibo', icon: '⊕', href: '/app/upload' },
	{ id: 'history', label: 'Historial', icon: '≡', href: '/app/history' },
	{ id: 'budget', label: 'Presupuesto', icon: '◎', href: '/app/budget' }
] as const;

export type NavLinkId = (typeof NAV_LINKS)[number]['id'];
