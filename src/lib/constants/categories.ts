/**
 * Categorías de gasto válidas del dominio.
 * Se usa para normalizar y validar categorías en badges y filtros.
 */
export const VALID_CATEGORIES = new Set([
	'alimentacion',
	'transporte',
	'ropa',
	'ocio',
	'salud',
	'hogar',
	'suscripciones'
] as const);

export type ValidCategory = typeof VALID_CATEGORIES extends Set<infer T> ? T : never;

/**
 * Mapa de colores por categoría para uso en gráficos y badges.
 */
export const CATEGORY_COLORS: Record<string, string> = {
	alimentacion: '#4ade80',
	transporte: '#22d3ee',
	ropa: '#f87171',
	ocio: '#f59e0b',
	salud: '#60a5fa',
	hogar: '#a78bfa',
	suscripciones: '#ff3e00'
};

/**
 * Devuelve la etiqueta legible para una categoría del dominio.
 * Aplica correcciones de acentos/mayúsculas donde corresponde.
 */
export const catLabel = (cat: string): string => {
	if (cat === 'alimentacion') return 'alimentación';
	return cat;
};

/**
 * Normaliza un valor de categoría: lowercase, sin acentos, sin espacios extra.
 */
export const normalizeCategory = (value: string): string =>
	value
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');

/**
 * Formatea una cadena de categoría para mostrarla al usuario.
 * Reemplaza guiones/underscores por espacios y devuelve 'otros' si está vacía.
 */
export const formatCategoryLabel = (value: string): string =>
	value.trim().replace(/[_-]+/g, ' ') || 'otros';
