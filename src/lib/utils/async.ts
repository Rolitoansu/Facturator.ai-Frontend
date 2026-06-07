/**
 * Pausa la ejecución durante los milisegundos indicados.
 * Útil para simular latencia de red en mocks.
 */
export const delay = (ms: number): Promise<void> =>
	new Promise<void>((resolve) => setTimeout(resolve, ms));
