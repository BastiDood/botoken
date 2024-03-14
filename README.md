# Botoken

[Botoken](https://botoken.pages.dev/) is a simple [Arbitrum]-based polling system for decentralized autonomous organizations (DAOs) by [Basti Ortiz](https://github.com/BastiDood). Botoken aims to create a polling system that fulfills the following goals:

[Arbitrum]: https://arbitrum.io/

-   Voters must be incentivized to vote.
-   Poll creators (called "proposers") must be incentivized to set forth new proposals.

## The Setup

Each Botoken system is composed of three users: The Botoken smart contract is an [ownable] ERC20 token, where the owner is the "administrator" or "arbiter" of polls.

-   Each Botoken smart contract deployment is an ownable ERC20 token, where the Owner is the only "administrator" or "arbiter" of the polling system.
    -   The Owner may not participate in or vote on any of the proposals.
    -   The Owner may mint or inject new tokens into the system at no cost. The zero-cost minting is meant to decouple the monetary value of Ethereum from the abstract value of voting power.
    -   The Owner may transfer tokens from the contract deployment's "residuals" into another account. More on this in the next section on [incentives](#the-incentive).
    -   A fundamental assumption behind the integrity of the system is the fact that the Owner is a trusted disinterested third party with the sole permission to finalize and close polls via timers, cron jobs, etc.
-   The rest of the network are called Users.
    -   Unlike the Owner, a User may create new proposals (called Proposers). Proposers are not allowed to vote on their own polls.
    -   Unlike the Owner, a User may vote on existing polls (called Voters). In other words, the Voter is the lifeblood of the system.

[ownable]: https://docs.openzeppelin.com/contracts/5.x/api/access#Ownable

## The Incentive

The Botoken token is called a botoken (BTK). In this polling system, the BTK is analogous to voting power. Voting in polls involves staking tokens.

1. To emphasize the Owner being a disinterested third party, the Owner may not earn from the system. They stand with nothing to gain and nothing to lose.
1. To create a new proposal, a Proposer must first stake a user-volunteered amount of BTK. It is up to the Owner to decide what to do with the created poll given greater stakes. For example, the Owner may opt to keep the poll validity time directly proportional to the amount of BTK staked. That is to say, greater stakes inform the Owner to finalize and close polls later. With longer poll validity times being a premium (due to the potential for greater exposure to more Users), this is the typical setup.
1. Similarly, all Users must stake a user-volunteered amount of BTK as "voting power" on a poll. Since the polls are typically formulated as "yes" or "no" questions, the result of the poll is internally stored as a signed integer, where a positive value means "yes" while a negative value means "no". A User may therefore opt to (positively or negatively) stake more BTK based on the current state of a poll.
1. At the end of every poll (i.e., when the Owner decides to finalize and close the poll), the total staked BTK throughout the entire lifetime of the poll is redistributed evenly among the author and all respondents. Any remainder tokens are transferred into the contract as residuals.
    - The Proposer is therefore incentivized to encourage voters to participate in the poll. To begin with, the Proposer is also incentivized to make the proposal a compelling question to attract more voters.
    - Meanwhile, Voters have the freedom to participate and exercise their voting power however they see fit. This may mean abstaining from polls to "save up on voting power" for other polls in the future.
1. The Owner may then choose to reintroduce residuals into the system by transferring the tokens to a specific user. This is, of course, completely optional.
   Over time, the Owner may choose to mint and inject new tokens into the system at any time should the need arise to combat token scarcity.

# Development

> [!IMPORTANT]
> Botoken uses [pnpm] (via [Corepack] for [Node.js]) as its package and workspace manager.

[Corepack]: https://github.com/nodejs/corepack
[Node.js]: https://nodejs.org/

For smart contract development with [Solidity], Botoken uses [Hardhat] to streamline the deployment process.

[Solidity]: https://soliditylang.org/
[Hardhat]: https://hardhat.org/

For the user interface, Botoken uses the [SvelteKit] framwork for full-stack web development with JavaScript. To add a cherry on top, Botoken features an installable [progressive web application][pwa].

[SvelteKit]: https://kit.svelte.dev/
[pwa]: https://web.dev/explore/progressive-web-apps
[pnpm]: https://pnpm.io/

## Formatters

```bash
# Check for formatting errors
pnpm fmt

# Apply suggestions from formatter
pnpm fmt:fix
```

## Linters

```bash
# ESLint
pnpm lint:js

# LintHTML
pnpm --filter=botoken-sveltekit lint:html

# Stylelint
pnpm --filter=botoken-sveltekit lint:css

# Svelte Check
pnpm --filter=botoken-sveltekit lint:svelte
```

## Contract Deployment

| **Environment Variable** | **Description**                                                                 |
| ------------------------ | ------------------------------------------------------------------------------- |
| `WALLET_PUB_KEY`         | The public key of the Ethereum wallet for which the contract will be deployed.  |
| `WALLET_PRV_KEY`         | The private key of the Ethereum wallet for which the contract will be deployed. |
| `ARBITRUM_RPC_URL`       | The JSON RPC API endpoint for Arbitrum Sepolia interactions.                    |
| `ETHERSCAN_API_KEY`      | [Etherscan] API key (primarily used for deployment verification).               |

[Etherscan]: https://etherscan.io/

```bash
# Compile the contract and its TypeScript types
pnpm --filter=botoken-hardhat compile

# Run unit tests
pnpm --filter=botoken-hardhat test

# Deploy the contract to the Arbitrum Sepolia testnet
pnpm --filter=botoken-hardhat deploy:arb
```

## User Interface

| **Environment Variable**    | **Description**                               |
| --------------------------- | --------------------------------------------- |
| `PUBLIC_DEPLOYMENT_ADDRESS` | The address of the smart contract deployment. |

```bash
# Generate SvelteKit's TypeScript types
pnpm --filter=botoken-sveltekit sync

# Start the dev server (with hot module replacement)
pnpm --filter=botoken-sveltekit dev

# Build the optimized version of the app
pnpm --filter=botoken-sveltekit build

# Host the application locally as if it were in production
pnpm --filter=botoken-sveltekit preview
```
