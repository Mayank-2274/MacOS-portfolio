<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { preferences } from '🍎/state/preferences.svelte';

	let container: HTMLDivElement;
	let shader: any;

	// Utility functions
	function smoothStep(a: number, b: number, t: number) {
		t = Math.max(0, Math.min(1, (t - a) / (b - a)));
		return t * t * (3 - 2 * t);
	}

	function length(x: number, y: number) {
		return Math.sqrt(x * x + y * y);
	}

	function roundedRectSDF(x: number, y: number, width: number, height: number, radius: number) {
		const qx = Math.abs(x) - width + radius;
		const qy = Math.abs(y) - height + radius;
		return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
	}

	function texture(x: number, y: number) {
		return { type: 't', x, y };
	}

	// Generate unique ID
	function generateId() {
		return 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
	}

	// Main Shader class
	class Shader {
		width: number;
		height: number;
		fragment: any;
		canvasDPI: number;
		id: string;
		offset: number;
		mouse: { x: number; y: number };
		mouseUsed: boolean;
		container: HTMLDivElement;
		svg: SVGElement;
		canvas: HTMLCanvasElement;
		context: CanvasRenderingContext2D;
		feImage: SVGElement;
		feDisplacementMap: SVGElement;

		constructor(options: any = {}) {
			this.width = options.width || 100;
			this.height = options.height || 100;
			this.fragment = options.fragment || ((uv: any) => texture(uv.x, uv.y));
			this.canvasDPI = 1;
			this.id = generateId();
			this.offset = 10;
			
			this.mouse = { x: 0, y: 0 };
			this.mouseUsed = false;
			
			this.createElement();
			this.setupEventListeners();
			this.updateShader();
			this.startUpdateLoop();
		}

		createElement() {
			// Create container
			this.container = document.createElement('div');
			this.container.setAttribute('data-background', '');
			this.container.style.cssText = `
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: ${this.width}px;
				height: ${this.height}px;
				overflow: hidden;
				border-radius: 150px;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15);
				cursor: default;
				backdrop-filter: url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1);
				z-index: 9999;
				pointer-events: none;
			`;

			// Create SVG filter
			this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			this.svg.setAttribute('width', '0');
			this.svg.setAttribute('height', '0');
			this.svg.style.cssText = `
				position: fixed;
				top: 0;
				left: 0;
				pointer-events: none;
				z-index: 9998;
			`;

			const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
			const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
			filter.setAttribute('id', `${this.id}_filter`);
			filter.setAttribute('filterUnits', 'userSpaceOnUse');
			filter.setAttribute('colorInterpolationFilters', 'sRGB');
			filter.setAttribute('x', '0');
			filter.setAttribute('y', '0');
			filter.setAttribute('width', this.width.toString());
			filter.setAttribute('height', this.height.toString());

			this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
			this.feImage.setAttribute('id', `${this.id}_map`);
			this.feImage.setAttribute('width', this.width.toString());
			this.feImage.setAttribute('height', this.height.toString());

			this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
			this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
			this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
			this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
			this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

			filter.appendChild(this.feImage);
			filter.appendChild(this.feDisplacementMap);
			defs.appendChild(filter);
			this.svg.appendChild(defs);

			// Create canvas for displacement map (hidden)
			this.canvas = document.createElement('canvas');
			this.canvas.width = this.width * this.canvasDPI;
			this.canvas.height = this.height * this.canvasDPI;
			this.canvas.style.display = 'none';

			this.context = this.canvas.getContext('2d')!;
		}

		constrainPosition(x: number, y: number) {
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			
			// Calculate boundaries with offset
			const minX = this.offset;
			const maxX = viewportWidth - this.width - this.offset;
			const minY = this.offset;
			const maxY = viewportHeight - this.height - this.offset;
			
			// Constrain position
			const constrainedX = Math.max(minX, Math.min(maxX, x));
			const constrainedY = Math.max(minY, Math.min(maxY, y));
			
			return { x: constrainedX, y: constrainedY };
		}

		setupEventListeners() {
			// Track mouse movement globally for automatic cursor following
			document.addEventListener('mousemove', (e) => {
				// Calculate position to center the liquid glass on the cursor
				const x = e.clientX - this.width / 2;
				const y = e.clientY - this.height / 2;
				
				// Constrain position within viewport bounds
				const constrained = this.constrainPosition(x, y);
				
				// Move the liquid glass to follow the cursor
				this.container.style.left = constrained.x + 'px';
				this.container.style.top = constrained.y + 'px';
				this.container.style.transform = 'none';

				// Update mouse position for shader effect
				this.mouse.x = 0.5; // Center of the liquid glass
				this.mouse.y = 0.5; // Center of the liquid glass
				
				// Update shader for liquid effect
				this.updateShader();
			});

			// Handle window resize to maintain constraints
			window.addEventListener('resize', () => {
				const rect = this.container.getBoundingClientRect();
				const constrained = this.constrainPosition(rect.left, rect.top);
				
				if (rect.left !== constrained.x || rect.top !== constrained.y) {
					this.container.style.left = constrained.x + 'px';
					this.container.style.top = constrained.y + 'px';
					this.container.style.transform = 'none';
				}
			});
		}

		updateShader() {
			const mouseProxy = new Proxy(this.mouse, {
				get: (target, prop) => {
					return target[prop as keyof typeof target];
				}
			});

			const w = this.width * this.canvasDPI;
			const h = this.height * this.canvasDPI;
			const data = new Uint8ClampedArray(w * h * 4);

			let maxScale = 0;
			const rawValues: number[] = [];

			for (let i = 0; i < data.length; i += 4) {
				const x = (i / 4) % w;
				const y = Math.floor(i / 4 / w);
				const pos = this.fragment(
					{ x: x / w, y: y / h },
					mouseProxy
				);
				const dx = pos.x * w - x;
				const dy = pos.y * h - y;
				maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
				rawValues.push(dx, dy);
			}

			maxScale *= 0.5;

			let index = 0;
			for (let i = 0; i < data.length; i += 4) {
				const r = rawValues[index++] / maxScale + 0.5;
				const g = rawValues[index++] / maxScale + 0.5;
				data[i] = r * 255;
				data[i + 1] = g * 255;
				data[i + 2] = 0;
				data[i + 3] = 255;
			}

			this.context.putImageData(new ImageData(data, w, h), 0, 0);
			this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
			this.feDisplacementMap.setAttribute('scale', (maxScale / this.canvasDPI).toString());
		}

		appendTo(parent: HTMLElement) {
			parent.appendChild(this.svg);
			parent.appendChild(this.container);
		}

		destroy() {
			this.svg.remove();
			this.container.remove();
			this.canvas.remove();
		}

		startUpdateLoop() {
			// Start continuous update loop
			const updateLoop = () => {
				this.updateShader();
				requestAnimationFrame(updateLoop);
			};
			updateLoop();
		}
	}

	function createLiquidGlass() {
		// Create shader
		const shader = new Shader({
			width: 300,
			height: 200,
			fragment: (uv: any, mouse: any) => {
				const ix = uv.x - 0.5;
				const iy = uv.y - 0.5;
				const distanceToEdge = roundedRectSDF(
					ix,
					iy,
					0.3,
					0.2,
					0.6
				);
				const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
				const scaled = smoothStep(0, 1, displacement);
				return texture(ix * scaled + 0.5, iy * scaled + 0.5);
			}
		});

		// Add to page
		shader.appendTo(document.body);
		
		return shader;
	}

	// Watch for changes in liquid_glass preference
	$effect(() => {
		if (preferences.liquid_glass) {
			if (!shader) {
				shader = createLiquidGlass();
			}
		} else {
			if (shader) {
				shader.destroy();
				shader = null;
			}
		}
	});

	onDestroy(() => {
		if (shader) {
			shader.destroy();
		}
	});
</script>

<!-- No visible elements needed since the effect is controlled by preferences --> 