<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte';
	import TwitterIcon from '~icons/mdi/twitter';
	import FileDocumentIcon from '~icons/mdi/file-document';
	import WorksIcon from '~icons/ic/round-workspaces';
	import GithubIcon from '~icons/mdi/github';
	import DevToIcon from '~icons/mdi/dev-to';
	import profileImage from '../../../assets/wallpapers/image.png';
	import UserIcon from '~icons/mdi/account';

	let activeTab = 'profile';

	function switchTab(tab: string) {
		activeTab = tab;
	}

	function external(node: HTMLAnchorElement) {
		node.rel = 'noopener noreferrer';
		node.target = '_blank';
	}
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle">
		<span>About the Developer</span>
	</header>

	<aside class:light={preferences.theme.scheme === 'light'}>
		<nav>
			<button class="nav-button" class:active={activeTab === 'profile'} on:click={() => switchTab('profile')}>
				<UserIcon />                            Profile
			</button>
			<button class="nav-button" class:active={activeTab === 'resume'} on:click={() => switchTab('resume')}>
				<FileDocumentIcon />                     Resume 	
			</button>
			<a href="https:mayank-22portfolio.netlify.app" use:external> <WorksIcon /> Ubuntu Portfolio</a>

			<hr />

			
			<a href="https://github.com/Mayank-2274" use:external> <GithubIcon /> Github </a>
			
		</nav>
	</aside>

	<section class="content">
		{#if activeTab === 'profile'}
			<img height="200" width="200" src={profileImage} alt="Developer profile" />

			<br />

			<h1>Hi, I'm Mayank</h1>

			<h2>
				I'm the creator of macOS Web, which you're on right now
				<img src="/emojis/wink.png" alt="Wink emoji" class="emoji" />
			</h2>

			<br /><br />

			<p>
				I am a fullstack web developer, with an infinite amount of love for frontend web development,
				specifically JavaScript, TypeScript, and for frontend frameworks like Svelte, Vue and React, NextJS, TailwindCSS, and for backend frameworks like NodeJS, Express, and MongoDB.
				<img src="/emojis/star-struck.png" alt="Star Struck face emoji" class="emoji" />
			</p>

			<br /><br />

			<p>
				However, my love for tech doesn't end there. I enjoy writing backend APIs, scripts, working
				with databases, and my fav platforms are NodeJS, Python, and Go.
			</p>
		{:else if activeTab === 'resume'}
			<div class="resume-content">
				<h1><b>Resume</b></h1>
				<br />
				<h2>Mayank</h2>
				<p>Full Stack Web Developer</p>
				
				<br />
				<h3>Skills</h3>
				<ul>
					<li>Frontend: JavaScript, TypeScript, React, Vue, Svelte, NextJS, TailwindCSS</li>
					<li>Backend: NodeJS, Express, Python, Go</li>
					<li>Database: MongoDB, SQL, PostgreSQL, ChromaDB</li>
					<li>Tools: Git, Docker, AWS</li>
				</ul>
				
				<br />
				<h3>Experience</h3>
				<p></p>
				
				<br />
				<h3>Education</h3>
				<p>Dayananda Sagar Institutions, Bangalore</p>
			</div>
		{/if}
	</section>
</section>

<style>
	.container {
		--color: var(--system-color-light-hsl);

		display: grid;
		grid-template-columns: 12rem 1fr;
		grid-template-rows: 3rem 1fr;

		border-radius: inherit;

		background-image: linear-gradient(
			to right,
			hsla(var(--color), 0.7) 12rem,
			hsla(var(--color), 1) 12rem 100%
		);

		transition: --color 200ms ease-in;

		color: var(--system-color-dark);
		
		/* Ensure proper height for scrolling */
		min-height: 100%;
		height: 100%;
		
		/* Handle fullscreen mode */
		:global(.fullscreen) & {
			height: 100vh;
			overflow: hidden;
		}
	}

	.titlebar {
		grid-area: 1 / 1 / span 1 / span 2;

		display: flex;
		justify-content: center;

		z-index: 1;

		padding: 0.9rem 1rem;

		width: 100%;

		border-top-left-radius: inherit;
		border-top-right-radius: inherit;

		user-select: none;

		span {
			color: hsla(var(--system-color-dark-hsl), 0.8);
			font-weight: 500;
			font-size: 0.9rem;
			letter-spacing: 0.5px;
		}
	}

	aside {
		grid-area: 1 / 1 / span 2 / span 1;

		transform: translateZ(0);

		height: calc(100% - 2.7px);
		width: calc(12rem - 2.27px);

		margin: 1.8px 0 0px 1.8px;

		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: inherit;

		&::before {
			content: '';

			width: inherit;
			height: inherit;

			border-radius: inherit;

			position: fixed;
			left: 0;
			top: 0;

			z-index: -1;
			backdrop-filter: blur(12px);
		}

		&.light {
			height: calc(100% - 3px);
			width: calc(12rem - 2.5px);

			margin: 1.7px 0 0px 1.7px;

			border-top-left-radius: 0.5rem;
			border-bottom-left-radius: 0.5rem;
		}
		
		/* Handle fullscreen mode */
		:global(.fullscreen) & {
			height: calc(100vh - 2.7px);
			overflow-y: auto;
		}

		nav {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;

			margin: 4rem 0.6rem;

			hr {
				display: block;

				width: 100%;
				height: 1px;

				background-color: hsla(var(--system-color-dark-hsl), 0.2);

				border: none;
			}

			a {
				display: flex;
				gap: 0.4rem;
				align-items: center;

				color: hsla(var(--system-color-dark-hsl), 0.9);
				text-decoration: none;
				font-weight: 400;

				padding: 0.5rem 0.5rem;

				border-radius: 0.4rem;

				transition: background-color 100ms ease;

				&:hover {
					background-color: hsla(var(--system-color-dark-hsl), 0.2);
				}
			}

			.nav-button {
				display: flex;
				gap: 0.4rem;
				align-items: center;

				color: hsla(var(--system-color-dark-hsl), 0.9);
				text-decoration: none;
				font-weight: 400;
				font-size: inherit;
				font-family: inherit;

				padding: 0.5rem 0.5rem;

				border-radius: 0.4rem;
				border: none;
				background: none;
				cursor: pointer;

				transition: background-color 100ms ease;

				&:hover {
					background-color: hsla(var(--system-color-dark-hsl), 0.2);
				}

				&.active {
					background-color: hsla(var(--system-color-dark-hsl), 0.3);
					font-weight: 500;
				}
			}
		}
	}

	.content {
		grid-area: 2 / 2 / span 1 / span 1;

		display: flex;
		flex-direction: column;
		align-items: center;

		padding: 1rem;
		
		/* Ensure content is scrollable */
		overflow-y: auto;
		max-height: 100%;
		height: 100%;

		img {
			border-radius: 50%;
		}
		
		/* Handle fullscreen mode */
		:global(.fullscreen) & {
			max-height: calc(100vh - 3rem);
			height: calc(100vh - 3rem);
			overflow-y: auto;
		}
	}

	.emoji {
		height: 1em;
		width: 1em;

		vertical-align: middle;
	}

	h1 {
		font-size: 2.618rem;
		line-height: 1.618;
	}

	h2 {
		font-size: 1.618rem;
		line-height: 1.2;
	}

	p {
		line-height: 1.618rem;
	}

	.resume-content {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		text-align: left;

		h1 {
			font-size: 2.5rem;
			margin-bottom: 1rem;
			color: hsla(var(--system-color-dark-hsl), 0.9);
		}

		h2 {
			font-size: 1.8rem;
			margin-bottom: 0.5rem;
			color: hsla(var(--system-color-dark-hsl), 0.8);
		}

		h3 {
			font-size: 1.4rem;
			margin-bottom: 0.5rem;
			color: hsla(var(--system-color-dark-hsl), 0.8);
			border-bottom: 2px solid hsla(var(--system-color-dark-hsl), 0.2);
			padding-bottom: 0.25rem;
		}

		p {
			line-height: 1.6;
			margin-bottom: 1rem;
			color: hsla(var(--system-color-dark-hsl), 0.7);
		}

		ul {
			margin-bottom: 1.5rem;
			padding-left: 1.5rem;

			li {
				line-height: 1.6;
				margin-bottom: 0.5rem;
				color: hsla(var(--system-color-dark-hsl), 0.7);
			}
		}
	}
</style>
