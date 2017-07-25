'use strict';

const Response = require('./response')

class Command {
  constructor(regexp, help, callback) {
    this.regexp = regexp
    this.help = help
    this.callback = callback
  }

  call(channelId, userName, message) {
    const match = message.match(this.regexp)
    if (match) {
      this.callback(new Response(channelId, userName, match))
      return true
    }
    return false
  }
}

module.exports = Command
