'use strict';

const AWS = require('aws-sdk')
const moment = require('moment')
const Response = require('../robot/response')

module.exports.billing = (event, context, callback) => {
  const options = {
    region: 'us-east-1',
    endpoint: 'http://monitoring.us-east-1.amazonaws.com'
  }
  const cloudWatch = new AWS.CloudWatch(options)
  const now = moment()
  const yesterday = moment(now).subtract(1, 'd')
  const params = {
    MetricName: 'EstimatedCharges',
    Namespace: 'AWS/Billing',
    Period: 86400,
    StartTime: yesterday.toISOString(),
    EndTime: now.toISOString(),
    Statistics: ['Maximum'],
    Dimensions: [
      {
        Name: 'Currency',
        Value: 'USD'
      }
    ]
  }
  cloudWatch.getMetricStatistics(params, (error, data) => {
    if (error) {
      console.error(error)
      return
    }
    const response = new Response(process.env.SCHEDULE_POST_CHANNEL)
    const dataPoints = data['Datapoints']
    if (dataPoints.length == 0) {
      response.send('データーが取れないよ')
      return
    }
    const letestDataPoint = dataPoints[dataPoints.length - 1]
    const attachments = [
      {
        title: 'AWS利用料',
        text: `$${letestDataPoint['Maximum']}`
      }
    ]
    response.send(null, {attachments: attachments})
  })
}
