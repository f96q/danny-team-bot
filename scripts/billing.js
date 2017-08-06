'use strict';

const billing = require('../lib/billing')

module.exports = robot => {
  robot.hear(/billing/, 'billing - AWS billing', response => {
    billing((error, dataPoint) => {
      if (error) {
        console.error(error)
        return
      }
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
  })
}
