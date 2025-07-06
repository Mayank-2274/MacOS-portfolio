<script lang="ts">
	import { onMount } from 'svelte';

	const {
		is_being_dragged,
	}: {
		is_being_dragged: boolean;
	} = $props();

	interface Message {
		id: string;
		type: 'user' | 'assistant' | 'image';
		content: string;
		timestamp: Date;
		isLoading?: boolean;
	}

	let puter: any = null;
	let messages: Message[] = $state([]);
	let inputText = $state('');
	let isLoading = $state(false);
	let currentMode: 'chat' | 'image' = $state('chat');
	let puterLoaded = $state(false);
	let messagesContainer: HTMLElement;
	let textarea: HTMLTextAreaElement;

	/* Auto-focus textarea when component mounts and after sending messages */
	$effect(() => {
		if (textarea && puterLoaded) {
			// Small delay to ensure DOM is ready
			setTimeout(() => {
				textarea.focus();
			}, 50);
		}
	});

	// Auto-scroll to bottom when new messages are added
	$effect(() => {
		if (messagesContainer && messages.length > 0) {
			setTimeout(() => {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}, 100);
		}
	});

	// Keep textarea focused at all times
	$effect(() => {
		if (textarea) {
			const handleBlur = () => {
				// Re-focus after a short delay to avoid conflicts
				setTimeout(() => {
					if (textarea && !isLoading) {
						textarea.focus();
					}
				}, 10);
			};
			
			textarea.addEventListener('blur', handleBlur);
			
			return () => {
				textarea.removeEventListener('blur', handleBlur);
			};
		}
	});

	onMount(async () => {
		try {
			// Load Puter.js from CDN
			const script = document.createElement('script');
			script.src = 'https://js.puter.com/v2/';
			script.onload = () => {
				// @ts-ignore
				puter = window.puter;
				// Configure Puter to run in background without opening new windows
				if (puter && puter.config) {
					puter.config({
						silent: true,
						background: true
					});
				}
				puterLoaded = true;
				console.log('Puter.js loaded successfully');
			};
			script.onerror = () => {
				console.error('Failed to load Puter.js');
				puterLoaded = false;
			};
			document.head.appendChild(script);
		} catch (error) {
			console.error('Failed to load Puter.js:', error);
			puterLoaded = false;
		}

		// Add welcome message
		messages.push({
			id: 'welcome',
			type: 'assistant',
			content: 'Hello! I\'m ChatGPT. I can help you with questions and generate images. Switch between Chat and Image modes using the tabs above.',
			timestamp: new Date()
		});
	});

	function scrollToBottom() {
		if (messagesContainer) {
			setTimeout(() => {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}, 100);
		}
	}

	function focusTextarea() {
		if (textarea) {
			textarea.focus();
		}
	}

	async function sendMessage() {
		if (!inputText.trim() || isLoading || !puterLoaded) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			type: 'user',
			content: inputText.trim(),
			timestamp: new Date()
		};

		messages.push(userMessage);
		const prompt = inputText.trim();
		inputText = '';
		isLoading = true;
		scrollToBottom();

		try {
			if (currentMode === 'chat') {
				// Add loading message
				const loadingMessage: Message = {
					id: Date.now().toString() + '_loading',
					type: 'assistant',
					content: 'Thinking...',
					timestamp: new Date(),
					isLoading: true
				};
				messages.push(loadingMessage);
				scrollToBottom();

				// Use Puter AI for chat
				const response = await (window as any).puter.ai.chat(prompt);
				
				// Remove loading message
				messages = messages.filter(m => m.id !== loadingMessage.id);
				
				// Add AI response
				const aiMessage: Message = {
					id: Date.now().toString(),
					type: 'assistant',
					content: response,
					timestamp: new Date()
				};
				messages.push(aiMessage);
			} else {
				// Add loading message for image generation
				const loadingMessage: Message = {
					id: Date.now().toString() + '_loading',
					type: 'assistant',
					content: 'Generating image...',
					timestamp: new Date(),
					isLoading: true
				};
				messages.push(loadingMessage);
				scrollToBottom();

				// Use Puter AI for image generation
				const imageElement = await (window as any).puter.ai.txt2img(prompt, false);
				
				// Remove loading message
				messages = messages.filter(m => m.id !== loadingMessage.id);
				
				// Add image response
				const imageMessage: Message = {
					id: Date.now().toString(),
					type: 'image',
					content: imageElement.src,
					timestamp: new Date()
				};
				messages.push(imageMessage);
			}
		} catch (error) {
			console.error('Error:', error);
			// Remove any loading messages
			messages = messages.filter(m => !m.isLoading);
			
			const errorMessage: Message = {
				id: Date.now().toString(),
				type: 'assistant',
				content: 'Sorry! I can only create images, switch to chat mode to ask me anything. Or try again by giving a more detailed prompt for image generation.',
				timestamp: new Date()
			};
			messages.push(errorMessage);
		} finally {
			isLoading = false;
			scrollToBottom();
			// Re-focus textarea after sending message with a small delay
			setTimeout(() => {
				if (textarea) {
					textarea.focus();
				}
			}, 100);
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function autoResizeTextarea(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
	}
</script>

<div class="chatgpt-container">
	<!-- Header with mode switcher -->
	<header class="app-window-drag-handle">
		<div class="titlebar">
			<h1>ChatGPT</h1>
		</div>
	</header>

	<div class="toolbar">
		<div class="mode-switcher">
			<button 
				class="mode-btn" 
				class:active={currentMode === 'chat'}
				onclick={() => currentMode = 'chat'}
			>
				💬 Chat
			</button>
			<button 
				class="mode-btn" 
				class:active={currentMode === 'image'}
				onclick={() => currentMode = 'image'}
			>
				🎨 Image
			</button>
		</div>
	</div>

	<!-- Messages area -->
	<div class="messages-container" bind:this={messagesContainer}>
		{#each messages as message (message.id)}
			<div class="message {message.type}" class:loading={message.isLoading}>
				<div class="message-content">
					{#if message.type === 'image'}
						<div class="image-container">
							<img src={message.content} alt="Generated image" />
						</div>
					{:else}
						<div class="text-content">
							{message.content}
							{#if message.isLoading}
								<div class="loading-dots">
									<span></span>
									<span></span>
									<span></span>
								</div>
							{/if}
						</div>
					{/if}
				</div>
				<div class="message-time">
					{formatTime(message.timestamp)}
				</div>
			</div>
		{/each}
	</div>

	<!-- Input area - Fixed at bottom -->
	<div class="input-container">
		<div class="input-wrapper" onclick={focusTextarea}>
			<textarea
				bind:this={textarea}
				bind:value={inputText}
				onkeydown={handleKeyPress}
				oninput={autoResizeTextarea}
				placeholder={puterLoaded ? (currentMode === 'chat' ? 'Ask me anything...' : 'Describe the image you want to generate...') : 'Loading ChatGPT...'}
				disabled={isLoading}
				style="height: 60px;"
			></textarea>
			<button 
				class="send-btn" 
				onclick={sendMessage}
				disabled={!inputText.trim() || isLoading || !puterLoaded}
			>
				{#if isLoading}
					<div class="spinner"></div>
				{:else if !puterLoaded}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
					</svg>
				{:else}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
					</svg>
				{/if}
			</button>
		</div>
		<div class="input-hint">
			{#if currentMode === 'chat'}
				Press Enter to send, Shift+Enter for new line
			{:else}
				Describe your image in detail for best results
			{/if}
		</div>
	</div>
</div>

<style>
	.chatgpt-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		max-height: 100vh;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		color: #2c3e50;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		position: relative;
		overflow: hidden; /* Disable outer scrolling */
	}

	.app-window-drag-handle {
		flex-shrink: 0;
		width: 100%;
		height: 36px; /* Standard macOS title bar height */
		-webkit-app-region: drag;
		display: flex;
		align-items: center;
		padding-left: 70px; /* Space for traffic lights */
		box-sizing: border-box;
		z-index: 1;
		background: transparent;
		overflow: hidden; /* Prevent any overflow */
	}

	.titlebar {
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		overflow: hidden;
	}

	.titlebar h1 {
		font-size: 0.9rem;
		font-weight: 500;
		color: #4a4a4a;
		-webkit-user-select: none;
	}

	.toolbar {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.5rem 1rem;
		background: #202e3b;
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		position: relative;
		z-index: 0;
		overflow: hidden;
	}

	.mode-switcher {
		display: flex;
		gap: 0.5rem;
		background: transparent;
		border-radius: 8px;
		padding: 4px;
	}

	.mode-btn {
		padding: 0.5rem 1rem;
		border: none;
		background: rgba(169, 168, 168, 0.9);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9rem;
		font-weight: 500;
		color: #060607;
	}

	.mode-btn:hover {
		background: rgb(108, 173, 102);
		color: #1052bc;
	}

	.mode-btn.active {
		background: #10A37F;
		color: white;
		box-shadow: 0 2px 4px rgba(16, 163, 127, 0.3);
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		padding-bottom: 0; /* Remove bottom padding to avoid double spacing */
		display: flex;
		flex-direction: column;
		gap: 1rem;
		/* Ensure messages container can scroll independently */
		min-height: 0;
	}

	.message {
		display: flex;
		flex-direction: column;
		max-width: 80%;
		animation: fadeIn 0.3s ease;
	}

	.message.user {
		align-self: flex-end;
	}

	.message.assistant,
	.message.image {
		align-self: flex-start;
	}

	.message-content {
		padding: 0.75rem 1rem;
		border-radius: 18px;
		position: relative;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.message.user .message-content {
		background: #10A37F;
		color: rgb(10, 6, 6);
		border-bottom-right-radius: 6px;
	}

	.message.assistant .message-content,
	.message.image .message-content {
		background: rgba(255, 255, 255, 0.9);
		color: #2c3e50;
		border-bottom-left-radius: 6px;
		backdrop-filter: blur(10px);
	}

	.text-content {
		line-height: 1.5;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.image-container {
		border-radius: 12px;
		overflow: hidden;
		max-width: 400px;
	}

	.image-container img {
		width: 100%;
		height: auto;
		display: block;
	}

	.message-time {
		font-size: 0.7rem;
		color: #9ca3af;
		margin-top: 0.25rem;
		align-self: flex-end;
	}

	.message.user .message-time {
		align-self: flex-end;
	}

	.message.assistant .message-time,
	.message.image .message-time {
		align-self: flex-start;
	}

	.loading-dots {
		display: inline-flex;
		gap: 4px;
		margin-left: 8px;
	}

	.loading-dots span {
		width: 6px;
		height: 6px;
		background: #9ca3af;
		border-radius: 50%;
		animation: bounce 1.4s ease-in-out infinite both;
	}

	.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
	.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

	/* Fixed input container at bottom */
	.input-container {
		position: relative; /* Changed from sticky to relative */
		flex-shrink: 0;
		padding: 1rem 1.5rem;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		z-index: 10;
		overflow: hidden; /* Prevent any overflow */
	}

	.input-wrapper {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		background: rgb(167, 167, 167);
		border-radius: 20px;
		padding: 0.75rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(0, 0, 0, 0.1);
		cursor: text;
		transition: all 0.2s ease;
	}

	.input-wrapper:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.input-wrapper:focus-within {
		border-color: #10A37F;
		box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.1);
	}

	textarea {
		flex: 1;
		border: none;
		outline: none;
		resize: none;
		font-family: inherit;
		font-size: 0.95rem;
		line-height: 1.5;
		max-height: 200px;
		min-height: 60px;
		height: auto;
		background: transparent;
		overflow-y: auto;
		cursor: text;
		color: black;
	}

	textarea:focus {
		outline: none;
		box-shadow: none;
	}

	textarea::placeholder {
		color: #090a0d;
	}

	.send-btn {
		width: 36px;
		height: 36px;
		border: none;
		background: #10A37F;
		color: white;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.send-btn:hover:not(:disabled) {
		background: #0d8f6b;
		transform: scale(1.05);
	}

	.send-btn:disabled {
		background: #d1d5db;
		cursor: not-allowed;
		transform: none;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top: 2px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.input-hint {
		margin-top: 0.5rem;
		font-size: 0.8rem;
		color: #6b7280;
		text-align: center;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes bounce {
		0%, 80%, 100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	/* Dark mode support */
	:global(.dark) .chatgpt-container {
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		color: #1e61a3;
	}

	:global(.dark) .app-window-drag-handle {
		background: rgba(31, 41, 55, 0.95);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	:global(.dark) .logo span {
		color: #06090c;
	}

	:global(.dark) .mode-switcher {
		background: rgba(255, 255, 255, 0.1);
	}

	:global(.dark) .mode-btn {
		color: #01060d;
	}

	:global(.dark) .mode-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #05090e;
	}

	:global(.dark) .message.assistant .message-content,
	:global(.dark) .message.image .message-content {
		background: rgba(31, 41, 55, 0.9);
		color: #e9eaeb;
	}

	:global(.dark) .input-container {
		background: rgba(31, 41, 55, 0.95);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	:global(.dark) .input-wrapper {
		background: rgba(55, 65, 81, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	:global(.dark) textarea {
		color: #f9fafb;
	}

	:global(.dark) textarea::placeholder {
		color: #9ca3af;
	}

	/* Traffic lights positioning */
	:global(.tl-container.chatgpt) {
		position: absolute;
		top: 0.7rem;
		left: 0.7rem;
		z-index: 100;
	}
</style>