import '@nomicfoundation/hardhat-toolbox';
import type { HardhatUserConfig, NetworksUserConfig } from 'hardhat/types';
import { config } from 'dotenv';

const { error } = config();
if (typeof error !== 'undefined') console.error(error);

const { ARBITRUM_RPC_URL, WALLET_PRV_KEY } = process.env;
const networks =
    typeof ARBITRUM_RPC_URL === 'undefined' || typeof WALLET_PRV_KEY === 'undefined'
        // eslint-disable-next-line no-undefined
        ? undefined
        : ({
              'arbitrum-sepolia': {
                  url: ARBITRUM_RPC_URL,
                  chainId: 421614,
                  accounts: [WALLET_PRV_KEY],
              },
          } satisfies NetworksUserConfig);

export default { solidity: '0.8.24', networks } satisfies HardhatUserConfig;
