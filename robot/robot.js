'use strict';

const Command = require('./command')

class Robot {
  constructor() {
    this.commands = []
  }

  hear(regexp, help, callback) {
    this.commands.push(new Command(regexp, help, callback))
  }

  call(message, response) {
    const called = this.commands.map(command => {
      return command.call(message, response)
    }).find(results => { return results })
    if (!called) {
      response.send('NOP')
    }
  }
}

module.exports = Robot
