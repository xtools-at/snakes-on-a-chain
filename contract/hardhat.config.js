require("@nomicfoundation/hardhat-toolbox");
const path = require("path");
const dotenvConfig = require("dotenv").config;

// Ensure that we have all the environment variables we need.
dotenvConfig({ path: path.join(path.resolve(), "./.env") });
const mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}
const accounts = {
  count: 10,
  mnemonic,
  path: "m/44'/60'/0'/0",
};

// networks
const networks = {
  /** local */
  hardhat: {
    allowUnlimitedContractSize: false,
    accounts,
  },
  localhost: {
    url: "http://localhost:8545",
    accounts,
  },

  /** public testnets */
  rinkeby: { // eth testnet (deprecated)
    chainId: 4,
    url: "https://rpc.ankr.com/eth_rinkeby",
    accounts,
  },
  goerli: { // eth testnet
    chainId: 5,
    url: "https://rpc.ankr.com/eth_goerli",
    accounts,
  },
  mumbai: { // polygon testnet
    chainId: 80001,
    url: "https://rpc.ankr.com/polygon_mumbai",
    accounts,
  },
  fuji: { // avalanche testnet
    chainId: 43113,
    url: "https://rpc.ankr.com/avalanche_fuji",
    accounts,
  },
  chapel: { // bsc testnet
    chainId: 97,
    url: "https://rpc.ankr.com/bsc_testnet_chapel",
    accounts,
  },
  'beam-testnet': {
    url: `https://subnets.avax.network/beam/testnet/rpc`,
    chainId: 13337,
    accounts,
  },

  /** public mainnets */
  ethereum: {
    chainId: 1,
    url: "https://rpc.ankr.com/eth",
    accounts,
  },
  polygon: {
    chainId: 137,
    url: "https://rpc.ankr.com/polygon",
    accounts,
  },
  avalanche: {
    chainId: 43114,
    url: "https://rpc.ankr.com/avalanche",
    accounts,
  },
  bsc: {
    chainId: 56,
    url: "https://rpc.ankr.com/bsc",
    accounts,
  },
  beam: {
    url: `https://subnets.avax.network/beam/mainnet/rpc`,
    chainId: 4337,
    accounts,
  },
};


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  settings: {
    metadata: {
      bytecodeHash: "none",
    },
    optimizer: {
      enabled: true,
      runs: 1000
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  defaultNetwork: "hardhat",
  networks,
};
