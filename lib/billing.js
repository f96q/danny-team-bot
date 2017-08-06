'use strict';

const AWS = require('aws-sdk')
const moment = require('moment')

module.exports = (callback) => {
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
      callback(error, null)
      return
    }
    const dataPoints = data['Datapoints']
    if (dataPoints.length == 0) {
      callback(null, null)
      return
    }
    const dataPoint = dataPoints[dataPoints.length - 1]
    callback(null, dataPoint)
  })
}
