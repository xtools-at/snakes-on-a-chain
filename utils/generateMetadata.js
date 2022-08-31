/* eslint-disable no-param-reassign */
import fs from 'fs'
import path from 'path'
import nftAttributes from '../constants/nftAttributes.js'

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

const generateAttributes = (from, to) => {
  console.log(`generating ${to - from} metadata entries...`)

  const data = {}
  // generate data
  for (let i = from; i <= to; i++) {
    data[i] = []

    nftAttributes.forEach((entry) => {
      let { value } = entry
      if (value && Array.isArray(value)) {
        // randomize value
        const randomIndex = getRandomInt(0, value.length)
        value = entry.value[randomIndex]
      }

      data[i].push({
        ...entry,
        value,
      })
    })
  }

  // store data
  const filePath = path.join(path.resolve(), 'src', 'metadata.attributes.generated.json')
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
  )

  console.log(`successfully generated ${to - from} metadata entries.`)
}

generateAttributes(
  (process.argv && process.argv.length > 2 && process.argv[2]) || 0,
  (process.argv && process.argv.length > 3 && process.argv[3]) || 49,
)
