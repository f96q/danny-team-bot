'use strict';

const Response = require('./response')
const Command = require('./command')
const Brain = require('./brain')

class Robot {
  constructor() {
    this.commands = []
    this.brain = new Brain
  }

  hear(regexp, help, callback) {
    this.commands.push(new Command(regexp, help, callback))
  }

  call(channelId, userName, message) {
    const called = this.commands.map(command => {
      return command.call(channelId, userName, message)
    }).find(results => { return results })
    if (!called) {
      const response = new Response(channelId, userName, null)
      response.send('NOP')
    }
  }
}

module.exports = Robot
