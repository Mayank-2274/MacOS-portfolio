<script lang="ts">
	import Plus from '~icons/ic/outline-plus';
	import Equal from '~icons/ic/round-equals';
	import Minus from '~icons/ic/round-minus';
	import PlusMinus from '~icons/majesticons/plus-minus-2';
	import Division from '~icons/ph/divide-bold';
	import Multiply from '~icons/uil/multiply';

	// Calculator state
	let displayValue = '0';
	let previousValue: number | null = null;
	let operation: string | null = null;
	let waitingForOperand = false;

	// Handle number button clicks
	function handleNumberClick(num: string) {
		if (waitingForOperand) {
			displayValue = num;
			waitingForOperand = false;
		} else {
			displayValue = displayValue === '0' ? num : displayValue + num;
		}
	}

	// Handle decimal point
	function handleDecimalClick() {
		if (waitingForOperand) {
			displayValue = '0.';
			waitingForOperand = false;
		} else if (displayValue.indexOf('.') === -1) {
			displayValue += '.';
		}
	}

	// Handle operation buttons
	function handleOperationClick(op: string) {
		const inputValue = parseFloat(displayValue);

		if (previousValue === null) {
			previousValue = inputValue;
		} else if (operation) {
			const result = performCalculation(previousValue, inputValue, operation);
			displayValue = String(result);
			previousValue = result;
		}

		waitingForOperand = true;
		operation = op;
	}

	// Perform calculations
	function performCalculation(firstValue: number, secondValue: number, op: string): number {
		switch (op) {
			case '+':
				return firstValue + secondValue;
			case '-':
				return firstValue - secondValue;
			case '×':
				return firstValue * secondValue;
			case '÷':
				return firstValue / secondValue;
			case '%':
				return firstValue % secondValue;
			default:
				return secondValue;
		}
	}

	// Handle equals button
	function handleEqualsClick() {
		if (!operation || previousValue === null) return;

		const inputValue = parseFloat(displayValue);
		const result = performCalculation(previousValue, inputValue, operation);
		
		displayValue = String(result);
		previousValue = null;
		operation = null;
		waitingForOperand = true;
	}

	// Handle clear button
	function handleClearClick() {
		displayValue = '0';
		previousValue = null;
		operation = null;
		waitingForOperand = false;
	}

	// Handle plus/minus button
	function handlePlusMinusClick() {
		displayValue = String(-parseFloat(displayValue));
	}

	// Handle percentage button
	function handlePercentageClick() {
		const value = parseFloat(displayValue);
		displayValue = String(value / 100);
	}
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<section class="show-area">{displayValue}</section>

	<section class="buttons-container">
		<button class="top-row-button" on:click={handleClearClick}> AC </button>
		<button class="top-row-button" on:click={handlePlusMinusClick}>
			<PlusMinus />
		</button>
		<button class="top-row-button" on:click={handlePercentageClick}> % </button>
		<button class="operation-button" on:click={() => handleOperationClick('÷')}>
			<Division />
		</button>
		<button class="number-button" on:click={() => handleNumberClick('7')}> 7 </button>
		<button class="number-button" on:click={() => handleNumberClick('8')}> 8 </button>
		<button class="number-button" on:click={() => handleNumberClick('9')}> 9 </button>
		<button class="operation-button" on:click={() => handleOperationClick('×')}>
			<Multiply />
		</button>
		<button class="number-button" on:click={() => handleNumberClick('4')}> 4 </button>
		<button class="number-button" on:click={() => handleNumberClick('5')}> 5 </button>
		<button class="number-button" on:click={() => handleNumberClick('6')}> 6 </button>
		<button class="operation-button" on:click={() => handleOperationClick('-')}>
			<Minus />
		</button>
		<button class="number-button" on:click={() => handleNumberClick('1')}> 1 </button>
		<button class="number-button" on:click={() => handleNumberClick('2')}> 2 </button>
		<button class="number-button" on:click={() => handleNumberClick('3')}> 3 </button>
		<button class="operation-button" on:click={() => handleOperationClick('+')}> <Plus /> </button>
		<button class="number-button curved-bottom-left-button" style:grid-column="1 / span 2" on:click={() => handleNumberClick('0')}>
			0
		</button>
		<button class="number-button" on:click={handleDecimalClick}> . </button>
		<button class="operation-button curved-bottom-right-button" on:click={handleEqualsClick}> <Equal /> </button>
	</section>
</section>

<style>
	header {
		padding: 1rem;
	}

	.container {
		height: 100%;
		width: 100%;

		background-color: hsla(240, 5%, 12%, 0.7);
		backdrop-filter: blur(15px);

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto auto 1fr;

		font-family: var(--system-font-family) !important;
	}

	.buttons-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 1px;

		margin: 1.5px;

		& > button {
			font-size: 1.414rem;
			font-weight: 400 !important;
			color: white;
			fill: white;
		}

		:global(svg) {
			font-size: 1.2rem;
		}
	}

	.top-row-button {
		background-color: hsla(240, 5%, 12%, 0.2);
	}

	.number-button {
		background-color: hsla(240, 5%, 80%, 0.25);
	}

	.operation-button {
		background-color: hsl(37deg 98% 51%);
	}

	.curved-bottom-left-button {
		border-radius: 0 0 0 0.7rem;
	}

	.curved-bottom-right-button {
		border-radius: 0 0 0.7rem 0;
	}

	.show-area {
		font-size: 3rem;
		color: white;
		text-align: end;
		font-weight: 200;

		overflow: auto;

		padding: 0.5rem 1rem;
	}

	:global(.tl-container.calculator) {
		top: 0.7rem;
		left: 0.7rem;
	}
</style>
