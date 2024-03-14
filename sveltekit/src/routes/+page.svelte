<article class="prose dark:prose-invert max-w-none">
    <h1 id="welcome">Welcome to Botoken!</h1>
    <p>
        <strong>Botoken</strong> is a simple polling system for
        <dfn><abbr>decentralized autonomous organizations</abbr></dfn>
        (DAOs) by <a href="https://github.com/BastiDood" target="_blank">Basti Ortiz</a>. Botoken aims to create a
        polling system that fulfills the following goals:
    </p>
    <ul>
        <li>Voters must be incentivized to <em>vote</em>.</li>
        <li>Poll creators (called "proposers") must be incentivized to set forth new proposals.</li>
    </ul>
    <h2 id="setup">The Setup</h2>
    <p>
        Each Botoken system is composed of three users: The Botoken smart contract is an <a
            href="https://docs.openzeppelin.com/contracts/5.x/api/access#Ownable"
            target="_blank">ownable</a
        > ERC20 token, where the owner is the "administrator" or "arbiter" of polls.
    </p>
    <ul>
        <li>
            Each Botoken smart contract deployment is an <a
                href="https://docs.openzeppelin.com/contracts/5.x/api/access#Ownable"
                target="_blank">ownable</a
            >
            ERC20 token, where the <strong>Owner</strong> is the <em>only</em> "administrator" or "arbiter" of the
            polling system.
            <ul>
                <li>The Owner may <em>not</em> participate in or vote on any of the proposals.</li>
                <li>
                    The Owner <em>may</em> mint or inject new tokens into the system at no cost. The zero-cost minting is
                    meant to decouple the monetary value of Ethereum from the abstract value of voting power.
                </li>
                <li>
                    The Owner <em>may</em> transfer tokens from the contract deployment's "residuals" into another
                    account. More on this in the next section on <a href="#incentive">incentives</a>.
                </li>
                <li>
                    A fundamental assumption behind the integrity of the system is the fact that the Owner is a trusted
                    disinterested third party with the sole permission to <em>finalize</em> and <em>close</em> polls via
                    timers, cron jobs, etc.
                </li>
            </ul>
        </li>
        <li>
            The rest of the network are called <strong>Users</strong>.
            <ul>
                <li>
                    Unlike the Owner, a User <em>may</em> <u>create new proposals</u> (called
                    <strong>Proposers</strong>). Proposers are <em>not</em> allowed to vote on their own polls.
                </li>
                <li>
                    Unlike the Owner, a User <em>may</em> <u>vote on existing polls</u> (called
                    <strong>Voters</strong>). In other words, the Voter is the lifeblood of the system.
                </li>
            </ul>
        </li>
    </ul>
    <h2 id="incentive">The Incentive</h2>
    <p>
        The Botoken token is called a <strong>botoken (BTK)</strong>. In this polling system, the BTK is analogous to
        <strong>voting power</strong>. Voting in polls involves staking tokens.
    </p>
    <ol>
        <li>
            To emphasize the Owner being a disinterested third party, the Owner <em>may not</em> earn from the system. They
            stand with nothing to gain and nothing to lose.
        </li>
        <li>
            To create a new proposal, a Proposer must first stake a user-volunteered amount of BTK. It is up to the
            Owner to decide what to do with the created poll given greater stakes. For example, the Owner may opt to
            keep the poll validity time directly proportional to the amount of BTK staked. That is to say, greater
            stakes inform the Owner to finalize and close polls later. With longer poll validity times being a premium
            (due to the potential for greater exposure to more Users), this is the typical setup.
        </li>
        <li>
            Similarly, all Users must stake a user-volunteered amount of BTK as "voting power" on a poll. Since the
            polls are typically formulated as "yes" or "no" questions, the result of the poll is internally stored as a
            signed integer, where a positive value means "yes" while a negative value means "no". A User may therefore
            opt to (positively or negatively) stake more BTK based on the current state of a poll.
        </li>
        <li>
            At the end of every poll (i.e., when the Owner decides to finalize and close the poll), the total staked BTK
            throughout the entire lifetime of the poll is redistributed <em>evenly</em> among the author and all
            respondents. Any remainder tokens are transferred into the contract as <strong>residuals</strong>.
            <ul>
                <li>
                    The Proposer is therefore incentivized to encourage voters to participate in the poll. To begin
                    with, the Proposer is also incentivized to make the proposal a compelling question to attract more
                    voters.
                </li>
                <li>
                    Meanwhile, Voters have the freedom to participate and exercise their voting power however they see
                    fit. This may mean abstaining from polls to "save up on voting power" for other polls in the future.
                </li>
                <li>
                    The Owner may then choose to reintroduce residuals into the system by transferring the tokens to a
                    specific user. This is, of course, completely <em>optional</em>.
                </li>
            </ul>
        </li>
        <li>
            Over time, the Owner may choose to mint and inject new tokens into the system at any time should the need
            arise to combat token scarcity.
        </li>
    </ol>
</article>
