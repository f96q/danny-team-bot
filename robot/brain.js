'use strict'

const DocumentClient = require('./document_client')

class Brain {
  constructor() {
    this.tableName = process.env.BRAINS_TABLE
    this.client = new DocumentClient
  }

  set(key, value, callback) {
    const params = {
      TableName: this.tableName,
      Item: {key: key, value: JSON.stringify(value) }
    }
    this.client.put(params, callback)
  }

  get(key, callback) {
    const params = {
      TableName: this.tableName,
      Key: { key: key }
    }
    this.client.get(params, (error, data) => {
      if (error) {
        callback(error, null)
        return
      }
      if (data.Item) {
        callback(null, JSON.parse(data.Item.value))
      } else {
        callback(null, null)
      }
    })
  }

  remove(key, callback) {
    const params = {
      TableName: this.tableName,
      Key: { key: key }
    }
    this.client.delete(params, callback)
  }

  scan(callback) {
    const params = {
      TableName: this.tableName
    }
    this.client.scan(params, callback)
  }
}

module.exports = Brain
