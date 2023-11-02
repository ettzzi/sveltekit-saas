<script lang="ts">
	export let title: string = '';
	export let level = 'h3';
</script>

<div>
	{#if title}<svelte:element this={level} class="title">{title}</svelte:element>{/if}
	<slot />
</div>

<style>
	.title {
		margin-bottom: var(--s-sm);
		font-size: var(--fs-2xl);
		font-weight: var(--fw-600);
	}

	div {
		display: block;
		border-radius: 24px;
		background-color: var(--color-light);
		padding: var(--s-lg);
	}
</style>
