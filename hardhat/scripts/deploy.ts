import { ethers } from 'hardhat';

async function main() {
    const contract = await ethers.deployContract('Dao');
    const { target } = await contract.waitForDeployment();
    console.log(target);
}

main();
