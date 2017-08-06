'use strict';

require('../configure.js')

const billing = require('../lib/billing')
const Response = require('../robot/response')

module.exports.billing = (event, context, callback) => {
  billing((error, dataPoint) => {
    if (error) {
      console.error(error)
      return
    }
    const response = new Response(process.env.SCHEDULE_POST_CHANNEL)
    if (dataPoint == null) {
      response.send(__('schedules.billing.no_data_point'))
      return
    }
    const attachments = [
      {
        title: __('schedules.billing.aws_billing'),
        text: `$${dataPoint['Maximum']}`
      }
    ]
    response.send(null, {attachments: attachments})
  })
}
