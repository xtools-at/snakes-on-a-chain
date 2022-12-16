import fs from 'fs'
import path from 'path'
import config from './config.js'

let appHtml
let jsonAttributes

export const getJsonAttributes = (id) => {
  if (!jsonAttributes) {
    const filePath = path.join(path.resolve(), 'src', 'metadata.attributes.json')
    if (fs.existsSync(filePath)) {
      try {
        jsonAttributes = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      } catch (e) {
        console.error('error parsing json attributes file', e)
        return null
      }
    } else {
      console.error('generate metadata attribute json file first')
      return null
    }
  }

  return id ? jsonAttributes[id] : jsonAttributes
}

export const getNftMetadata = (id) => {
  return {
    id,
    name: `${config.nftName} #${id}`,
    description: config.description,
    image: `${config.host}/img/nfts/${id}.png`,
    animation_url: `${config.host}/token/${id}.html`,
    external_url: `${config.host}/token/${id}.html`,
    attributes: getJsonAttributes(id) || [],
  }
}

export const getContractMetadata = (attributeOverrides) => {
  return {
    name: config.name,
    description: config.description,
    image: `${config.host}/img/logo512.png`,
    external_link: config.externalUri || null,
    seller_fee_basis_points: config.royalty.basisPoints,
    fee_recipient: config.royalty.receiver,
    ...(attributeOverrides || {}),
  }
}

export const renderHtml = (id) => {
  if (!appHtml) {
    const filePath = path.join(path.resolve(), 'src', 'app.template.html')
    if (fs.existsSync(filePath)) {
      appHtml = fs.readFileSync(filePath, 'utf8')
    } else {
      return ''
    }
  }

  // transform token attribute metadata to params for our game-script
  const attributes = getJsonAttributes(id)
  let gameParams
  const paramTransformationRules = {
    'Snake Color': 'snakeColor',
    'Background Color': 'backgroundColor',
    'Food Color': 'foodColor',
    'Game Difficulty': 'speed',
  }

  if (attributes) {
    gameParams = {}
    attributes.forEach((entry) => {
      const paramName = paramTransformationRules[entry.trait_type]
      if (paramName) {
        gameParams[paramName] = entry.value
      }
    })
  }

  // replace placeholders in the html template
  const replacements = [
    {
      key: /%%NAME%%/g,
      value: config.name,
    },
    {
      key: /%%ID%%/g,
      value: id,
    },
    {
      key: /%%NFT_NAME%%/g,
      value: config.nftName,
    },
    {
      key: /%%DESCRIPTION%%/g,
      value: config.description,
    },
    {
      key: /%%PARAMS%%/,
      value: JSON.stringify(gameParams),
    },
    {
      key: /%%HOST%%/g,
      value: config.host,
    },
  ]

  let html = appHtml
  replacements.forEach((rule) => {
    html = html.replace(rule.key, rule.value)
  })

  return html
}
