<script lang="ts">
    import type { Botoken } from '../../../../../../hardhat/typechain-types';
    import CastVote from './CastVote.svelte';
    import DisplayVote from './DisplayPoll.svelte';
    import ErrorAlert from '$lib/alerts/Error.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line init-declarations
    export let poll: string;
    // eslint-disable-next-line init-declarations
    export let user: Botoken;

    let display = Symbol();
</script>

{#key display}
    {#await user.asFinal(poll)}
        <ProgressBar />
    {:then { _title, _pot, _consensus }}
        <DisplayVote title={_title} pot={_pot} consensus={_consensus} />
    {:catch err}
        <ErrorAlert>{err}</ErrorAlert>
    {/await}
{/key}
<hr />
<CastVote {poll} {user} on:vote={() => (display = Symbol())} />
