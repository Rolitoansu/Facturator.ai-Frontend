import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				// Inyecta los tokens automáticamente en todos los bloques <style lang="scss">
				// y en los archivos .scss importados, sin necesidad de @use manual.
				additionalData: `@use '$lib/styles/tokens' as *;`
			}
		}
	}
});
