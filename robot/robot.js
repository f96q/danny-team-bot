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
    this.commands.forEach((command) => {
      command.call(message, response)
    })
  }
}

module.exports = Robot
