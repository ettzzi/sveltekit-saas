<script lang="ts">
	export let type = 'error';
	export let title = 'An error occurred';
	export let titleElement = 'h2';
</script>

<div class="alert {type}" role="alert" autofocus tabindex="-1">
	<svelte:element this={titleElement} class="alert-title">{title}</svelte:element>
	<slot />
</div>

<style>
	.alert {
		border-radius: var(--border-radius-16);
		padding: var(--s-md);
		color: var(--on-error);
	}

	.warning {
		background-color: var(--color-warning-900);
	}
	.error {
		background-color: var(--color-error-900);
	}

	.alert-title {
		font-size: var(--fs-xl);
		line-height: var(--lh-sm);
		margin-bottom: var(--s-sm);
	}
</style>
