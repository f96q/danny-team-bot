'use strict';

const Adapter = require('./adapter')
const WebClient = require('@slack/client').WebClient

class SlackAdapter extends Adapter {
  constructor() {
    super()
    if (!process.env.SLACK_API_TOKEN) {
      throw new Error('not set env SLACK_API_TOKEN')
    }
    this.client = new WebClient(process.env.SLACK_API_TOKEN)
  }

  send(channel, message, options) {
    this.client.chat.postMessage(channel, message, options, (error, response) => {
      if (error) { console.error(error) }
    })
  }

  users(channel, callback) {
    const client = this.client
    client.channels.info(channel, (error, response) => {
      if (error) {
        callback(error, null)
        return
      }
      const memberIds = response.channel.members
      client.users.list((error, response) => {
        if (error) {
          callback(error, null)
          return
        }
        callback(null, { memberIds: memberIds, members: response.members })
      })
    })
  }
}

module.exports = SlackAdapter
