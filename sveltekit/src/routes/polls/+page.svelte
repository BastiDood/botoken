<script lang="ts">
    import { Botoken__factory } from '../../../../hardhat/typechain-types';
    import Error from '$lib/alerts/Error.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import env from '$lib/env';
    import { get } from '$lib/provider';
    import { page } from '$app/stores';

    import CreatePoll from './CreatePoll.svelte';
    import GetPoll from './GetPoll.svelte';
    import RecentPolls from './RecentPolls.svelte';

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
        <div class="space-y-4">
            {#if hash.length === 0}
                <h1 class="h1">Create a New Poll</h1>
                <CreatePoll {user} />
                {#await provider.getBlockNumber()}
                    <ProgressBar />
                {:then block}
                    <hr />
                    <RecentPolls {user} {block} />
                {:catch err}
                    <Error>{err}</Error>
                {/await}
            {:else}
                {#await provider.getBlockNumber()}
                    <ProgressBar />
                {:then block}
                    <GetPoll {user} {poll} {block} />
                {:catch err}
                    <Error>{err}</Error>
                {/await}
            {/if}
        </div>
    {:catch err}
        <Error>{err}</Error>
    {/await}
{/if}
