/**
 * Links de navegación principal de la aplicación.
 * Usados en el sidebar del layout /app/*.
 */
import { LayoutDashboard, FileUp, History, PieChart } from 'lucide-svelte';

export const NAV_LINKS = [
	{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
	{ id: 'upload', label: 'Subir recibo', icon: FileUp, href: '/app/upload' },
	{ id: 'history', label: 'Historial', icon: History, href: '/app/history' },
	{ id: 'budget', label: 'Presupuesto', icon: PieChart, href: '/app/budget' }
] as const;

export type NavLinkId = (typeof NAV_LINKS)[number]['id'];
