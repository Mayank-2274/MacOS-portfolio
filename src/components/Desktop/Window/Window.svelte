<script lang="ts">
	import {
		bounds,
		BoundsFrom,
		Compartment,
		ControlFrom,
		controls,
		disabled,
		draggable,
		events,
		position,
	} from '@neodrag/svelte';
	import { onMount, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { elevation, resize_window } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { rand_int } from '🍎/helpers/random';
	import { sleep } from '🍎/helpers/sleep';
	import { apps, type AppID } from '🍎/state/apps.svelte';
	import { preferences } from '🍎/state/preferences.svelte';

	import AppNexus from '../../apps/AppNexus.svelte';
	import TrafficLights from './TrafficLights.svelte';

	const { app_id }: { app_id: AppID } = $props();

	let dragging_enabled = $state(true);
	let resizing_enabled = $state(true);
	let is_resizing = $state(false);

	let is_maximized = $state(false);
	let minimized_transform = $state<string>();

	let windowEl = $state<HTMLElement>();
	let current_width = $state<number>();
	let current_height = $state<number>();

	const { height, width } = apps_config[app_id];
	const resizable = apps_config[app_id].resizable !== false;

	const remModifier = +height * 1.2 >= window.innerHeight ? 24 : 16;

	const randX = rand_int(-600, 600);
	const randY = rand_int(-100, 100);

	// Check if this app should open in full screen by default
	const shouldOpenFullscreen = apps_config[app_id].fullscreen_by_default;
	
	// Check if this is the About This Mac app
	const isAboutThisMac = app_id === 'about-this-mac';

	let defaultPosition = shouldOpenFullscreen 
		? { x: 0, y: 0 } // Top-left position for full screen apps
		: isAboutThisMac 
			? { x: 50, y: 50 } // Fixed center position for About This Mac
			: { x: 0, y: 0 }; // Top-left position for all other apps

	const disabledComp = Compartment.of(() => disabled(!dragging_enabled));

	// Dynamic bounds based on fullscreen state
	const boundsComp = Compartment.of(() => {
		if (is_maximized) {
			// Allow movement within viewport when fullscreen
			return bounds(BoundsFrom.viewport({ 
				bottom: -window.innerHeight + 100, 
				top: 0, 
				left: -window.innerWidth + 100, 
				right: 0 
			}));
		} else {
			// Normal bounds for regular windows
			return bounds(BoundsFrom.viewport({ bottom: -6000, top: 27.2, left: -6000, right: -6000 }));
		}
	});

	$effect(() => {
		apps.active_z_index;

		if (apps.active === app_id) {
			untrack(() => (apps.z_indices[app_id] = apps.active_z_index));
		}
	});

	function focusApp() {
		apps.active = app_id;
	}

	function windowCloseTransition(
		el: HTMLElement,
		{ duration = preferences.reduced_motion ? 0 : 300 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		const existingTransform = getComputedStyle(el).transform;

		return {
			duration,
			easing: sineInOut,
			css: (t) => `opacity: ${t}; transform: ${existingTransform} scale(${t})`,
		};
	}

	async function maximizeApp() {
		if (!preferences.reduced_motion) {
			windowEl.style.transition = 'height 0.3s ease, width 0.3s ease, transform 0.3s ease';
		}

		if (!is_maximized) {
			// Keep dragging enabled for fullscreen mode
			dragging_enabled = true;
			// Disable resizing in fullscreen mode
			resizing_enabled = false;

			minimized_transform = windowEl.style.transform;
			
			// Store current dimensions before maximizing
			if (current_width && current_height) {
				windowEl.dataset.prevWidth = current_width.toString();
				windowEl.dataset.prevHeight = current_height.toString();
			}
			
			// Ensure the window is positioned at the top-left corner for full screen
			windowEl.style.transform = `translate(0px, 0px)`;

			windowEl.style.width = `100vw`;
			windowEl.style.height = '100vh';
			
			// Update current dimensions
			current_width = window.innerWidth;
			current_height = window.innerHeight;
			
			// Add scrolling functionality
			windowEl.style.overflow = 'auto';
			
			// Add fullscreen class
			windowEl.classList.add('fullscreen');
		} else {
			dragging_enabled = true;
			// Re-enable resizing when exiting fullscreen
			resizing_enabled = resizable;
			
			windowEl.style.transform = minimized_transform;

			// Restore previous dimensions if available, otherwise use default
			if (windowEl.dataset.prevWidth && windowEl.dataset.prevHeight) {
				windowEl.style.width = `${windowEl.dataset.prevWidth}px`;
				windowEl.style.height = `${windowEl.dataset.prevHeight}px`;
				current_width = parseFloat(windowEl.dataset.prevWidth);
				current_height = parseFloat(windowEl.dataset.prevHeight);
			} else {
				windowEl.style.width = `${+width / remModifier}rem`;
				windowEl.style.height = `${+height / remModifier}rem`;
				
				// Update current dimensions
				const rect = windowEl.getBoundingClientRect();
				current_width = rect.width;
				current_height = rect.height;
			}
			
			// Remove explicit overflow setting when restoring, allowing content to scroll if needed
			windowEl.style.overflow = 'hidden';
			
			// Remove fullscreen class
			windowEl.classList.remove('fullscreen');
		}

		is_maximized = !is_maximized;

		apps.fullscreen[app_id] = is_maximized;

		await sleep(300);

		if (!preferences.reduced_motion) windowEl.style.transition = '';
	}

	function closeApp() {
		apps.open[app_id] = false;
		apps.fullscreen[app_id] = false;
	}

	function onAppDragStart() {
		focusApp();
		apps.is_being_dragged = true;
	}

	function onAppDragEnd() {
		apps.is_being_dragged = false;
	}

	function onResizeStart() {
		is_resizing = true;
		focusApp();
	}

	function onResizeEnd() {
		is_resizing = false;
	}

	function onResize(dimensions: { width: number; height: number }) {
		current_width = dimensions.width;
		current_height = dimensions.height;
	}

	onMount(() => {
		windowEl?.focus();
		
		// Initialize current width and height
		if (windowEl) {
			const rect = windowEl.getBoundingClientRect();
			current_width = rect.width;
			current_height = rect.height;
		}
		
		// Check if this app should open in full screen by default
		if (apps_config[app_id].fullscreen_by_default && !is_maximized) {
			// Immediately set the position to (0,0) for full screen apps
			if (windowEl) {
				windowEl.style.transform = `translate(0px, 0px)`;
			}
			
			// Use setTimeout to ensure the window is fully rendered before maximizing
			setTimeout(() => {
				maximizeApp();
			}, 100);
		}
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	role="application"
	class="container"
	class:dark={preferences.theme.scheme === 'dark'}
	class:active={apps.active === app_id}
	class:resizing={is_resizing}
	class:resizable={resizable && resizing_enabled}
	style:width="{+width / remModifier}rem"
	style:height="{+height / remModifier}rem"
	style:z-index={apps.z_indices[app_id]}
	tabindex="-1"
	bind:this={windowEl}
	{@attach draggable(() => [
		controls({ allow: ControlFrom.selector('.app-window-drag-handle') }),
		boundsComp,
		disabledComp,
		position({ default: defaultPosition }),
		events({ onDragStart: onAppDragStart, onDragEnd: onAppDragEnd }),
	])}
	use:resize_window={resizable && resizing_enabled ? {
		minWidth: 200,
		minHeight: 150,
		onResize,
		onResizeStart,
		onResizeEnd
	} : null}
	onclick={focusApp}
	onkeydown={() => {}}
	out:windowCloseTransition
>
	<div class="tl-container {app_id}" use:elevation={'window-traffic-lights'}>
		<TrafficLights {app_id} on_maximize_click={maximizeApp} on_close_app={closeApp} />
	</div>

	<AppNexus {app_id} is_being_dragged={apps.is_being_dragged} />
</section>

<style>
	.container {
		--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23);

		width: 100%;
		height: 100%;

		display: grid;
		grid-template-rows: 1fr;

		position: absolute;

		will-change: width, height, transform;

		border-radius: 0.75rem;
		box-shadow: var(--elevated-shadow);

		cursor: var(--system-cursor-default), auto;

		/* Add overflow handling for fullscreen */
		overflow: hidden;

		&.active {
			/* // --elevated-shadow: 0px 6.7px 12px rgba(0, 0, 0, 0.218), 0px 22.3px 40.2px rgba(0, 0, 0, 0.322),
      //   0px 100px 180px rgba(0, 0, 0, 0.54); */
			--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.28), 0px 68px 80px rgba(0, 0, 0, 0.56);
		}

		&.dark {
			& > :global(section),
			& > :global(div) {
				border-radius: inherit;
				box-shadow:
					inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
					0 0 0 1px hsla(var(--system-color-light-hsl), 0.5),
					var(--elevated-shadow);
			}
		}

		/* Fullscreen specific styles */
		&:global(.fullscreen) {
			border-radius: 0;
			overflow: auto;
			box-shadow: none;
			/* Remove fixed positioning to allow movement */
			position: absolute;
			/* Remove transform override to allow dragging */
			width: 100vw !important;
			height: 100vh !important;
			z-index: 9999;
		}
		
		/* Resizing styles */
		&.resizable {
			/* Show resize handles only on hover or when actively resizing */
			&:hover :global(.resize-handle),
			&.resizing :global(.resize-handle) {
				opacity: 1;
			}
		}
		
		/* Smooth transitions during resize */
		&.resizing {
			transition: none !important;
			user-select: none;
		}
	}

	/* Style for resize handles */
	:global(.resize-handle) {
		opacity: 0;
		transition: opacity 0.2s ease;
		background-color: transparent;
		z-index: 10001;
	}

	:global(.resize-n),
	:global(.resize-s),
	:global(.resize-e),
	:global(.resize-w) {
		background-color: transparent;
	}

	:global(.resize-ne),
	:global(.resize-nw),
	:global(.resize-se),
	:global(.resize-sw) {
		background-color: transparent;
	}

	.tl-container {
		position: absolute;
		top: 1rem;
		left: 1rem;

		/* // Necessary, as `.container` tries to apply shadow on it */
		box-shadow: none !important;
		
		/* Ensure traffic lights are visible in fullscreen */
		z-index: 10000;
	}
</style>
