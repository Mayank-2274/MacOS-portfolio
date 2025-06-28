<script lang="ts">
	import AppleIcon from '~icons/mdi/apple';
	import { click_outside, elevation, focus_outside } from '🍎/actions';
	import { menubar_state } from '🍎/state/menubar.svelte';
	import { show_bootup_screen } from '🍎/state/system.svelte';
	import Menu from './Menu.svelte';
	import { apps } from '🍎/state/apps.svelte';

	function handleMenuItemClick(menuId: string, itemId: string) {
		// Handle apple menu actions
		if (menuId === 'apple') {
			switch (itemId) {
				case 'restart':
					handleRestart();
					break;
				case 'shutdown':
					handleShutdown();
					break;
				case 'sleep':
					handleSleep();
					break;
				case 'lock-screen':
					handleLockScreen();
					break;
				case 'logout':
					handleLogout();
					break;
				case 'about-this-mac':
					handleAboutThisMac();
					break;
				case 'system-preferences':
					handleSystemPreferences();
					break;
				case 'app-store':
					handleAppStore();
					break;
				case 'recent-items':
					handleRecentItems();
					break;
				case 'force-quit':
					handleForceQuit();
					break;
			}
		}
		
		// Close the menu after action
		menubar_state.active = '';
	}

	function handleRestart() {
		// Show bootup screen and then reload
		show_bootup_screen.value = true;
		setTimeout(() => {
			window.location.reload();
		}, 100);
	}

	function handleShutdown() {
		// Close the window/tab
		window.close();
	}

	function handleSleep() {
		// Simulate sleep by hiding the interface
		document.body.style.display = 'none';
		setTimeout(() => {
			document.body.style.display = 'block';
		}, 2000);
	}

	function handleLockScreen() {
		// Simulate lock screen - do nothing for now
	}

	function handleLogout() {
		// Simulate logout
		window.location.reload();
	}

	function handleAboutThisMac() {
		apps.open['about-this-mac'] = true;
		apps.active = 'about-this-mac';
	}

	function handleSystemPreferences() {
		// Do nothing for now
	}

	function handleAppStore() {
		// Do nothing for now
	}

	function handleRecentItems() {
		// Do nothing for now
	}

	function handleForceQuit() {
		// Do nothing for now
	}
</script>

<div
	class="container"
	use:click_outside={() => (menubar_state.active = '')}
	use:focus_outside={() => (menubar_state.active = '')}
>
	{#each Object.entries(menubar_state.menus) as [menuID, menuConfig]}
		<div>
			<div style:height="100%">
				<button
					class="menu-button"
					class:default-menu={menuID === 'default'}
					class:apple-icon-button={menuID === 'apple'}
					style:--scale={menubar_state.active === menuID ? 1 : 0}
					onclick={() => (menubar_state.active = menuID)}
					onmouseover={() => menubar_state.active && (menubar_state.active = menuID)}
					onfocus={() => (menubar_state.active = menuID)}
				>
					{#if menuID === 'apple'}
						<AppleIcon />
					{:else}
						{menuConfig.title}
					{/if}
				</button>
			</div>

			<div
				class="menu-parent"
				style:visibility={menubar_state.active === menuID ? 'visible' : 'hidden'}
				use:elevation={'menubar-menu-parent'}
			>
				<Menu 
					menu={menuConfig.menu} 
					onMenuItemClick={(itemId) => handleMenuItemClick(menuID, itemId)}
				/>
			</div>
		</div>
	{/each}
</div>

<style>
	.container {
		height: 100%;

		display: flex;
		position: relative;
	}

	.menu-parent {
		position: absolute;
		margin-top: 1.5px;
	}

	.menu-button {
		font-weight: 500;

		border-radius: 0.25rem;

		position: relative;
		z-index: 1;

		padding: 0 0.5rem;

		height: 100%;

		&.default-menu {
			font-weight: 600 !important;
			margin: 0 6px;
		}

		&::after {
			content: '';

			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;

			height: 100%;
			width: 100%;

			border-radius: inherit;

			transform: scale(var(--scale), var(--scale));
			transform-origin: center center;

			transition: transform 100ms ease;

			background-color: hsla(var(--system-color-dark-hsl), 0.2);
		}
	}

	.apple-icon-button {
		margin: 0 0rem 0 0.5rem;
		padding: 0 0.7rem;

		display: block;

		:global(svg) {
			font-size: 1rem;
		}
	}
</style>
