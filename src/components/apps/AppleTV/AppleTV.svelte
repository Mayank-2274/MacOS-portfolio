<script lang="ts">
	const {
		is_being_dragged,
	}: {
		is_being_dragged: boolean;
	} = $props();

	$inspect(is_being_dragged);
</script>

<section class="container">
	<header class="app-window-drag-handle">
		<div class="titlebar">
			<div class="window-title">Apple TV</div>
		</div>
	</header>

	<main class="content">
		<div class="tv-container">
			<iframe 
				width="100%" 
				height="100%" 
				src="https://tv.apple.com/us/clip/rogue-season-1/umc.cmc.4ezlir6vykjhanv87dctlvsdk?targetId=umc.cmc.5owrzntj9v1gpg31wshflud03&targetType=Show&playableId=tvs.sbd.4000%3AA0102901TRL1" 
				style="border:0px" 
				scrolling="no"
				title="Apple TV"
				allowfullscreen
			></iframe>
		</div>
		
		<div class="tv-info">
			<h3>Apple TV</h3>
			<p>Streaming the latest movies and TV shows</p>
		</div>
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
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		z-index: 10;
		min-height: var(--title-bar-height);
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
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-top: var(--title-bar-height);
		overflow: hidden;
	}

	.tv-container {
		flex: 1;
		position: relative;
		background-color: #000;
		border-radius: 0.5rem;
		margin: 1rem;
		overflow: hidden;
	}

	.tv-container iframe {
		width: 100%;
		height: 100%;
		border: none;
		border-radius: inherit;
	}

	.tv-info {
		padding: 1rem;
		text-align: center;
		background-color: hsla(var(--system-color-light-hsl), 0.6);
		backdrop-filter: blur(10px);
		border-top: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
	}

	.tv-info h3 {
		margin: 0 0 0.5rem 0;
		color: var(--system-color-light-contrast);
		font-size: 1.125rem;
		font-weight: 600;
	}

	.tv-info p {
		margin: 0;
		color: hsla(var(--system-color-dark-hsl), 0.7);
		font-size: 0.875rem;
	}

	/* Dark mode adjustments */
	:global(.dark) .container {
		background-color: var(--system-color-dark);
	}

	:global(.dark) .window-title {
		color: var(--system-color-dark-contrast);
	}

	:global(.dark) .tv-info {
		background-color: hsla(var(--system-color-dark-hsl), 0.6);
		border-top-color: hsla(var(--system-color-light-hsl), 0.1);
	}

	:global(.dark) .tv-info h3 {
		color: var(--system-color-dark-contrast);
	}

	:global(.dark) .tv-info p {
		color: hsla(var(--system-color-light-hsl), 0.7);
	}
</style> 