<script lang="ts">
    import { Bookmark } from '@steeze-ui/heroicons';
    import type { Botoken } from '../../../../hardhat/typechain-types';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { assert } from '$lib/assert';
    import { getToastStore } from '@skeletonlabs/skeleton';
    import { isError } from 'ethers';

    // eslint-disable-next-line init-declarations
    export let poll: string;
    // eslint-disable-next-line init-declarations
    export let user: Botoken;

    const toast = getToastStore();

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
</script>

<form
    on:submit|self|preventDefault|stopPropagation={({ currentTarget, submitter }) => submit(currentTarget, submitter)}
    class="grid grid-cols-[auto_1fr] gap-x-4 space-y-4"
>
    <label class="label col-span-full grid grid-cols-subgrid items-center">
        <span>Amount</span>
        <input type="number" name="amount" placeholder="BTK" required class="input px-4 py-2" />
    </label>
    <button type="submit" class="btn variant-filled-success col-span-full">
        <Icon src={Bookmark} theme="mini" class="size-6" />
        <span>Vote</span>
    </button>
</form>
