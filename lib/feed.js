'use strict';

const request = require('request')
const FeedParser = require('feedparser')

module.exports.check = (url, callback) => {
  const feedParser = new FeedParser
  const req = request(url)
  req.on('response', (response) => {
    if (response.statusCode != 200) {
      callback(new Error(response.statusCode))
    } else {
      req.pipe(feedParser)
    }
  })

  feedParser.on('readable', () => {
    callback(null)
  })

  feedParser.on('error', (error) => {
    callback(error)
  })
}

module.exports.fetch = (url, callback) => {
  const feedParser = new FeedParser
  const req = request(url)
  const items = []

  req.on('response', (response) => {
    if (response.statusCode != 200) {
      callback(new Error(response.statusCode), null)
    } else {
      req.pipe(feedParser)
    }
  })

  feedParser.on('error', (error) => {
    callback(error, null)
  })

  feedParser.on('readable', () => {
    let item = null
    while (item = feedParser.read()) {
      items.push(item)
    }
  })

  feedParser.on('end', () => {
    callback(null, items)
  })
}

