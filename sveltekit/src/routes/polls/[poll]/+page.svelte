<script>
    import { Botoken__factory } from '../../../../../hardhat/typechain-types';
    import Error from '$lib/alerts/Error.svelte';
    import GetPoll from './GetPoll.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import { get } from '$lib/provider';

    // eslint-disable-next-line
    export let data;
    $: ({ poll } = data);

    const provider = get();
</script>

{#if provider === null}
    <Error>No provider available.</Error>
{:else}
    {#await provider.getSigner()}
        <ProgressBar />
    {:then { address }}
        {@const contract = Botoken__factory.connect(address, provider)}
        <GetPoll {poll} {contract} />
    {:catch err}
        <Error>{err}</Error>
    {/await}
{/if}
