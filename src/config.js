const config = {
  /** base info */
  name: 'Snakes on a chain by DEPT®', // project name
  description: 'A research project by DEPT® for generating and running interactive NFTs.',
  nftName: 'Snake', // name for a single NFT (=> "Snake #42"), can be the same as the project name
  host: 'https://snakes.connectednft.art', // host URI
  externalUri: 'https://deptagency.com', // optional, link to project website
  // the number of NFTs to mint initially when the contract is deployed.
  nftsToMint: 1000,

  /** royalties */
  royalty: {
    basisPoints: 200, // 100 points = 1%. Must be >= 0.
    receiver: '0xbFb53a2c470cdb4FF32eE4F18A93B98F9f55D0E1', // ETH address
  },

  /** caching */
  cache: process.env.NODE_ENV === 'production', // enabled only on production by default
  metadataCacheTtl: 2 * 60 * 60, // TTL in seconds
  contentCacheTtl: 60 * 60, // TTL in seconds

  /** static image generation */
  screenshotSize: 512, // in px
  // wait time before creating static image from dynamic content.
  // setting this too low may result in blank images, keep >= 25ms at least.
  waitBeforeScreenshot: 1000, // in ms
}

export default config
