/** @type {import('@sveltejs/kit').Config} */

import commonjs from '@rollup/plugin-commonjs';
import adapter from '@sveltejs/adapter-static';
const dev = process.env.NODE_ENV === 'development';
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		paths: {
			base: dev ? "" : "",
		},
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		})
	},
	plugins: [commonjs()]

};

export default config;
