'use strict';

require('./configure.js')

const pathResolve = require('path').resolve
const querystring = require('querystring')
const fs = require('fs')

const Robot = require('./robot/robot')

module.exports.robot = (event, context, callback) => {
  const robot = new Robot

  const path = pathResolve('.', 'scripts')
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(name => {
      require(`${path}/${name}`)(robot)
    })
  }

  const body = querystring.parse(event.body)
  const channelId = body.channel_id
  const userName = body.user_name
  const message = body.text

  robot.call(channelId, userName, message)
}
