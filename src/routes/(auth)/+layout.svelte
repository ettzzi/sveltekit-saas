<script>
	import Logo from '$lib/components/Logo.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>

<div class="page">
	<Nav />

	<div class="auth">
		<slot />
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background-color: var(--color-gray-100);
	}

	.auth {
		max-width: 30rem;
		margin: 0 auto;
		padding: var(--s-4xl) var(--s-xl);
	}
</style>
