<script lang="ts">
	import Panel from '$lib/components/Panel.svelte';
	import { page } from '$app/stores';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Panel>
	You're logged in as {data.user.email}
	<br />
	You can manage your members on the
	<a href="/{$page.params.slug}/settings/members">members page</a>
</Panel>
