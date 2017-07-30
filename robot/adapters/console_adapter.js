'use strict';

const Adapter = require('./adapter')

class ConsoleAdapter extends Adapter {
  send(channel, message, options) {
    if (message) {
      console.log(message)
    }
    if (options) {
      console.log(options)
    }
  }
}

module.exports = ConsoleAdapter
