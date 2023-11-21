<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import { Trash } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import Panel from '$lib/components/Panel.svelte';
	import { createToast } from '$lib/components/Toast.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Alert from '$lib/components/Alert.svelte';
	import { goto } from '$app/navigation';
	import { SubscriptionStatus } from '@prisma/client';
	export let data: PageData;

	export let form: ActionData;

	const deleteTeam: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				createToast({
					title: 'Team deleted',
					description: 'Your team has been deleted.',
					type: 'success'
				});
				goto('/');
			}
		};
	};

	const inviteUser: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				createToast({
					title: 'Invite sent',
					description: 'Your invite has been sent.',
					type: 'success'
				});
			}
		};
	};
</script>

{#if form?.message}
	<Alert title="An error occurred">
		<p>{form?.message}</p>
	</Alert>
{/if}

<div class="flow">
	<Panel title="Members">
		<Loader promise={data.streamed.teamRoles} let:value>
			{#each value as member}
				<div class="member">
					{member.user.email} - {member.role}

					{#if member.user.id !== data.user.userId && value.find((m) => m.user_id === data.user.userId)?.role === 'ADMIN'}
						<form method="POST" use:enhance={inviteUser}>
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
		<Loader promise={data.streamed.invite} let:value>
			{#each value as invite}
				<div class="member">
					{invite.email} - {invite.role}
				</div>
			{/each}
		</Loader>
	</Panel>

	<Panel title="Invite a user">
		<form action="?/inviteUser" method="post" class="flow" use:enhance>
			<Textfield label="Email" fieldType="email" name="email" />
			<Button type="submit">Invite</Button>
		</form>
	</Panel>

	<Panel title="Subscription">
		{#if !data.team.subscription_active}
			You need to <a href={`/${data.team.slug}/subscription`}>subscribe</a> to access the app >
		{:else}
			<form action="?/createPortal" method="post" class="flow">
				<input type="hidden" name="customer_id" value={data.team.customer_id} />
				<Button type="submit">Manage subscription</Button>
			</form>
		{/if}
	</Panel>

	<Loader promise={data.streamed.teamRoles} let:value showLoader={false}>
		{#if value.find((m) => m.user_id === data.user.userId)?.role === 'ADMIN'}
			<Panel title="Danger zone">
				<form method="POST" use:enhance={deleteTeam}>
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
