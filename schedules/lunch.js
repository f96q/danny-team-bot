'use strict';

const Response = require('../robot/response')

module.exports.lunch = (event, context, callback) => {
  const response = new Response(process.env.SCHEDULE_POST_CHANNEL)
  response.send('ランチにしましょう')
}
