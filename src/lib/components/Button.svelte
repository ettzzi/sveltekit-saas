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
	<a {href}		class="btn"
	class:fullWidth
	class:btn-primary={variant === 'primary'}
	class:btn-secondary={variant === 'secondary'}
	class:btn-error={variant === 'danger'}
	class:btn-md={size === 'medium'}
	class:btn-sm={size === 'small'}
	class:btn-lg={size === 'large'}
	class:btn-outline={kind === 'outline'}><slot /></a>
{:else}
	<button
		on:click
		class="btn"
		class:fullWidth
		class:btn-primary={variant === 'primary'}
		class:btn-secondary={variant === 'secondary'}
		class:btn-error={variant === 'danger'}
		class:btn-md={size === 'medium'}
		class:btn-sm={size === 'small'}
		class:btn-lg={size === 'large'}
		class:btn-outline={kind === 'outline'}
		{type}
		{disabled}
		formaction={formAction}
	>
		<slot />
	</button>
{/if}


