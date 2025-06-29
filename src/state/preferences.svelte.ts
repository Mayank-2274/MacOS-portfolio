import { colors } from '🍎/configs/theme/colors.config';
import type { WallpaperID } from '🍎/configs/wallpapers/wallpaper.config';
import { persisted } from './persisted.svelte.ts';

export type WallpaperSettings = {
	id: WallpaperID;
	image: string;
	canControlTheme: boolean;
};

export type Theme = {
	scheme: 'light' | 'dark';
	primaryColor: keyof typeof colors;
};

export type Preferences = {
	theme: Theme;
	wallpaper: {
		id: WallpaperID;
		canControlTheme: boolean;
	};
	reduced_motion: boolean;
	liquid_glass: boolean;
};

export const preferences = persisted<Preferences>('macos:preferences', {
	theme: {
		scheme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
		primaryColor: 'blue',
	},
	wallpaper: {
		id: 'big-sur-1',
		canControlTheme: true,
	},
	reduced_motion: matchMedia('(prefers-reduced-motion)').matches,
	liquid_glass: false,
});

$effect.root(() => {
	$effect(() => {
		// Color scheme
		const { classList } = document.body;
		classList.remove('light', 'dark');
		classList.add(preferences.theme.scheme);

		// Primary color
		const colorObj = colors[preferences.theme.primaryColor][preferences.theme.scheme];
		document.body.style.setProperty('--system-color-primary', `hsl(${colorObj.hsl})`);
		document.body.style.setProperty('--system-color-primary-hsl', `${colorObj.hsl}`);
		document.body.style.setProperty(
			'--system-color-primary-contrast',
			`hsl(${colorObj.contrastHsl})`,
		);
		document.body.style.setProperty(
			'--system-color-primary-contrast-hsl',
			`${colorObj.contrastHsl}`,
		);
	});
});
