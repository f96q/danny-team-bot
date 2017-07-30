'use strict';

const Adapter = require('./adapter')

class Response {
  constructor(channel, userName, match) {
    this.adapter = new Adapter
    this.channel = channel
    this.userName = userName
    this.match = match
  }

  send(message, options) {
    this.postMessage(message, options)
  }

  reply(message, options) {
    this.postMessage(`<@${this.userName}>${message}`, options)
  }

  postMessage(message, options) {
    this.adapter.send(this.channel, message, options)
  }

  random(items) {
    return items[Math.floor(Math.random() * items.length)]
  }

  randomChannelUser(callback) {
    this.adapter.users(this.channel, (error, response) => {
      if (error) {
        callback(error, null)
        return
      }
      const memberId = this.random(response.memberIds.filter(memberId => { return memberId != process.env.BOT_ID }))
      const member = response.members.find(member => { return member.id == memberId })
      callback(null, member)
    })
  }
}

module.exports = Response
