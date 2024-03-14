<script lang="ts">
    import { Botoken__factory } from '../../../../hardhat/typechain-types';
    import Error from '$lib/alerts/Error.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import env from '$lib/env';
    import { get } from '$lib/provider';
    import { page } from '$app/stores';

    import CreatePoll from './CreatePoll.svelte';
    import GetPoll from './GetPoll.svelte';

    $: ({ hash } = $page.url);
    $: poll = hash.slice(1);

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
        {#if hash.length === 0}
            <CreatePoll {user} />
        {:else}
            <GetPoll {user} {poll} />
        {/if}
    {:catch err}
        <Error>{err}</Error>
    {/await}
{/if}
