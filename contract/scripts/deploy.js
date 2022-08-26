// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const numTokensToMint = 50;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Snake = await hre.ethers.getContractFactory("Snake");
  const snake = await Snake.connect(deployer).deploy();

  console.log("Contract address:", snake.address);

  await snake.deployed();

  const mintTx = await snake.mintMulti(deployer.address, numTokensToMint);
  const receipt = await mintTx.wait();

  console.log(`Minted ${numTokensToMint} tokens for ${deployer.address}, txHash: ${receipt.transactionHash}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
