import '@nomicfoundation/hardhat-toolbox';
import type { HardhatUserConfig } from 'hardhat/types';
import { config } from 'dotenv';

function assert(condition: unknown, msg = 'assertion error'): asserts condition {
    if (!condition) throw new Error(msg);
}

const { error, parsed } = config();
if (typeof error !== 'undefined') throw error;
assert(typeof parsed !== 'undefined', 'no environment variables');

const { ARBITRUM_RPC_URL, WALLET_PUB_KEY, WALLET_PRV_KEY, ETHERSCAN_API_KEY } = parsed;
assert(ARBITRUM_RPC_URL, 'no Arbitrum RPC URL provided');
assert(ETHERSCAN_API_KEY, 'empty API key for Etherscan');
assert(WALLET_PUB_KEY, 'empty public key for the wallet');
assert(WALLET_PRV_KEY, 'empty private key for the wallet');

export default {
    solidity: '0.8.24',
    networks: {
        'arbitrum-sepolia': {
            url: ARBITRUM_RPC_URL,
            chainId: 421614,
            accounts: [WALLET_PRV_KEY],
        },
    },
    sourcify: { enabled: true },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        customChains: [
            {
                network: 'arbsep',
                chainId: 421614,
                urls: {
                    apiURL: 'https://api-sepolia.arbiscan.io/api',
                    browserURL: 'https://sepolia.arbiscan.io/',
                },
            },
        ],
    },
} satisfies HardhatUserConfig;
