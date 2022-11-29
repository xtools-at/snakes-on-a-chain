// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const config = require("../../src/config");

const numTokensToMint = config.nftsToMint || 50;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.connect(deployer).deploy();

  console.log("Contract address:", nft.address);

  await nft.deployed();

  if (numTokensToMint > 0) {
    const mintTx = await nft.mintMulti(deployer.address, numTokensToMint);
    const receipt = await mintTx.wait();

    console.log(`Minted ${numTokensToMint} tokens for ${deployer.address}, txHash: ${receipt.transactionHash}`)
  }

  console.log("Contract deployment finished");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
