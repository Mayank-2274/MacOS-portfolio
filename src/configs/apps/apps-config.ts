import { create_app_config } from '🍎/helpers/create-app-config';
import AboutThisMac from '🍎/components/apps/AboutThisMac/AboutThisMac.svelte';

const wallpapers = create_app_config({
	title: 'Wallpapers',
	resizable: true,
	height: 600,
	width: 800,
	dock_breaks_before: true,
});

const calculator = create_app_config({
	title: 'Calculator',
	expandable: true,
	resizable: false,
	height: 250 * 1.414,
	width: 250,
});

const calendar = create_app_config({
	title: 'Calendar',
	resizable: true,
});

const vscode = create_app_config({
	title: 'VSCode',
	resizable: true,
	height: 600,
	width: 800,
});

const finder = create_app_config({
	title: 'Finder',
	resizable: true,
	// dockBreaksBefore: true,
	should_open_window: false,
});

const safari = create_app_config({
	title: 'Safari',
	resizable: true,
	fullscreen_by_default: true,
});

const tv = create_app_config({
	title: 'Apple TV',
	resizable: true,
	height: 600,
	width: 800,
});

const systemPreferences = create_app_config({
	title: 'System Preferences',
	resizable: true,
});

const mayankProfile = create_app_config({
	title: `About the Developer`,
	resizable: true,
	dock_breaks_before: true,
	height: 600,
	width: 800,
});

const viewSource = create_app_config({
	title: `View Source`,
	resizable: true,
	should_open_window: false,
	external_action: () => window.open('https://github.com/Mayank-2274/macos-web', '_blank'),
});

const vercel = create_app_config({
	title: `Powered by Vercel`,
	resizable: true,
	should_open_window: false,
	external_action: () =>
		window.open('https://vercel.com/?utm_source=mayank-projects&utm_campaign=oss', '_blank'),
	dock_breaks_before: true,
});

const appstore = create_app_config({
	title: 'App Store',
	resizable: true,
});

const aboutThisMac = create_app_config({
	title: 'About This Mac',
	resizable: false,
	width: 480,
	height: 380,
});

export const apps_config = {
	finder,
	wallpapers,
	calculator,
	calendar,
	vscode,
	appstore,
	safari,
	tv,

	// 'system-preferences': systemPreferences,

	'mayank-profile': mayankProfile,
	'view-source': viewSource,

	vercel,
	'about-this-mac': aboutThisMac,
};
