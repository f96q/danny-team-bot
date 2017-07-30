'use strict';

class Adapter {
  send(channel, message, options) {

  }

  users(channel, callback) {
    callback(null, { memberIds: [], members: [] })
  }
}

module.exports = Adapter
