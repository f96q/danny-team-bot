'use strict';

const request = require('request')
const FeedParser = require('feedparser')
const Response = require('../robot/response')
const SEND_ITEM_SIZE = 5

const send = (items) => {
  const response = new Response(process.env.SCHEDULE_POST_CHANNEL)
  const attachments = items.slice(0, SEND_ITEM_SIZE - 1).map(item => {
    return {
      title: item.title,
      text: item.link
    }
  })
  response.send(null, {attachments: attachments})
}

const fetch = (url) => {
  const feedParser = new FeedParser
  const req = request(url)
  const items = []

  req.on('response', (response) => {
    if (response.statusCode != 200) {
      console.error(new Error(response.statusCode))
    } else {
      req.pipe(feedParser)
    }
  })

  feedParser.on('error', (error) => {
    console.error(error)
  })

  feedParser.on('readable', () => {
    let item = null
    while (item = feedParser.read()) {
      items.push(item)
    }
  })

  feedParser.on('end', () => {
    send(items)
  })
}

module.exports.rss = (event, context, callback) => {
  process.env.RSS_URLS.split(',').forEach(url => {
    fetch(url)
  })
}
