<script>
    import { Botoken__factory } from '../../../../../hardhat/typechain-types';
    import Error from '$lib/alerts/Error.svelte';
    import GetPoll from './GetPoll.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import env from '$lib/env';
    import { get } from '$lib/provider';

    // eslint-disable-next-line
    export let data;
    $: ({ poll } = data);

    const provider = get();
</script>

{#if provider === null}
    <Error>No provider available.</Error>
{:else}
    {@const contract = Botoken__factory.connect(env.DEPLOYMENT_ADDRESS, provider)}
    {#await provider.getSigner()}
        <ProgressBar />
    {:then signer}
        {@const user = contract.connect(signer)}
        <GetPoll {user} {poll} />
    {:catch err}
        <Error>{err}</Error>
    {/await}
{/if}
