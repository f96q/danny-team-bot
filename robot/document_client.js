'use strict';

const AWS = require('aws-sdk')

class DocumentClient extends AWS.DynamoDB.DocumentClient {
  constructor() {
    if (process.env.IS_LOCAL == 'true') {
      const options = {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      }
      super(options)
    } else {
      super()
    }
  }
}

module.exports = DocumentClient
