// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const numTokensToMint = 100;
const contractAddress = "0x1f419B9469D641D333805C4054CA3b65Af54d315";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const nft = await hre.ethers.getContractAt("NFT", contractAddress, deployer);
  console.log("Contract address:", nft.address);

  if (numTokensToMint > 0) {
    const mintTx = await nft.mintMulti(deployer.address, numTokensToMint);
    const receipt = await mintTx.wait();

    console.log(`Minted ${numTokensToMint} tokens for ${deployer.address}, txHash: ${receipt.transactionHash}`)
  }

  console.log("Contract call finished");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
