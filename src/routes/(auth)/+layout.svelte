<script>
	import Logo from '$lib/components/Logo.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>

<div class="auth">
	<slot />
</div>

<style>
	.auth {
		max-width: 30rem;
		margin: 0 auto;
		padding: var(--s-4xl) var(--s-xl);
	}
</style>
