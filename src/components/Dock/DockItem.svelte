<script module>
	const baseWidth = 57.6;
	const distanceLimit = baseWidth * 6;
	const beyond_the_distance_limit = distanceLimit + 1;
	const distanceInput = [
		-distanceLimit,
		-distanceLimit / 1.25,
		-distanceLimit / 2,
		0,
		distanceLimit / 2,
		distanceLimit / 1.25,
		distanceLimit,
	];
	const widthOutput = [
		baseWidth,
		baseWidth * 1.1,
		baseWidth * 1.414,
		baseWidth * 2,
		baseWidth * 1.414,
		baseWidth * 1.1,
		baseWidth,
	];
</script>

<script lang="ts">
	import { interpolate } from 'popmotion';
	import { onDestroy, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps, type AppID } from '🍎/state/apps.svelte';
	import { preferences } from '🍎/state/preferences.svelte';

	const {
		mouse_x,
		app_id,
		needs_update = false,
	}: {
		mouse_x: number | null;
		app_id: AppID;
		needs_update?: boolean;
	} = $props();

	let image_el = $state<HTMLImageElement>();

	let distance = $state(beyond_the_distance_limit);

	const width_px = spring(baseWidth, {
		damping: 0.47,
		stiffness: 0.12,
	});

	const get_width_from_distance = interpolate(distanceInput, widthOutput);

	$effect(() => {
		distance;

		untrack(() => ($width_px = get_width_from_distance(distance)));
	});

	let raf: number;
	function animate() {
		if (image_el && mouse_x !== null) {
			const rect = image_el.getBoundingClientRect();

			// get the x coordinate of the img DOMElement's center
			// the left x coordinate plus the half of the width
			const img_center_x = rect.left + rect.width / 2;

			// difference between the x coordinate value of the mouse pointer
			// and the img center x coordinate value
			const distance_delta = mouse_x - img_center_x;
			distance = distance_delta;
			return;
		}

		distance = beyond_the_distance_limit;
	}

	$effect(() => {
		mouse_x;
		if (preferences.reduced_motion || apps.is_being_dragged) return;

		raf = requestAnimationFrame(animate);
	});

	const {
		title,
		should_open_window: shouldOpenWindow,
		external_action: externalAction,
	} = apps_config[app_id];

	// Spring animation for the click animation
	const appOpenIconBounceTransform = tweened(0, {
		duration: 400,
		easing: sineInOut,
	});

	async function bounceEffect() {
		// Animate the icon
		await appOpenIconBounceTransform.set(-40);

		// Now animate it back to its place
		appOpenIconBounceTransform.set(0);
	}

	async function openApp(e: MouseEvent) {
		if (!shouldOpenWindow) return externalAction?.(e);

		// For the bounce animation
		const isAppAlreadyOpen = apps.open[app_id];

		apps.open[app_id] = true;
		apps.active = app_id;

		if (isAppAlreadyOpen) return;

		bounceEffect();
	}

	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		// Special case for ChatGPT app which uses SVG directly
		if (app_id === 'chatgpt') {
			img.src = `/app-icons/${app_id}/icon.svg`;
		} else {
			img.src = `/app-icons/${app_id}/256.png`;
		}
	}

	onDestroy(() => {
		cancelAnimationFrame(raf);
	});

	const is_app_store = $derived(app_id === 'appstore');
	const show_pwa_badge = $derived(is_app_store && needs_update);

	$effect(() => {
		if (show_pwa_badge) bounceEffect();
	});
</script>

<button 
	onclick={openApp} 
	aria-label="Launch {title} app" 
	class="dock-open-app-button {app_id} {app_id === 'about-this-mac' ? 'about-this-mac' : ''}"
>
	<p
		class="tooltip"
		class:tooltip-enabled={!apps.is_being_dragged}
		class:dark={preferences.theme.scheme === 'dark'}
		style:top={preferences.reduced_motion ? '-50px' : '-35%'}
		style:transform="translate(0, {$appOpenIconBounceTransform}px)"
		use:elevation={'dock-tooltip'}
	>
		{title}
	</p>

	<span style:transform="translate(0, {$appOpenIconBounceTransform}px)">
		<img
			bind:this={image_el}
			src="/app-icons/{app_id}/256.webp"
			alt="{title} app"
			style:width="{$width_px / 16}rem"
			draggable="false"
			onerror={handleImageError}
		/>
	</span>

	<div class="dot" style:--opacity={+apps.open[app_id]}></div>

	{#if show_pwa_badge}
		<div class="pwa-badge" style:transform="scale({$width_px / baseWidth})">1</div>
	{/if}
</button>

<style>
	img {
		will-change: width;
	}

	/* Make About the Developer app icon round */
	.mayank-profile img {
		border-radius: 50%;
	}

	button {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: relative;

		border-radius: 0.5rem;
	}

	button:hover .tooltip.tooltip-enabled,
	button:focus-visible .tooltip.tooltip-enabled {
		display: block;
	}

	button > span {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tooltip {
		--double-border: 0 0 0 0 white;

		white-space: nowrap;

		position: absolute;

		background-color: hsla(var(--system-color-light-hsl), 0.5);
		backdrop-filter: blur(5px);

		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;

		box-shadow:
			hsla(0deg, 0%, 0%, 30%) 0px 1px 5px 2px,
			var(--double-border);

		color: var(--system-color-light-contrast);
		font-family: var(--system-font-family);
		font-weight: 400;
		font-size: 0.9rem;
		letter-spacing: 0.4px;

		display: none;
	}

	.tooltip.dark {
		--double-border: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
			0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);
	}

	.dot {
		height: 4px;
		width: 4px;

		margin: 0px;

		border-radius: 50%;

		background-color: var(--system-color-dark);

		opacity: var(--opacity);
	}
	.pwa-badge {
		position: absolute;
		top: 1px;
		right: -1px;

		background-color: rgba(248, 58, 58, 0.85);

		box-shadow: hsla(var(--system-color-dark-hsl), 0.4) 0px 0.5px 2px;
		border-radius: 50%;

		pointer-events: none;
		vertical-align: middle;

		width: 1.5rem;
		height: 1.5rem;

		margin: 0;
		padding: 0;

		text-align: center;
		color: white;

		font-size: 1rem;
		line-height: 1.5;
	}
</style>
