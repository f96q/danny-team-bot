'use strict';

const request = require('request')
const FeedParser = require('feedparser')
const BRAIN_KEY_RSS = require('../constants').BRAIN_KEY_RSS

const checkFeed = (url, callback) => {
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
      checkFeed(url, error => {
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
