/**
 * Formatea una cadena de fecha ISO a "YYYY-MM-DD".
 * Devuelve '--' si la fecha no es válida.
 */
export const formatDate = (value: string): string => {
	if (!value) return '--';
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? '--' : date.toISOString().slice(0, 10);
};

/**
 * Convierte un valor de fecha (ISO o legible) a "YYYY-MM-DD".
 * Si no es válida, devuelve la fecha actual en ese formato.
 */
export const toDateString = (value: string): string => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return new Date().toISOString().slice(0, 10);
	}
	return date.toISOString().slice(0, 10);
};
