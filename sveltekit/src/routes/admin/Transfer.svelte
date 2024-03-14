<script lang="ts" context="module">
    interface Payload {
        address: string;
        stake: number;
    }
</script>

<script lang="ts">
    import { ArrowRightStartOnRectangle } from '@steeze-ui/heroicons';
    import type { Botoken } from '../../../../hardhat/typechain-types';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { assert } from '$lib/assert';
    import { createEventDispatcher } from 'svelte';
    import { getToastStore } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line init-declarations
    export let user: Botoken;

    const toast = getToastStore();
    const pattern = '0x[0-9a-f]{40}';
    const dispatch = createEventDispatcher<{ done: Payload }>();

    async function submit(form: HTMLFormElement, button: HTMLElement | null) {
        assert(button !== null, 'empty button submitter');
        assert(button instanceof HTMLButtonElement, 'non-button submitter');

        const data = new FormData(form);

        const address = data.get('amount') ?? '';
        assert(typeof address === 'string', 'non-string address encountered');
        assert(address.length > 0, 'empty address encountered');

        const amount = data.get('amount') ?? '';
        assert(typeof amount === 'string', 'non-string amount encountered');
        assert(amount.length > 0, 'empty title encountered');
        const stake = parseInt(amount, 10);
        assert(stake > 0, 'non-positive amount');

        button.disabled = true;
        try {
            const tx = await user.releaseResidual(address, stake);
            const result = await tx.wait();
            assert(result !== null, 'transaction has not been mined');
            console.log(result);
        } catch (err) {
            if (err instanceof Error)
                toast.trigger({
                    message: `[${err.name}] ${err.message}`,
                    background: 'variant-filled-error',
                    autohide: false,
                });
            throw err;
        } finally {
            button.disabled = false;
        }

        toast.trigger({
            message: `Successfully extracted ${stake} BTK to ${address} from the contract residuals.`,
            background: 'variant-filled-success',
        });
        dispatch('done', { address, stake });
    }
</script>

<form
    on:submit|self|preventDefault|stopPropagation={({ currentTarget, submitter }) => submit(currentTarget, submitter)}
    class="space-y-4"
>
    <label class="label flex items-center gap-2">
        <span>Address</span>
        <input
            type="text"
            name="address"
            placeholder="0x0000000000000000000000000000000000000000"
            {pattern}
            required
            class="input px-4 py-2"
        />
    </label>
    <label class="label flex items-center gap-2">
        <span>Amount</span>
        <input type="number" name="amount" placeholder="BTK" required class="input px-4 py-2" />
    </label>
    <button type="submit" name="transfer" class="btn variant-filled-error w-full">
        <Icon src={ArrowRightStartOnRectangle} theme="mini" class="size-6" />
        <span>Transfer</span>
    </button>
</form>
