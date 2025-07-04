import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnpluginIcons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import path from 'path';

import { prefetch } from './prefetch-plugin';

export default defineConfig({
	base: '/',
	plugins: [
		svelte(),
		prefetch(),

		UnpluginIcons({ autoInstall: true, compiler: 'svelte' }),
		VitePWA({
			includeAssets: [
				'robots.txt',
				'app-icons/finder/32.png',
				'cover-image.png',
				'cursors/(normal|link|text|help)-select.svg',
				'**/*.mp3',
			],
			manifest: {
				name: 'Mac OS Monterey Svelte Web',
				short_name: 'macOS Svelte',
				theme_color: '#ffffff',
				description: 'Mac OS Monterey Web written in Svelte',
				icons: [
					{
						src: 'app-icons/finder/128.png',
						sizes: '128x128',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/256.png',
						sizes: '256x256',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
		}),
		imagetools({}),
	],
	resolve: {
		alias: {
			'🍎': path.resolve(__dirname, 'src'),
		},
	},
	build: {
		minify: 'terser',
		cssMinify: 'lightningcss',
		rollupOptions: {
			output: {
				manualChunks: {
					'calendar': ['./src/components/apps/Calendar/Calendar.svelte'],
					'calculator': ['./src/components/apps/Calculator/Calculator.svelte'],
					'vscode': ['./src/components/apps/VSCode/VSCode.svelte'],
					'wallpapers': ['./src/components/apps/WallpaperApp/WallpaperSelectorApp.svelte'],
					'profile': ['./src/components/apps/PurusProfile/PurusProfile.svelte'],
					'about-mac': ['./src/components/apps/AboutThisMac/AboutThisMac.svelte'],
					'appstore': ['./src/components/apps/AppStore/AppStore.svelte'],
				},
			},
		},
	},
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: browserslistToTargets(browserslist('defaults, not IE 11, not IE_Mob 11, not dead')),
		},
	},
	optimizeDeps: {
		include: [
			'@neodrag/svelte',
			'popmotion',
			'date-fns',
		],
	},
});
