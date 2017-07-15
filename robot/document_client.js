'use strict';

const AWS = require('aws-sdk')

class DocumentClient extends AWS.DynamoDB.DocumentClient {
  constructor() {
    if (process.env.DYNAMODB_ENDPINT) {
      const options = {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        region: 'localhost',
        endpoint: process.env.DYNAMODB_ENDPINT
      }
      super(options)
    } else {
      super()
    }
  }
}

module.exports = DocumentClient
