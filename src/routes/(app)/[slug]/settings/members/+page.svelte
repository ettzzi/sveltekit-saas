<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import PanelLoader from '$lib/components/PanelLoader.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import { Trash } from 'lucide-svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flow">
	<PanelLoader promise={data.streamed.members} title="Members" let:value>
		<p>Manage who has access to this team</p>

		{#each value as member}
			<div class="member">
				{member.user.email}
				{#await data.streamed.role then roleValue}
					{#if roleValue?.role === 'ADMIN'}
						<form method="POST" use:enhance>
							<input type="text" hidden name="userId" value={member.user.id} />
							<Button type="submit" size="small" variant="danger" formAction="?/deleteUser">
								<Trash size={14} /></Button
							>
						</form>
					{/if}
				{/await}
			</div>
		{/each}
	</PanelLoader>

	<PanelLoader promise={data.streamed.team} title="Invites" let:value>
		<form action="?/inviteUser" method="post" class="flow" use:enhance>
			<Textfield label="Email" fieldType="email" name="email" />
			<input type="text" hidden name="teamId" value={value?.id} />
			<Button type="submit">Invite</Button>
		</form>
	</PanelLoader>
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
