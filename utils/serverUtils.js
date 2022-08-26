import fs from 'fs'
import path from 'path'
import config from '../constants/config.js'

let appHtml;
let jsonAttributes;

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
    external_uri: config.externalUri || null,
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

  const attributes = getJsonAttributes(id);

  let gameParams = null;
  if (attributes) {
    gameParams = {}
    attributes.forEach((entry) => {
      if (entry.trait_type === 'Snake Color') gameParams.snakeColor = entry.value;
      else if (entry.trait_type === 'Background Color') gameParams.backgroundColor = entry.value;
      else if (entry.trait_type === 'Food Color') gameParams.foodColor = entry.value;
      else if (entry.trait_type === 'Game Difficulty') gameParams.speed = entry.value;
    })
  }

  const replacements = [
    {
      key: /%%TITLE%%/g,
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
      value: JSON.stringify(gameParams, null, 2),
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

  return html;
}
