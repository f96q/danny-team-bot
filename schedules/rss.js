'use strict';

require('../configure.js')

const Brain = require('../robot/brain')
const Response = require('../robot/response')
const Feed = require('../lib/feed')

const BRAIN_KEY_RSS = require('../constants').BRAIN_KEY_RSS
const RSS_FEED_ITEM_SIZE = require('../constants').RSS_FEED_ITEM_SIZE

const send = (items) => {
  const response = new Response(process.env.SCHEDULE_POST_CHANNEL)
  const attachments = items.slice(0, RSS_FEED_ITEM_SIZE - 1).map(item => {
    return {
      title: item.title,
      text: item.link
    }
  })
  response.send(null, {attachments: attachments})
}

module.exports.rss = (event, context, callback) => {
  const brain = new Brain
  brain.get(BRAIN_KEY_RSS, (error, data) => {
    if (error) {
      console.error(error)
      return
    }
    const feeds = data || []
    feeds.forEach(feed => {
      Feed.fetch(feed.url, (error, items) => {
        if (error) {
          console.error(error)
          return
        }
        send(items)
      })
    })
  })
}
