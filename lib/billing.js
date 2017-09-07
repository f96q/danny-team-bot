'use strict';

const AWS = require('aws-sdk')
const moment = require('moment')

const cloudwatch = new AWS.CloudWatch({
  region: 'us-east-1',
  endpoint: 'http://monitoring.us-east-1.amazonaws.com'
})

const listMetrics = () => {
  return new Promise((resolve, reject) => {
    cloudwatch.listMetrics({ MetricName: 'EstimatedCharges' }, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

const getMetricStatistics = (serviceName, startTime, endTime) => {
  const dimensions = [
    { Name: 'Currency', Value: 'USD' }
  ]
  if (serviceName) {
    dimensions.push({ Name: 'ServiceName', Value: serviceName })
  }
  return new Promise((resolve, reject) => {
    const params = {
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      Period: 86400,
      StartTime: startTime,
      EndTime: endTime,
      Statistics: ['Maximum'],
      Dimensions: dimensions
    }
    cloudwatch.getMetricStatistics(params, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve({ name: serviceName, data: data })
      }
    })
  })
}

module.exports = (callback) => {
  listMetrics().then(data => {
    const now = moment().toISOString()
    const yesterday = moment(now).subtract(1, 'd').toISOString()
    const promises = data['Metrics'].map(metric => {
      return metric['Dimensions'][0]
    }).filter(dimension => {
      return dimension['Name'] == 'ServiceName'
    }).map(dimension => {
      return dimension['Value']
    }).filter((serviceName, index, self) => {
      return self.indexOf(serviceName) === index
    }).map(serviceName => {
      return getMetricStatistics(serviceName, yesterday, now)
    })
    promises.unshift(getMetricStatistics(null, yesterday, now))
    Promise.all(promises).then(data => {
      const results = data.filter(result => {
        const datapoints = result.data['Datapoints']
        return (datapoints.length != 0 && datapoints[0]['Maximum'] != 0)
      })
      callback(null, results)
    }, reason => {
      callback(reason, null)
    })
  }, reason => {
    callback(reason, null)
  })
}
