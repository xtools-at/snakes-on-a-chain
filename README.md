# Snakes on a chain
A research project for generating and running interactive NFTs. See it in action on [OpenSea](https://testnets.opensea.io/collection/snakes-on-a-chain-by-dept).

## What it does
- boilerplate for your interactive NFT project
- generates randomized metadata for NFT attributes
- generates static images of your interactive NFT
- provides metadata endpoints for NFTs and royalty information

## Quickstart
- run `yarn`
- update `src/config.js` with your own values
- add your own icons (`public/favicons.ico`, `public/img/icon.svg`, `public/img/icon.png`)
- add your NFT's attribute schema in `src/nftAttributes.js` (see comments in file)
- generate attribute metadata JSON (`yarn meta [from ID] [to ID]` or `yarn meta 2,4,8,16`)
  - review it and tweak it to your liking
  - rename the generated JSON file to `metadata.attributes.json`
- create your own dynamic content (access via `localhost:3000/token/1.html`)
  - update `src/app.template.html` to your liking
  - add your app's/content's code in `public/js/app.js`
  - add necessary styles in `public/css/style.css`
  - no external files allowed!
- when you're happy with the result, create static images of your finished content using `yarn images`
  - start server before doing so with `yarn dev`
- double-check the output of your metadata endpoints: `localhost:3000/token/1.json` and `localhost:3000/token/contract.json`
- deploy to any NodeJS host


## Smart contracts
- setup `.env` file with your wallet mnemonic (wallet must have funds to pay for gas)
- update strings in `contracts/NFT.sol` to match your token and host (-> name, symbol, baseURI)
- check `hardhat.config.js` for available network configurations
- deploy contract:
```
cd contract
yarn clean
yarn compile
yarn deploy [network name] # e.g. yarn deploy polygon
```
