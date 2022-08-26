# Snakes on a chain
A research project for generating and running interactive NFTs.

## What it does
- boilerplate for your interactive NFT project
- generates randomized metadata for NFT attributes
- generates static images of your interactive NFT
- provides metadata endpoints for NFTs and royalty information

## Quickstart
- run `yarn`
- update `constants/config.js` with your own values
- add your own icons (`favicons.ico`, `public/img/icon.svg`, `public/img/icon.png`)
- add your NFT's attribute schema in `constants/nftAttributes.js` (see comments in file)
- generate attribute metadata JSON (`yarn meta [from ID] [to ID]`)
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
