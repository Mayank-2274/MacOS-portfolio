<script lang="ts">
	import type { Snippet } from 'svelte';
	import { preferences } from '🍎/state/preferences.svelte';

	const {
		grid,
		children,
	}: {
		grid: [[columnStart: number, columnSpan: number], [rowStart: number, rowSpan: number]];
		children: Snippet;
	} = $props();

	const [[columnStart, columnSpan], [rowStart, rowSpan]] = grid;
</script>

<section
	class="container"
	class:dark={preferences.theme.scheme === 'dark'}
	style:grid-column="{columnStart} / span {columnSpan}"
	style:grid-row="{rowStart} / span {rowSpan}"
>
	{@render children?.()}
</section>

<style>
	.container {
		--border-size: 0;

		display: grid;
		grid-auto-rows: 1fr;
		gap: 0.25rem;

		position: relative;

		padding: 0.5rem;

		border-radius: 0.75rem;
		box-shadow:
			hsla(0, 0%, 0%, 0.3) 0px 1px 4px -1px,
			inset 0 0 0 var(--border-size) hsla(var(--system-color-dark-hsl), 0.3),
			0 0 0 var(--border-size) hsla(var(--system-color-light-hsl), 0.3);

		background-color: hsla(var(--system-color-light-hsl), 0.5);

		&.dark {
			--border-size: 0.4px;
		}
	}
</style>
