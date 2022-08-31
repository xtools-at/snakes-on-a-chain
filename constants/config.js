const config = {
  name: 'Snakes on a chain by DEPT®', // project name
  description: 'A research project by DEPT® for generating and running interactive NFTs.',
  nftName: 'Snake', // name for a single NFT (=> "Snake #42"), can be the same as the project name
  host: 'https://connectednft.art', // host URI
  externalUri: 'https://deptagency.com', // optional, link to project website
  royalty: {
    basisPoints: 200, // 100 points = 1%
    receiver: '0xbFb53a2c470cdb4FF32eE4F18A93B98F9f55D0E1', // ETH address
  },
}

export default config
