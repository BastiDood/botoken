<script lang="ts">
    import type { Botoken } from '../../../../hardhat/typechain-types';
    import CastVote from './CastVote.svelte';
    import DisplayVote from './DisplayPoll.svelte';
    import ErrorAlert from '$lib/alerts/Error.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line init-declarations
    export let poll: string;
    // eslint-disable-next-line init-declarations
    export let user: Botoken;

    async function retrieve(address: string) {
        const [title, pot, balance] = await Promise.all([
            user.title(address),
            user.pot(address),
            user.balance(address),
        ]);
        return { title, pot, balance };
    }
</script>

<div class="space-y-4">
    {#await retrieve(poll)}
        <ProgressBar />
    {:then result}
        <DisplayVote {...result} />
    {:catch err}
        <ErrorAlert>{err}</ErrorAlert>
    {/await}
    <CastVote {poll} {user} />
</div>
