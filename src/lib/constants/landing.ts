/**
 * Badges de tecnologías mostrados en la landing page.
 */
export const BADGES = [
	{ label: 'Go 1.22', modifier: 'go' },
	{ label: 'SvelteKit 2', modifier: 'svelte' },
	{ label: 'Python 3.11', modifier: 'python' },
	{ label: 'PostgreSQL', modifier: 'pg' },
	{ label: 'Redis', modifier: 'redis' },
	{ label: 'EasyOCR', modifier: 'green' },
	{ label: 'WebSockets', modifier: 'cyan' },
	{ label: 'scikit-learn', modifier: 'amber' }
] as const;

/**
 * Métricas del proyecto mostradas en el hero de la landing page.
 */
export const METRICS = [
	{ val: '2', label: 'Devs' },
	{ val: '10', label: 'Semanas' },
	{ val: '5', label: 'Servicios' },
	{ val: '3', label: 'Capas ML' }
] as const;

/**
 * Tarjetas de argumentos de venta mostradas en la sección "pitch" de la landing page.
 */
export const PITCH_CARDS = [
	{
		title: 'Portfolio que se demuestra en 30 segundos',
		body: 'Cualquier reclutador puede ver el funcionamiento real en vivo: subir una foto y ver el resultado procesado. No es un CRUD con UI bonita, es un pipeline de IA funcionando de extremo a extremo.'
	},
	{
		title: 'Stack inusual y diferenciador',
		body: 'Go en el backend + SvelteKit en el frontend es una combinación que aparece muy poco en portfolios junior. Demuestra criterio técnico propio y capacidad de aprender más allá de los caminos más trillados.'
	},
	{
		title: 'ML real, no decorativo',
		body: 'EasyOCR + clasificador scikit-learn no es una demo de "Hello World con TensorFlow". Es un pipeline de inferencia con un modelo entrenado, servido via FastAPI y consumido desde Go.'
	}
] as const;
