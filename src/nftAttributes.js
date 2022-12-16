/**
 * Add your NFT attribute schema here!
 * Set the `value` of any attribute to an array of possible values to be used with
 * the `yarn meta` command, to generate new random instances instantly.
 * Setting it to anything else creates a static attribute with that value.
 *
 * See also https://docs.opensea.io/docs/metadata-standards
 */

const nftAttributes = [
  {
    trait_type: 'Snake Color',
    value: [
      'YellowGreen',
      'SpringGreen',
      'Turquoise',
      'Teal',
      'SeaGreen',
      'PaleGreen',
      'Olive',
      'OliveDrab',
      'LimeGreen',
      'LightGreen',
      'LawnGreen',
      'Green',
      'GreenYellow',
      'MediumAquaMarine',
    ],
  },
  {
    trait_type: 'Background Color',
    value: [
      'SlateGrey',
      'Snow',
      'Silver',
      'SeaShell',
      'AliceBlue',
      'Azure',
      'Cornsilk',
      'DarkGrey',
      'DimGrey',
      'Gainsboro',
      'Grey',
      'Lavender',
      'LightGrey',
      'MintCream',
      'WhiteSmoke',
      'PeachPuff',
      'Black',
      'LightSlateGrey',
    ],
  },
  {
    trait_type: 'Food Color',
    value: [
      'Tomato',
      'SteelBlue',
      'SkyBlue',
      'Purple',
      'Orchid',
      'Navy',
      'RoyalBlue',
      'Magenta',
      'Salmon',
      'CornflowerBlue',
      'Coral',
      'Crimson',
      'GoldenRod',
      'HotPink',
      'Orange',
      'OrangeRed',
      'RebeccaPurple',
    ],
  },
  {
    trait_type: 'Game Difficulty',
    value: [30, 20, 10, -10, -20, -30],
    display_type: 'boost_percentage',
  },
  {
    trait_type: 'Series',
    value: 2,
    display_type: 'number',
    max_value: 2,
  },
]

export default nftAttributes
