<script lang="ts">
	import { enhance } from '$app/forms';
	import type { User } from 'lucia';

	import { createToast } from '$lib/components/Toast.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import Button from '$lib/components/Button.svelte';

	export let user: User;
</script>

<form
	class="flow"
	method="POST"
	action="?/update"
	use:enhance={() => {
		return async ({ update, result }) => {
			update({ reset: false });
			if (result.type === 'success') {
				createToast({
					title: 'Profile updated',
					description: 'Your profile has been updated',
					type: 'success'
				});
			}
		};
	}}
>
	<Textfield label="Email" fieldType="email" name="email" value={user.email} />

	<Textfield label="Name" fieldType="text" name="name" value={user.name} />

	<Button type="submit">Update profile</Button>
</form>
