/**
 * Genera un ID único con el prefijo dado.
 * Formato: "prefix_xxxxxxxx" (8 caracteres base36 aleatorios)
 */
export const createId = (prefix: string): string =>
	`${prefix}_${Math.random().toString(36).slice(2, 10)}`;
