import { BrowserProvider } from 'ethers';
import { assert } from '$lib/assert';
import { getContext, hasContext, setContext } from 'svelte';

const ETHEREUM = Symbol('eth');

function create() {
    return typeof ethereum === 'undefined' ? null : new BrowserProvider(ethereum);
}

type Provider = ReturnType<typeof create>;

export function init() {
    const provider = create();
    setContext(ETHEREUM, provider);
}

export function get() {
    assert(hasContext(ETHEREUM), 'provider not yet initialized');
    return getContext<Provider>(ETHEREUM);
}
