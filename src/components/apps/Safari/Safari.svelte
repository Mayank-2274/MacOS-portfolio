<script lang="ts">
	import { onMount } from 'svelte';
	import { preferences } from '🍎/state/preferences.svelte';

	let currentUrl = 'https://example.com';
	let urlInput = currentUrl;
	let isLoading = false;
	let canGoBack = false;
	let canGoForward = false;
	let hasError = false;
	let iframeElement: HTMLIFrameElement;
	let loadTimeout: number;

	// Navigation history
	let history: string[] = [];
	let currentHistoryIndex = -1;

	const HOME_URL = 'https://example.com';

	// Quick access URLs that work well with iframes
	const QUICK_ACCESS_URLS = [
		{ name: 'Example.com', url: 'https://example.com' },
		{ name: 'Spotify Player', url: 'https://open.spotify.com/embed' },
		{ name: 'Spotify Playlist', url: 'https://open.spotify.com/embed/playlist/37i9dQZEVXbLZ52XmnySJg' },
		{ name: 'Spotify Album', url: 'https://open.spotify.com/embed/album/4aawyAB9vmqN3uQ7FjRGTy' },
		{ name: 'Spotify Artist', url: 'https://open.spotify.com/embed/artist/4gzpq5DPGxSnKTe4SA8HAU' }
	];

	function navigateToUrl() {
		let url = urlInput.trim();
		
		// Add protocol if missing
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url;
		}
		
		// Validate URL
		try {
			new URL(url);
			currentUrl = url;
			addToHistory(url);
			hasError = false;
		} catch (error) {
			// If invalid URL, try searching with Google
			const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(urlInput)}`;
			currentUrl = searchUrl;
			addToHistory(searchUrl);
			hasError = false;
		}
	}

	function goHome() {
		currentUrl = HOME_URL;
		urlInput = HOME_URL;
		addToHistory(HOME_URL);
		hasError = false;
	}

	function addToHistory(url: string) {
		// Remove any forward history when navigating to a new URL
		history = history.slice(0, currentHistoryIndex + 1);
		history = [...history, url];
		currentHistoryIndex = history.length - 1;
		updateNavigationState();
	}

	function goBack() {
		if (currentHistoryIndex > 0) {
			currentHistoryIndex--;
			currentUrl = history[currentHistoryIndex];
			urlInput = currentUrl;
			hasError = false;
			updateNavigationState();
		}
	}

	function goForward() {
		if (currentHistoryIndex < history.length - 1) {
			currentHistoryIndex++;
			currentUrl = history[currentHistoryIndex];
			urlInput = currentUrl;
			hasError = false;
			updateNavigationState();
		}
	}

	function refresh() {
		if (iframeElement) {
			iframeElement.src = iframeElement.src;
		}
	}

	function updateNavigationState() {
		canGoBack = currentHistoryIndex > 0;
		canGoForward = currentHistoryIndex < history.length - 1;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			navigateToUrl();
		}
	}

	function handleIframeLoadStart() {
		console.log('Loading iframe:', currentUrl);
		isLoading = true;
		hasError = false;
		
		// Set a timeout to detect if the page takes too long to load
		loadTimeout = setTimeout(() => {
			if (isLoading) {
				console.log('Iframe load timeout for:', currentUrl);
				isLoading = false;
				hasError = true;
			}
		}, 10000); // 10 second timeout
	}

	function handleIframeLoad() {
		console.log('Iframe loaded successfully:', currentUrl);
		isLoading = false;
		hasError = false;
		clearTimeout(loadTimeout);
	}

	function handleIframeError() {
		console.log('Iframe error for:', currentUrl);
		isLoading = false;
		hasError = true;
		clearTimeout(loadTimeout);
	}

	onMount(() => {
		addToHistory(currentUrl);
	});
</script>

<section class="container">
	<header class="app-window-drag-handle">
		<div class="titlebar">
			<div class="window-title">Safari</div>
		</div>
	</header>

	<div class="browser-toolbar">
		<div class="navigation-controls">
			<button 
				class="nav-button" 
				class:disabled={!canGoBack}
				onclick={goBack}
				disabled={!canGoBack}
				title="Go Back"
			>
				←
			</button>
			<button 
				class="nav-button" 
				class:disabled={!canGoForward}
				onclick={goForward}
				disabled={!canGoForward}
				title="Go Forward"
			>
				→
			</button>
			<button 
				class="nav-button" 
				onclick={refresh}
				title="Refresh"
			>
				↻
			</button>
			<button 
				class="nav-button home-button" 
				onclick={goHome}
				title="Home"
			>
				🏠
			</button>
			<button 
				class="nav-button spotify-button" 
				onclick={() => {
					const spotifyUrl = 'https://open.spotify.com/embed/playlist/37i9dQZEVXbLZ52XmnySJg';
					currentUrl = spotifyUrl;
					urlInput = spotifyUrl;
					addToHistory(spotifyUrl);
					hasError = false;
				}}
				title="Open Spotify"
			>
				🎵
			</button>
		</div>
		
		<div class="url-bar">
			<input
				type="text"
				bind:value={urlInput}
				onkeydown={handleKeydown}
				placeholder="Search or enter website name"
				class="url-input"
				class:error={hasError}
			/>
			<button 
				class="go-button" 
				onclick={navigateToUrl}
				title="Go"
			>
				Go
			</button>
		</div>
		
		<div class="quick-access">
			<label for="quick-access-select" class="quick-access-label">Quick Access:</label>
			<select 
				id="quick-access-select"
				class="quick-access-select"
				onchange={(e) => {
					const target = e.target as HTMLSelectElement;
					const selectedUrl = target.value;
					if (selectedUrl) {
						currentUrl = selectedUrl;
						urlInput = selectedUrl;
						addToHistory(selectedUrl);
						hasError = false;
					}
				}}
			>
				<option value="">Select a site...</option>
				{#each QUICK_ACCESS_URLS as item}
					<option value={item.url}>{item.name}</option>
				{/each}
			</select>
		</div>
		
		<div class="loading-indicator" class:loading={isLoading}>
			{#if isLoading}
				<div class="spinner"></div>
			{/if}
		</div>
	</div>

	<main class="content">
		{#if hasError}
			<div class="error-message">
				<h3>Unable to load page</h3>
				<p>The page you're trying to access cannot be loaded. This might be due to:</p>
				<ul>
					<li>The website blocking iframe embedding (most common)</li>
					<li>Network connectivity issues</li>
					<li>Invalid URL</li>
					<li>Security restrictions</li>
				</ul>
				<p class="note">
					<strong>Note:</strong> Many websites (like Google, Facebook, Twitter, etc.) block iframe embedding for security reasons. 
					Try visiting <a href="https://example.com" target="_blank">example.com</a> or <a href="https://open.spotify.com/embed/playlist/37i9dQZEVXbLZ52XmnySJg" target="_blank">Spotify</a> which allow iframe embedding.
				</p>
				<button class="retry-button" onclick={refresh}>Try Again</button>
				<button class="home-button" onclick={goHome}>Go Home</button>
			</div>
		{:else}
			<iframe
				bind:this={iframeElement}
				src={currentUrl}
				title="Safari Browser"
				class="browser-iframe"
				onload={handleIframeLoad}
				onloadstart={handleIframeLoadStart}
				onerror={handleIframeError}
				sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation"
				allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
			></iframe>
		{/if}
	</main>
</section>

<style>
	.container {
		--title-bar-height: 2.5rem;
		background-color: var(--system-color-light);
		border-radius: inherit;
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.titlebar {
		padding: 0.5rem 1rem;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		z-index: 100;
		min-height: var(--title-bar-height);
		box-sizing: border-box;
	}

	.window-title {
		font-family: var(--system-font-family);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--system-color-light-contrast);
		pointer-events: none;
		user-select: none;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		width: 100%;
		position: relative;
		z-index: 101;
	}

	.browser-toolbar {
		background-color: hsla(var(--system-color-light-hsl), 0.6);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
		margin-top: var(--title-bar-height);
	}

	.navigation-controls {
		display: flex;
		gap: 0.25rem;
	}

	.nav-button {
		width: 2rem;
		height: 2rem;
		border: none;
		background-color: hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease;

		&:hover:not(.disabled) {
			background-color: hsla(var(--system-color-dark-hsl), 0.2);
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&.home-button {
			font-size: 0.875rem;
		}

		&.spotify-button {
			background-color: #1DB954;
			color: white;

			&:hover {
				background-color: #1ed760;
			}
		}
	}

	.url-bar {
		flex: 1;
		display: flex;
		gap: 0.5rem;
	}

	.url-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.2);
		border-radius: 0.375rem;
		background-color: var(--system-color-light);
		color: var(--system-color-light-contrast);
		font-family: var(--system-font-family);
		font-size: 0.875rem;

		&:focus {
			outline: none;
			border-color: var(--system-color-primary);
			box-shadow: 0 0 0 2px hsla(var(--system-color-primary-hsl), 0.2);
		}

		&.error {
			border-color: #ff6b6b;
			box-shadow: 0 0 0 2px hsla(0, 100%, 70%, 0.2);
		}
	}

	.go-button {
		padding: 0.5rem 1rem;
		background-color: var(--system-color-primary);
		color: var(--system-color-primary-contrast);
		border: none;
		border-radius: 0.375rem;
		font-family: var(--system-font-family);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: hsla(var(--system-color-primary-hsl), 0.8);
		}
	}

	.quick-access {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.quick-access-label {
		font-family: var(--system-font-family);
		font-size: 0.875rem;
		color: var(--system-color-light-contrast);
		font-weight: 500;
		white-space: nowrap;
	}

	.quick-access-select {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.2);
		border-radius: 0.375rem;
		background-color: var(--system-color-light);
		color: var(--system-color-light-contrast);
		font-family: var(--system-font-family);
		font-size: 0.875rem;

		&:focus {
			outline: none;
			border-color: var(--system-color-primary);
			box-shadow: 0 0 0 2px hsla(var(--system-color-primary-hsl), 0.2);
		}
	}

	.loading-indicator {
		width: 1rem;
		height: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;

		&.loading .spinner {
			width: 1rem;
			height: 1rem;
			border: 2px solid hsla(var(--system-color-dark-hsl), 0.2);
			border-top: 2px solid var(--system-color-primary);
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}
	}

	.content {
		flex: 1;
		overflow: hidden;
		position: relative;
	}

	.browser-iframe {
		width: 100%;
		height: 100%;
		border: none;
		background-color: white;
	}

	.error-message {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		padding: 2rem;
		background-color: var(--system-color-light);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.1);
		max-width: 500px;

		h3 {
			margin: 0 0 1rem 0;
			color: var(--system-color-light-contrast);
			font-size: 1.25rem;
		}

		p {
			margin: 0 0 1rem 0;
			color: hsla(var(--system-color-dark-hsl), 0.7);
		}

		ul {
			text-align: left;
			margin: 0 0 1.5rem 0;
			padding-left: 1.5rem;
			color: hsla(var(--system-color-dark-hsl), 0.7);
		}

		li {
			margin-bottom: 0.25rem;
		}

		.note {
			background-color: hsla(var(--system-color-primary-hsl), 0.1);
			padding: 1rem;
			border-radius: 0.375rem;
			border-left: 4px solid var(--system-color-primary);
			margin: 1rem 0;

			a {
				color: var(--system-color-primary);
				text-decoration: none;
				font-weight: 500;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}

	.retry-button, .home-button {
		padding: 0.5rem 1rem;
		background-color: var(--system-color-primary);
		color: var(--system-color-primary-contrast);
		border: none;
		border-radius: 0.375rem;
		font-family: var(--system-font-family);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
		margin: 0 0.5rem;

		&:hover {
			background-color: hsla(var(--system-color-primary-hsl), 0.8);
		}
	}

	.home-button {
		background-color: hsla(var(--system-color-dark-hsl), 0.1);
		color: var(--system-color-light-contrast);

		&:hover {
			background-color: hsla(var(--system-color-dark-hsl), 0.2);
		}
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	/* Dark mode adjustments */
	:global(.dark) .browser-toolbar {
		background-color: hsla(var(--system-color-dark-hsl), 0.6);
		border-bottom-color: hsla(var(--system-color-light-hsl), 0.1);
	}

	:global(.dark) .nav-button {
		background-color: hsla(var(--system-color-light-hsl), 0.1);
		color: var(--system-color-dark-contrast);

		&:hover:not(.disabled) {
			background-color: hsla(var(--system-color-light-hsl), 0.2);
		}
	}

	:global(.dark) .url-input {
		background-color: var(--system-color-dark);
		color: var(--system-color-dark-contrast);
		border-color: hsla(var(--system-color-dark-hsl), 0.2);
	}

	:global(.dark) .quick-access-select {
		background-color: var(--system-color-dark);
		color: var(--system-color-dark-contrast);
		border-color: hsla(var(--system-color-dark-hsl), 0.2);
	}

	:global(.dark) .quick-access-label {
		color: var(--system-color-dark-contrast);
	}

	:global(.dark) .error-message {
		background-color: var(--system-color-dark);
		color: var(--system-color-dark-contrast);

		h3 {
			color: var(--system-color-dark-contrast);
		}

		p, li {
			color: hsla(var(--system-color-light-hsl), 0.7);
		}
	}

	:global(.dark) .window-title {
		color: var(--system-color-light-contrast);
	}
</style> 