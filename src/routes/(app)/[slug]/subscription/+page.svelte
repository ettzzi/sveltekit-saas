<script lang="ts">
	import { page } from '$app/stores';
	import { Check } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import type Stripe from 'stripe';
	import config from '$lib/config';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';

	$: slug = $page.data.team.id;
	$: user = $page.data.user;

	export let data: PageData;

	const formatPrice = (price: Stripe.Price) => {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: price.currency
		});

		if (!price.unit_amount) {
			return;
		}

		return formatter.format(price.unit_amount / 100);
	};

	$: prices = data.prices.map<Stripe.Price & { name?: string; description?: string }>((price) => {
		if (price.lookup_key)
			return {
				...price,
				...config.prices[price.lookup_key as keyof typeof config.prices]
			};

		return price;
	});

	export let form: ActionData;
	let selectedPriceId: string | null;

	onMount(() => {
		if (prices.length > 0) {
			selectedPriceId = prices[0].id;
		}
	});
</script>

<form action="?/createCheckoutSession" method="POST">
	<input type="hidden" name="teamId" value={slug} />
	<input type="hidden" name="email" value={user.email} />

	<div class="grid">
		{#each prices as price, i}
			<label>
				<div class="card" class:active={price.id === selectedPriceId}>
					<input
						type="radio"
						name="priceId"
						id={price.id}
						value={price.id}
						class="hidden"
						checked={i === 0}
						bind:group={selectedPriceId}
					/>
					<div class="selected">
						<Check color={'var(--color-gray-100)'} size={24} />
					</div>
					<p class="card-title">{price.name}</p>
					<p class="card-description">{price.description}</p>

					<p class="price">
						{formatPrice(price)}
					</p>
				</div>
			</label>
		{/each}
	</div>
	<div class="center">
		<Button type="submit">Continue</Button>
		{#if form?.message}
			<p>{form.message}</p>
		{/if}
	</div>
</form>

<style>
	input[type='radio']:checked ~ .selected {
		display: block;
	}

	.selected {
		display: none;
		position: absolute;
		top: -8px;
		right: -8px;
		z-index: 4;
		border-radius: 50%;
		background: var(--color-blue-500);
	}
	.center {
		padding: var(--s-lg);
		margin: 0 auto;
		text-align: center;
	}
	.card {
		position: relative;
		background-color: var(--color-gray-100);
		border-radius: var(--border-radius-8);
		border: 2px solid var(--color-gray-500);
		padding: var(--s-lg);
		flex-grow: 1;
		transition: all 0.2s ease-in;
	}

	.card:hover,
	.active {
		background-color: var(--color-blue-100);
		border-color: var(--color-blue-500);
	}

	.card-title {
		font-weight: var(--fw-700);
		font-size: var(--fs-xl);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--s-lg);
	}

	.price {
		font-size: var(--fs-4xl);
		font-weight: var(--fw-700);
	}
</style>
