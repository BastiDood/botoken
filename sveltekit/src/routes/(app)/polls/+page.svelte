<script lang="ts">
    import { Botoken__factory } from '../../../../../hardhat/typechain-types';
    import Error from '$lib/alerts/Error.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import env from '$lib/env';
    import { get } from '$lib/provider';

    import CreatePoll from './CreatePoll.svelte';
    import RecentPolls from './RecentPolls.svelte';

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
            <h1 class="h1">Create a New Poll</h1>
            <CreatePoll {user} />
            <hr />
            <RecentPolls {user} />
        </div>
    {:catch err}
        <Error>{err}</Error>
    {/await}
{/if}
