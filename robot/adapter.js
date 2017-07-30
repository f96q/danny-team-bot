'use strict';

const SlackAdapter = require('./adapters/slack_adapter')
const ConsoleAdapter = require('./adapters/console_adapter')

const getAdapter = () => {
  switch (process.env.ADAPTER) {
    case 'slack':
      return SlackAdapter
    case 'console':
      return ConsoleAdapter
    default:
      throw new Error('not set env ADAPTER')
  }
}

module.exports = getAdapter()
