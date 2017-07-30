'use strict';

const Brain = require('../robot/brain')
const Response = require('../robot/response')
const BRAIN_KEY_EVENT = require('../constants').BRAIN_KEY_EVENT

module.exports.event = (event, context, callback) => {
  const brain = new Brain
  brain.get(BRAIN_KEY_EVENT, (error, data) => {
    const wday = (new Date).getDay()
    const events = (data || []).filter(event => { return events.wday != wday }).map(event => { return event.title })
    const response = new Response(process.env.SCHEDULE_POST_CHANNEL)
    response.send(events.join("\n"))
  })
}
