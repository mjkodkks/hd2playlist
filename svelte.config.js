import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Log the BASE_PATH from .env to verify it's loaded correctly
console.log(`BASE_PATH from .env is: ${process.env.BASE_PATH}`)

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(
			{
				fallback: '404.html'
			}
		),
		paths: {
			base: process.env.BASE_PATH || '',
			relative: false
		}
	}
};

export default config;
