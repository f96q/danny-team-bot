'use strict';

const WebClient = require('@slack/client').WebClient

class Response {
  constructor(channel, userName) {
    this.web = new WebClient(process.env.SLACK_API_TOKEN)
    this.channel = channel
    this.userName = userName
  }

  send(message) {
    this.postMessage(message)
  }

  reply(message) {
    this.postMessage(`<@${this.userName}>${message}`)
  }

  postMessage(message) {
    this.web.chat.postMessage(this.channel, message, (error, response) => {
      if (error) { console.log(error); }
    })
  }

  random(items) {
    return items[Math.floor(Math.random() * items.length)]
  }

  randomChannelUser(callback) {
    const random = this.random
    const web = this.web
    web.channels.info(this.channel, (error, response) => {
      if (error) {
        callback(error, null)
        return
      }
      const memberIds = response.channel.members
      web.users.list((error, response) => {
        const memberId = random(memberIds.filter(memberId => { return memberId != process.env.BOT_ID }))
        const member = response.members.find(member => { return member.id == memberId })
        callback(null, member)
      })
    })
  }
}

module.exports = Response
