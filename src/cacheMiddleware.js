import memoryCache from 'memory-cache'
import config from './config.js'

const cache = (durationInSeconds) => (req, res, next) => {
  // check if enabled
  if (config.cache !== true) return next()

  // sanitize input
  const duration = durationInSeconds != null ? durationInSeconds : 60
  if (duration < 1) return next()

  // add headers for browser caching
  try {
    res.append('Cache-Control', `max-age=${duration - 1}`)
  } catch (e) { /**/ }

  // try finding cache entry
  const key = `__express__${req.originalUrl}` || req.url
  const cachedBody = memoryCache.get(key)
  if (cachedBody) {
    return res.send(cachedBody)
  }

  // cache response if no entry found
  res.sendResponse = res.send
  res.send = (body) => {
    memoryCache.put(key, body, duration * 1000)
    res.sendResponse(body)
  }

  return next()
}

export default cache
