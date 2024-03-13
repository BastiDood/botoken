<script lang="ts">
    import Error from '$lib/alerts/Error.svelte';
    import Page from './Loading.svelte';
    import { get } from '$lib/provider';
    const provider = get();
</script>

{#if provider === null}
    <Error>No provider available.</Error>
{:else}
    <Page {provider} />
{/if}
