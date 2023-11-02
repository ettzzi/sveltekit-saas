<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<Panel title={form?.success ? 'Check your email' : 'Forgot your password?'}>
	{#if form?.success}
		<p>
			If a user exists with the given e-mail, they will receive an email with a link to reset their
			password.
		</p>
	{:else}
		<p>
			No problem. Just let us know your email address and we will email you a password reset link
			that will allow you to choose a new one.
		</p>

		<form method="POST" class="flow" use:enhance>
			<Textfield name="email" label="Email" required />

			<Button type="submit">Request password reset</Button>
		</form>
	{/if}
</Panel>
