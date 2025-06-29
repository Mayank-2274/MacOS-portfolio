import type { apps_config } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof apps_config;

export const apps = $state({
	open: {
		wallpapers: false,
		finder: true,
		vscode: false,
		calculator: false,
		safari: false,
		appstore: false,
		calendar: false,
		tv: false,
		// 'system-preferences': false,

		'mayank-profile': false,
		'view-source': true,

		vercel: true,
	} as Record<AppID, boolean>,

	active: 'finder' satisfies AppID,

	/**
	 * Maximum zIndex for the active app
	 * Initialize with -2, so that it becomes 0 when initialised
	 */
	active_z_index: -2,

	z_indices: {
		wallpapers: 0,
		finder: 0,
		vscode: 0,
		calculator: 0,
		safari: 0,
		appstore: 0,
		calendar: 0,
		tv: 0,
		// 'system-preferences': 0,

		'mayank-profile': 0,
		'view-source': 0,

		vercel: 0,
	} as Record<AppID, number>,

	is_being_dragged: false as boolean,

	fullscreen: {
		wallpapers: false,
		finder: false,
		vscode: false,
		calculator: false,
		safari: false,
		appstore: false,
		calendar: false,
		tv: false,
		// 'system-preferences': false,

		'mayank-profile': false,
		'view-source': false,

		vercel: false,
	} as Record<AppID, boolean>,
});

// Function to close a specific app window
export function closeApp(appId: AppID) {
	apps.open[appId] = false;
	apps.z_indices[appId] = 0;
	apps.fullscreen[appId] = false;
	
	// If the closed app was active, set finder as active
	if (apps.active === appId) {
		apps.active = 'finder';
	}
}
