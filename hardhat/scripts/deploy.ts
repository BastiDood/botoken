import { ethers } from 'hardhat';

async function main() {
    const contract = await ethers.deployContract('Botoken');
    const { target } = await contract.waitForDeployment();
    console.log(target);
}

main();
