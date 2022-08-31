// eslint-disable-next-line import/no-extraneous-dependencies
import puppeteer from 'puppeteer'
import { getJsonAttributes } from './serverUtils.js'

const timeoutAfterLoad = 700

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

puppeteer
  .launch({
    headless: true,
    defaultViewport: {
      width: 512,
      height: 512,
    },
  })
  .then(async (browser) => {
    const page = await browser.newPage()
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()))

    const attributes = getJsonAttributes()

    let tokenIds = []
    if (process.argv && process.argv.length > 2) {
      if (process.argv.length > 3) {
        let i = parseInt(process.argv[2], 10)
        const max = parseInt(process.argv[3], 10)
        for (i; i <= max; i++) {
          tokenIds.push(i)
        }
      } else {
        tokenIds = [process.argv[2]]
      }
    } else {
      tokenIds = Object.keys(attributes)
    }

    console.log(`generating ${tokenIds.length} screenshots...`)

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < tokenIds.length; i++) {
      const id = tokenIds[i]
      await page.goto(`http://localhost:3000/token/${id}.html?imageMode=true`)
      await wait(timeoutAfterLoad)
      await page.screenshot({ path: `./public/img/nfts/${id}.png` })
    }
    /* eslint-enable no-await-in-loop */

    await browser.close()

    console.log(`successfully generated ${tokenIds.length} screenshots.`)
  })
