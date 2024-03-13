<script lang="ts">
    import { PlusCircle, XCircle } from '@steeze-ui/heroicons';
    import { EventLog, isAddress } from 'ethers';
    import type { Botoken } from '../../../hardhat/typechain-types';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { assert } from '$lib/assert';
    import { goto } from '$app/navigation';

    // eslint-disable-next-line init-declarations
    export let contract: Botoken;

    function isEvent(log: unknown): log is EventLog {
        return log instanceof EventLog;
    }

    async function submit(form: HTMLFormElement, button: HTMLElement | null) {
        assert(button !== null, 'empty button submitter');
        assert(button instanceof HTMLButtonElement, 'non-button submitter');

        const data = new FormData(form);
        const title = data.get('title') ?? '';
        assert(typeof title === 'string', 'non-string input encountered');
        assert(title.length > 0, 'empty title encountered');

        const amount = data.get('amount') ?? '';
        assert(typeof amount === 'string', 'non-string input encountered');
        assert(amount.length > 0, 'empty title encountered');
        const stake = parseInt(amount, 10);

        button.disabled = true;
        try {
            const result = await contract.createPoll(title, stake);
            const receipt = await result.wait();
            assert(receipt !== null, 'transaction has not been minted');

            const event = receipt.logs.find(isEvent);
            assert(typeof event !== 'undefined', 'event log not found');

            const address = event.args[0];
            assert(isAddress(address), 'non-address event argument for poll creation');
            await goto(`/poll/${address}`);
        } finally {
            button.disabled = false;
        }
    }
</script>

<div class="space-y-4">
    <form
        on:submit|self|preventDefault|stopPropagation={({ currentTarget, submitter }) =>
            submit(currentTarget, submitter)}
        class="grid grid-cols-[auto_1fr] gap-x-4 space-y-4"
    >
        <label class="label col-span-full grid grid-cols-subgrid items-center">
            <span>Title</span>
            <input type="text" name="title" placeholder="Should we create a poll?" required class="input px-4 py-2" />
        </label>
        <label class="label col-span-full grid grid-cols-subgrid items-center">
            <span>Amount</span>
            <input type="number" name="amount" placeholder="BTK" required class="input px-4 py-2" />
        </label>
        <button type="submit" class="btn variant-filled-success col-span-full">
            <Icon src={PlusCircle} theme="mini" class="size-6" />
            <span>Create Poll</span>
        </button>
    </form>
    <button type="button" class="btn variant-filled-error w-full" on:click>
        <Icon src={XCircle} theme="mini" class="size-6" />
        <span>Disconnect</span>
    </button>
</div>
