<script lang="ts">
	import { error } from '@sveltejs/kit';

	type InputType = 'text' | 'email' | 'password';
	export let name: string;

	export let label: string;
	export let placeholder: string = '';
	export let readonly: boolean = false;
	export let disabled: boolean = false;
	export let fieldType: InputType = 'text';
	export let value: string = '';
	export let required = false;
	export let autocomplete: string = 'off';
	export let errors: string[] = [];
</script>

<div>
	<label for={name}>{label}</label>

	<input
		aria-invalid={errors.length > 0}
		type={fieldType}
		{readonly}
		{name}
		id={name}
		{placeholder}
		{disabled}
		{required}
		{value}
		{autocomplete}
	/>

	{#each errors as error}
		<p class="error">{error}</p>
	{/each}
</div>

<style>
	label {
		display: block;
		font-size: var(--fs-sm);
		font-weight: var(--fw-400);
		color: var(--color-gray-600);
	}

	input {
		display: block;
		width: 100%;
		margin-top: 4px;
		background: white;
		border: 2px solid var(--color-gray-400);
		font-size: var(--font-md);
		line-height: var(--lh-lg);
		padding: var(--s-xs) var(--s-sm);
		border-radius: 8px;
	}

	input:focus {
		outline: 0;
		border-color: var(--color-blue-500);
	}

	input[readonly],
	input[readonly]:focus {
		border: 2px solid var(--color-gray-800);
		background: var(--color-gray-100);
	}

	input[disabled] {
		cursor: not-allowed;
	}

	.error {
		font-size: var(--fs-sm);
		color: var(--color-error-500);
	}
</style>
