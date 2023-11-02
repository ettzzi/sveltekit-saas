<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<div>
	<Nav user={data.user} />
	<slot />
</div>
<Toast />

<style>
	div {
		min-height: 100vh;
		background-color: var(--color-gray-100);
	}
</style>
