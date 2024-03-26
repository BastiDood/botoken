<script>
    import Error from '$lib/alerts/Error.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import { get } from '$lib/provider';
    const provider = get();
</script>

{#await provider?.send('eth_requestAccounts', [])}
    <ProgressBar />
{:then}
    <slot />
{:catch err}
    <Error>{err}</Error>
{/await}
