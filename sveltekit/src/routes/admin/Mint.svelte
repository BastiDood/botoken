<script lang="ts">
    import type { Botoken } from '../../../../hardhat/typechain-types';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { InboxArrowDown } from '@steeze-ui/heroicons';
    import { assert } from '$lib/assert';
    import { createEventDispatcher } from 'svelte';
    import { getToastStore } from '@skeletonlabs/skeleton';
    import { isError } from 'ethers';

    // eslint-disable-next-line init-declarations
    export let user: Botoken;

    const toast = getToastStore();
    const dispatch = createEventDispatcher<{ done: number }>();

    async function submit(form: HTMLFormElement, button: HTMLElement | null) {
        assert(button !== null, 'empty button submitter');
        assert(button instanceof HTMLButtonElement, 'non-button submitter');

        const data = new FormData(form);
        const amount = data.get('amount') ?? '';
        assert(typeof amount === 'string', 'non-string amount encountered');
        assert(amount.length > 0, 'empty title encountered');
        const stake = parseInt(amount, 10);
        assert(stake > 0, 'non-positive amount');

        button.disabled = true;
        try {
            const tx = await user.mint(stake);
            const result = await tx.wait();
            assert(result !== null, 'transaction has not been mined');
            console.log(result);
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
                    message: '[UNSUPPORTED_OPERATION]: cannot execute the operation.',
                    background: 'variant-filled-error',
                    autohide: false,
                });
            throw err;
        } finally {
            // eslint-disable-next-line require-atomic-updates
            button.disabled = false;
        }

        toast.trigger({
            message: `Successfully minted ${stake} BTK into the contract residuals.`,
            background: 'variant-filled-success',
        });
        dispatch('done', stake);
    }
</script>

<form
    on:submit|self|preventDefault|stopPropagation={({ currentTarget, submitter }) => submit(currentTarget, submitter)}
    class="space-y-4"
>
    <label class="label flex items-center gap-2">
        <span>Amount</span>
        <input type="number" name="amount" placeholder="BTK" required min="1" class="input px-4 py-2" />
    </label>
    <button type="submit" name="mint" class="btn variant-filled-success w-full">
        <Icon src={InboxArrowDown} theme="mini" class="size-6" />
        <span>Mint</span>
    </button>
</form>
