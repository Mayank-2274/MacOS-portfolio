<script lang="ts">
	import type { AppID } from '🍎/state/apps.svelte';

	const {
		app_id,
		is_being_dragged,
	}: {
		app_id: AppID;
		is_being_dragged: boolean;
	} = $props();

	let importError = $state(false);
	let loading = $state(true);

	async function loadApp() {
		try {
			loading = true;
			importError = false;
			
			// Force a small delay to ensure proper loading
			await new Promise(resolve => setTimeout(resolve, 100));
		} catch (error) {
			console.error('Failed to load app:', app_id, error);
			importError = true;
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadApp();
	});
</script>

{#if loading}
	<div class="loading">Loading {app_id}...</div>
{:else if importError}
	<div class="error">Failed to load {app_id}</div>
{:else}
	{#if app_id === 'calendar'}
		{#await import('./Calendar/Calendar.svelte') then { default: Calendar }}
			<Calendar />
		{:catch error}
			<div class="error">Failed to load Calendar: {error.message}</div>
		{/await}
	{:else if app_id === 'vscode'}
		{#await import('./VSCode/VSCode.svelte') then { default: VSCode }}
			<VSCode {is_being_dragged} />
		{:catch error}
			<div class="error">Failed to load VSCode: {error.message}</div>
		{/await}
	{:else if app_id === 'calculator'}
		{#await import('./Calculator/Calculator.svelte') then { default: Calculator }}
			<Calculator />
		{:catch error}
			<div class="error">Failed to load Calculator: {error.message}</div>
		{/await}
	{:else if app_id === 'wallpapers'}
		{#await import('./WallpaperApp/WallpaperSelectorApp.svelte') then { default: WallpaperSelector }}
			<WallpaperSelector />
		{:catch error}
			<div class="error">Failed to load Wallpapers: {error.message}</div>
		{/await}
	{:else if app_id === 'mayank-profile'}
		{#await import('./PurusProfile/PurusProfile.svelte') then { default: PurusProfile }}
			<PurusProfile />
		{:catch error}
			<div class="error">Failed to load Profile: {error.message}</div>
		{/await}
	{:else if app_id === 'about-this-mac'}
		{#await import('./AboutThisMac/AboutThisMac.svelte') then { default: AboutThisMac }}
			<AboutThisMac />
		{:catch error}
			<div class="error">Failed to load About This Mac: {error.message}</div>
		{/await}
	{:else}
		{#await import('./AppStore/AppStore.svelte') then { default: AppStore }}
			<AppStore {app_id} />
		{:catch error}
			<div class="error">Failed to load App Store: {error.message}</div>
		{/await}
	{/if}
{/if}

<style>
	.loading, .error {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		font-family: var(--system-font-family);
		color: var(--text-color);
		background: var(--background-color);
	}

	.error {
		color: #ff6b6b;
		font-size: 0.9rem;
		text-align: center;
		padding: 1rem;
	}
</style>
