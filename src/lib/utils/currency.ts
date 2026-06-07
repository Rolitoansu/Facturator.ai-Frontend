/**
 * Formatea un número como moneda EUR con dos decimales.
 * Formato: "EUR 1,234.56"
 */
export const formatCurrency = (value: number): string =>
	`EUR ${value.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;

/**
 * Formatea un número con dos decimales como string simple.
 * Formato: "1234.56"
 */
export const formatAmount = (val: number): string => val.toFixed(2);
