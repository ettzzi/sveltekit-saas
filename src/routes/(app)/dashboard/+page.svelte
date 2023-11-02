<script lang="ts">
	import Panel from '$lib/components/Panel.svelte';
	import type { PageParentData } from './$types';

	export let data: PageParentData;
</script>

<div class="container">
	<Panel>
		You're logged in as {data.user.email}
	</Panel>
</div>

<style>
	.container {
		margin: var(--s-4xl) auto;
	}
</style>
