'use strict';

require('../configure.js')

const request = require('request')
const moment = require('moment')
const Response = require('../robot/response')
const SEND_ITEM_SIZE = 5

const filter = items => {
  const now = moment()
  return items.filter(item => { return moment.unix(item.dt).isAfter(now) })
}

module.exports.weather = (event, context, callback) => {
  const query = {
    q: 'tokyo,jp',
    APPID:  process.env.OPEN_WEATHER_MAP_API_KEY,
    units: 'metric'
  }
  request({url: 'http://api.openweathermap.org/data/2.5/forecast', qs: query, json: true}, (error, httpResponse, body) => {
    if (error) {
      console.error(error)
      return
    }
    const attachments = filter(body.list).slice(0, SEND_ITEM_SIZE - 1).map(item => {
      return {
        thumb_url: `http://openweathermap.org/img/w/${item.weather[0].icon}.png`,
        title: moment.unix(item.dt).format('HH:mm'),
        text: `${item.main.temp_max}℃`
      }
    })
    const response = new Response(process.env.SCHEDULE_POST_CHANNEL)
    response.send(__('schedules.weather.message', {name: body.city.name}), {attachments: attachments})
  })
}
