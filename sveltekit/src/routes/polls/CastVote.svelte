<script lang="ts">
    import { Bookmark, LockClosed } from '@steeze-ui/heroicons';
    import { EventLog, isError } from 'ethers';
    import type { Botoken } from '../../../../hardhat/typechain-types';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { assert } from '$lib/assert';
    import { createEventDispatcher } from 'svelte';
    import { getToastStore } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line init-declarations
    export let poll: string;
    // eslint-disable-next-line init-declarations
    export let user: Botoken;

    const toast = getToastStore();
    const dispatch = createEventDispatcher<{ vote: null; close: bigint }>();

    function isEvent(log: unknown): log is EventLog {
        return log instanceof EventLog;
    }

    async function submit(form: HTMLFormElement, button: HTMLElement | null) {
        assert(button !== null, 'empty button submitter');
        assert(button instanceof HTMLButtonElement, 'non-button submitter');

        const data = new FormData(form);
        const amount = data.get('amount') ?? '';
        assert(typeof amount === 'string', 'non-string input encountered');
        assert(amount.length > 0, 'empty title encountered');
        const stake = parseInt(amount, 10);

        button.disabled = true;
        try {
            const result = await user.voteOn(poll, stake);
            const receipt = await result.wait();
            assert(receipt !== null, 'transaction has not been minted');
            dispatch('vote');
        } catch (err) {
            if (isError(err, 'CALL_EXCEPTION') || isError(err, 'ACTION_REJECTED')) {
                const reason = err.reason ?? 'unknown reason';
                toast.trigger({
                    message: `[${err.code}]: ${reason}.`,
                    background: 'variant-filled-error',
                    autohide: false,
                });
            } else if (isError(err, 'INSUFFICIENT_FUNDS'))
                toast.trigger({
                    message: '[INSUFFICIENT_FUNDS]: not enough funds.',
                    background: 'variant-filled-error',
                    autohide: false,
                });
            else if (isError(err, 'UNSUPPORTED_OPERATION'))
                toast.trigger({
                    message: `[UNSUPPORTED_OPERATION]: cannot execute ${err.operation} (${err.shortMessage}).`,
                    background: 'variant-filled-error',
                    autohide: false,
                });
            throw err;
        } finally {
            // eslint-disable-next-line require-atomic-updates
            button.disabled = false;
        }
    }

    async function reset(form: HTMLFormElement) {
        const button = form.elements.namedItem('finalize');
        assert(button !== null, 'empty button submitter');
        assert(button instanceof HTMLButtonElement, 'non-button submitter');
        button.disabled = true;
        try {
            const result = await user.closePoll(poll);
            const receipt = await result.wait();
            assert(receipt !== null, 'transaction has not been minted');

            const event = receipt.logs.find(isEvent);
            assert(typeof event !== 'undefined', 'event log not found');

            const [_author, balance, ..._rest] = event.args;
            assert(typeof balance === 'bigint', 'non-integer balance when closing the poll');
            dispatch('close', balance);
        } catch (err) {
            if (isError(err, 'CALL_EXCEPTION') || isError(err, 'ACTION_REJECTED')) {
                const reason = err.reason ?? 'unknown reason';
                toast.trigger({
                    message: `[${err.code}]: ${reason}.`,
                    background: 'variant-filled-error',
                    autohide: false,
                });
            } else if (isError(err, 'INSUFFICIENT_FUNDS'))
                toast.trigger({
                    message: '[INSUFFICIENT_FUNDS]: not enough funds.',
                    background: 'variant-filled-error',
                    autohide: false,
                });
            else if (isError(err, 'UNSUPPORTED_OPERATION'))
                toast.trigger({
                    message: `[UNSUPPORTED_OPERATION]: cannot execute ${err.operation} (${err.shortMessage}).`,
                    background: 'variant-filled-error',
                    autohide: false,
                });
            throw err;
        } finally {
            button.disabled = false;
        }
    }
</script>

<form
    on:submit|self|preventDefault|stopPropagation={({ currentTarget, submitter }) => submit(currentTarget, submitter)}
    on:reset|self|preventDefault|stopPropagation={({ currentTarget }) => reset(currentTarget)}
    class="grid grid-cols-[auto_1fr] gap-x-4 space-y-4"
>
    <label class="label col-span-full grid grid-cols-subgrid items-center">
        <span>Amount</span>
        <input type="number" name="amount" placeholder="BTK" required class="input px-4 py-2" />
    </label>
    <button type="submit" name="vote" class="btn variant-filled-success col-span-full">
        <Icon src={Bookmark} theme="mini" class="size-6" />
        <span>Vote</span>
    </button>
    <button type="reset" name="finalize" class="btn variant-filled-error col-span-full">
        <Icon src={LockClosed} theme="mini" class="size-6" />
        <span>Finalize</span>
    </button>
</form>
