'use strict';

const BRAIN_KEY_RSS = require('../constants').BRAIN_KEY_RSS
const RSS_FEED_ITEM_SIZE = require('../constants').RSS_FEED_ITEM_SIZE

const Feed = require('../lib/feed')

module.exports = robot => {
  robot.hear(/rss list/, 'rss list', response => {
    robot.brain.get(BRAIN_KEY_RSS, (error, data) => {
      if (error) {
        console.error(error)
        return
      }
      const feeds = data || []
      if (feeds.length == 0) {
        response.send(__('shared.empty'))
      } else {
        response.send(feeds.map(feed => { return feed.url }).join("\n"))
      }
    })
  })

  robot.hear(/rss fetch/, 'rss fetch', response => {
    robot.brain.get(BRAIN_KEY_RSS, (error, data) => {
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
          const attachments = items.slice(0, RSS_FEED_ITEM_SIZE - 1).map(item => {
            return {
              title: item.title,
              text: item.link
            }
          })
          response.send(null, {attachments: attachments})
        })
      })
    })
  })

  robot.hear(/rss add <(.*)>/, 'rss add <url>', response => {
    const url = response.match[1]
    robot.brain.get(BRAIN_KEY_RSS, (error, data) => {
      if (error) {
        response.send(__('shared.not_add'))
        return
      }
      const feeds = data || []
      const feed = feeds.find(feed => { return feed.url == url })
      if (feed) {
        response.send(__('shared.exist'))
        return
      }
      Feed.check(url, error => {
        if (error) {
          response.send(__('shared.not_add'))
          return
        }
        feeds.push({ url: url })
        robot.brain.set(BRAIN_KEY_RSS, feeds, (error, data) => {
          if (error) {
            console.error(error)
            return
          }
          response.send(__('shared.added'))
        })
      })
    })
  })

  robot.hear(/rss remove <(.*)>/, 'rss remove <url>', response => {
    const url = response.match[1]
    robot.brain.get(BRAIN_KEY_RSS, (error, data) => {
      if (error) {
        console.error(error)
        return
      }
      const feeds = (data || []).filter(feed => { return feed.url != url })
      robot.brain.set(BRAIN_KEY_RSS, feeds, (error, data) => {
        if (error) {
          console.error(error)
          return
        }
        response.send(__('shared.removed'))
      })
    })
  })
}
