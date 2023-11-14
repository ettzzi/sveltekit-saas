<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'danger';
	type Size = 'small' | 'large' | 'medium';
	type Kind = 'outline' | 'transparent' | 'solid';

	export let type: HTMLButtonAttributes['type'] = 'button';
	export let disabled = false;
	export let variant: Variant = 'primary';
	export let size: Size = 'medium';
	export let kind: Kind = 'solid';
	export let href: string | undefined = undefined;
	export let fullWidth: boolean = false;
	export let formAction: string | undefined = undefined;
</script>

{#if href}
	<a {href} class="{variant} {size} {kind}"><slot /></a>
{:else}
	<button
		on:click
		class="{variant} {size} {kind}"
		class:fullWidth
		{type}
		{disabled}
		formaction={formAction}
	>
		<slot />
	</button>
{/if}

<style>
	button,
	a {
		display: inline-block;
		text-align: center;
		cursor: pointer;
		text-decoration: none;
		word-wrap: break-word;
		box-shadow: none;
		border-style: solid;
		border-width: 2px;
	}

	button:disabled {
		cursor: not-allowed;
	}

	a:focus,
	button:focus {
		box-shadow: var(--color-yellow-500) 0px 0px 0px 4px inset;
		outline: transparent dotted 4px;
	}

	.small {
		font-size: var(--fs-sm);
		line-height: var(--line-height-md);
		padding: var(--s-sm) var(--s-md);
		border-radius: 24px;
	}

	.medium {
		font-size: var(--fs-md);
		line-height: var(--line-height-lg);
		padding: var(--s-sm) var(--s-xl);
		border-radius: 24px;
	}

	.primary {
		color: var(--color-white, #fff);
		background-color: var(--color-blue-500);
		border-color: var(--color-blue-500);
	}

	.primary:hover {
		color: var(--color-white, #fff);
		background-color: var(--color-blue-300);
		border-color: var(--color-blue-300);
	}

	.primary.outline {
		background-color: #fff;
		color: var(--color-blue-500);
		border-color: var(--color-blue-300);
	}

	.danger {
		color: var(--color-white, #fff);
		background-color: var(--color-red-500);
		border-color: var(--color-red-500);
	}

	.danger:hover {
		color: var(--color-white, #fff);
		background-color: var(--color-red-300);
		border-color: var(--color-red-300);
	}

	.fullWidth {
		width: 100%;
	}
</style>
