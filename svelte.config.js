import adapterStatic from '@sveltejs/adapter-static';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';

const isCloudflare = process.env.CF_PAGES === '1' || process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: isCloudflare 
			? adapterCloudflare() 
			: adapterStatic({
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				precompress: false,
				strict: true
			}),
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;
