<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import type { LayoutServerData } from './$types';

	import Toast from '$lib/components/Toast.svelte';
	export let data: LayoutServerData;
</script>

<Toast />
<div>
	<Nav user={data.user} />
	<slot />
</div>

<style>
	div {
		min-height: 100vh;
		background-color: var(--color-gray-100);
	}
</style>
