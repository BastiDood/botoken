import '@nomicfoundation/hardhat-toolbox';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

async function deployFixture() {
    const [owner, alice, bob, charlie] = await ethers.getSigners();
    const factory = await ethers.getContractFactory('Botoken');
    const Botoken = await factory.deploy(100);
    await Botoken.waitForDeployment();
    const botoken = await Botoken.getAddress();
    return { Botoken, botoken, alice, bob, charlie, owner };
}

describe('full election flow', () => {
    it('should deploy under the expected owner', async () => {
        const { Botoken, owner } = await loadFixture(deployFixture);
        expect(await Botoken.owner()).eq(owner.address);
    });

    it('should have the expected initial supply', async () => {
        const { Botoken } = await loadFixture(deployFixture);
        expect(await Botoken.totalSupply()).eq(100n);
    });

    it('should successfully complete a poll', async () => {
        const { Botoken, botoken, alice, bob, charlie, owner } = await loadFixture(deployFixture);
        const Alice = Botoken.connect(alice);
        const Bob = Botoken.connect(bob);
        const Charlie = Botoken.connect(charlie);
        const Owner = Botoken.connect(owner);

        // Allocate tokens to Alice
        await Botoken.releaseResidual(alice, 20);
        expect(await Botoken.balanceOf(botoken)).eq(80n);
        expect(await Botoken.balanceOf(alice)).eq(20n);

        // Allocate tokens to Bob
        await Botoken.releaseResidual(bob, 30);
        expect(await Botoken.balanceOf(botoken)).eq(50n);
        expect(await Botoken.balanceOf(bob)).eq(30n);

        // Allocate tokens to Charlie
        await Botoken.releaseResidual(charlie, 50);
        expect(await Botoken.balanceOf(botoken)).eq(0n);
        expect(await Botoken.balanceOf(charlie)).eq(50n);

        {
            // Alice creates the poll
            const result = await Alice.createPoll('Does this test pass?', 10n);
            expect(result).to.emit(Alice, 'Creation').withArgs([alice, 'Does this test pass?', 10n]);
            expect(await Botoken.balanceOf(botoken)).eq(10n);
            expect(await Botoken.balanceOf(alice)).eq(10n);
            expect(await Botoken.title(alice)).eq('Does this test pass?');
            expect(await Botoken.pot(alice)).eq(10n);
            expect(await Botoken.balance(alice)).eq(0n);
        }

        {
            // Bob votes on the poll positively
            const result = await Bob.voteOn(alice, 10n);
            expect(result).to.emit(Bob, 'Vote').withArgs([alice, bob, 10n]);
            expect(await Botoken.balanceOf(bob)).eq(20n);
            expect(await Botoken.pot(alice)).eq(20n);
            expect(await Botoken.balance(alice)).eq(10n);
        }

        {
            // Charlie votes on the poll negatively
            const result = await Charlie.voteOn(alice, -20n);
            expect(result).to.emit(Charlie, 'Vote').withArgs([alice, charlie, -20n]);
            expect(await Botoken.balanceOf(charlie)).eq(30n);
            expect(await Botoken.pot(alice)).eq(40n);
            expect(await Botoken.balance(alice)).eq(-10n);
        }

        {
            // Owner closes the poll
            const result = await Owner.closePoll(alice);
            expect(result).to.emit(Owner, 'Close').withArgs([alice, -10n]);
            expect(await Botoken.balanceOf(botoken)).eq(1n);
            expect(await Botoken.balanceOf(owner)).eq(0n);
            expect(await Botoken.balanceOf(alice)).eq(10n + 13n);
            expect(await Botoken.balanceOf(bob)).eq(20n + 13n);
            expect(await Botoken.balanceOf(charlie)).eq(30n + 13n);
        }
    });
});
