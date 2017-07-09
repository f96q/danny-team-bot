'use strict';

class Command {
  constructor(regexp, help, callback) {
    this.regexp = regexp
    this.help = help
    this.callback = callback
  }

  call(message, response) {
    if (message.match(this.regexp)) {
      this.callback(response)
    }
  }
}

module.exports = Command
