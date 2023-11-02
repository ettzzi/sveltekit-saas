<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import Button from '$lib/components/Button.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Textfield from '$lib/components/Textfield.svelte';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

{#if form?.message}
	<Alert title="An error has occurred">
		<p>{form.message}</p>
	</Alert>
{/if}

<Panel title="Set a new password">
	<form class="flow" method="post" use:enhance>
		<Textfield name="password" required label="Password" fieldType="password" />

		<Button type="submit">Save</Button>
	</form>
</Panel>
