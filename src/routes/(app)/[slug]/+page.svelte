<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import { Trash, User } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Panel from '$lib/components/Panel.svelte';
	export let data: PageData;
</script>

<div class="flow">
	<Panel title="Members">
		<Loader promise={data.streamed.teamRoles} let:value>
			{#each value as member}
				<div class="member">
					{member.user.email} - {member.role}

					{#if member.user.id !== data.user.userId && value.find((m) => m.user_id === data.user.userId)?.role === 'ADMIN'}
						<form method="POST" use:enhance>
							<input type="text" hidden name="userId" value={member.user.id} />

							<Button type="submit" size="small" variant="danger" formAction="?/deleteUser">
								<Trash size={14} /></Button
							>
						</form>
					{/if}
				</div>
			{/each}
		</Loader>
	</Panel>

	<Panel title="Invites">
		<form action="?/inviteUser" method="post" class="flow" use:enhance>
			<Textfield label="Email" fieldType="email" name="email" />
			<Button type="submit">Invite</Button>
		</form>
	</Panel>

	<Loader promise={data.streamed.teamRoles} let:value showLoader={false}>
		{#if value.find((m) => m.user_id === data.user.userId)?.role === 'ADMIN'}
			<Panel title="Danger zone">
				<form method="POST" use:enhance>
					<Button type="submit" formAction="?/deleteTeam" variant="danger">Delete team</Button>
				</form>
			</Panel>
		{/if}
	</Loader>
</div>

<style>
	.member {
		display: flex;
		flex-grow: 1;
		flex-shrink: 1;
		flex-basis: auto;
		flex-direction: row;
		-webkit-box-align: center;
		align-items: center;
		row-gap: 16px;
		column-gap: 16px;
	}
</style>
