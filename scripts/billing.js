'use strict';

const billing = require('../lib/billing')

module.exports = robot => {
  robot.hear(/billing/, 'billing - AWS billing', response => {
    billing((error, results) => {
      if (error) {
        console.error(error)
        return
      }
      if (results.length == 0) {
        response.send(__('schedules.billing.no_data_point'))
        return
      }
      const fields = results.filter(result => {
        return result.name != null
      }).map(result => {
        const datapoint = result.data['Datapoints'][0]
        return { title: result.name, value: `$${datapoint['Maximum']}`, short: true }
      })
      const datapoint = results[0].data['Datapoints'][0]
      response.send(__('schedules.billing.aws_billing', { value: `$${datapoint['Maximum']}` }), { attachments: [{ color: 'good', fields: fields }] })
    })
  })
}