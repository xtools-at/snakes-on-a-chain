import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import {
  getJsonAttributes,
  getContractMetadata,
  getNftMetadata,
  renderHtml,
} from './utils/serverUtils.js'
import cache from './utils/cacheMiddleware.js'
import config from './constants/config.js'

const port = parseInt(process.env.PORT, 10) || 3000
const server = express()

// remove powered-by
server.disable('x-powered-by')

// helmet
server.use(helmet({
  frameguard: false,
  contentSecurityPolicy: false,
  dnsPrefetchControl: false,
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
}))

// cors
server.use(cors({
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}))

// gzip
server.use(compression())

// ping
server.get('/ping', (req, res) => {
  return res.status(200).send('Pong!')
})

// redirect calls to homepage
if (config.externalUri) {
  server.get('/', (req, res) => {
    return res.redirect(config.externalUri)
  })
}

// contract metadata routes
server.get('/token/contract.json', cache(config.metadataCacheTtl), (req, res) => {
  return res.type('json').send(JSON.stringify(getContractMetadata(), null, 2))
})

server.get('/token/:id.json', cache(config.metadataCacheTtl), (req, res) => {
  const { id } = req.params
  if (!getJsonAttributes(id)) {
    return res.status(404).send('404 - Not found')
  }
  return res.type('json').send(JSON.stringify(getNftMetadata(id), null, 2))
})

//
server.get('/token/:id.html', cache(config.contentCacheTtl), (req, res) => {
  const { id } = req.params
  if (!getJsonAttributes(id)) {
    return res.status(404).send('404 - Not found')
  }
  return res.type('html').send(renderHtml(id))
})

// static files
server.use(express.static('public', {
  maxAge: 24 * 60 * 60 * 1000, // 24h
}))

// fallback route
server.all('*', (req, res) => {
  res.status(404).send('404 - Not found')
})

// start server
server.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})
