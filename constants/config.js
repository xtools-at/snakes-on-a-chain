const config = {
  /** base info */
  name: 'Snakes on a chain by DEPT®', // project name
  description: 'A research project by DEPT® for generating and running interactive NFTs.',
  nftName: 'Snake', // name for a single NFT (=> "Snake #42"), can be the same as the project name
  host: 'https://connectednft.art', // host URI
  externalUri: 'https://deptagency.com', // optional, link to project website

  /** royalties */
  royalty: {
    basisPoints: 200, // 100 points = 1%
    receiver: '0xbFb53a2c470cdb4FF32eE4F18A93B98F9f55D0E1', // ETH address
  },

  /** caching */
  cache: process.env.NODE_ENV === 'production', // enabled only on production by default
  metadataCacheTtl: 2 * 60 * 60, // TTL in seconds
  contentCacheTtl: 60 * 60, // TTL in seconds
}

export default config
