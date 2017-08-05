'use strict';

const BRAIN_KEY_EVENT = require('../constants').BRAIN_KEY_EVENT

const WDAYS = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6
}

const WDAY_NAMES = Object.keys(WDAYS)

module.exports = robot => {
  robot.hear(/event list/, 'event list', response => {
    robot.brain.get(BRAIN_KEY_EVENT, (error, data) => {
      if (error) {
        console.error(error)
        return
      }
      const events = (data || []).sort((event1, event2) => {
        return event1.wday - event2.wday
      }).map(event => {
        return `${WDAY_NAMES[event.wday]}: ${event.title}`
      })
      if (events.length == 0) {
        response.send(__('shared.empty'))
      } else {
        response.send(events.join("\n"))
      }
    })
  })

  robot.hear(/event add (.*) (.*)/, 'event add <wday> <title>', response => {
    const wday = WDAYS[response.match[1]]
    const title = response.match[2]
    if (wday == null) {
      response.send(__('scripts.event.invalid_wday'))
      return
    }
    robot.brain.get(BRAIN_KEY_EVENT, (error, data) => {
      if (error) {
        console.error(error)
        return
      }
      const events = data || []
      const event = events.find(event => { return event.wday == wday && event.title == title })
      if (event) {
        response.send(__('shared.exist'))
        return
      }
      events.push({ wday: wday, title: title })
      robot.brain.set(BRAIN_KEY_EVENT, events, (error, data) => {
        if (error) {
          console.error(error)
          return
        }
        response.send(__('shared.added'))
      })
    })
  })

  robot.hear(/event remove (.*) (.*)/, 'event remove <wday> <title>', response => {
    const wday = WDAYS[response.match[1]]
    const title = response.match[2]
    if (wday == null) {
      response.send(__('scripts.event.invalid_wday'))
      return
    }
    robot.brain.get(BRAIN_KEY_EVENT, (error, data) => {
      if (error) {
        console.error(error)
        return
      }
      const events = (data || []).filter(event => { return event.wday == wday && event.title == title })
      robot.brain.set(BRAIN_KEY_EVENT, events, (error, data) => {
        if (error) {
          console.error(error)
          return
        }
        response.send(__('shared.removed'))
      })
    })
  })

  robot.hear(/event clear/, 'event clear', response => {
    robot.brain.set(BRAIN_KEY_EVENT, [], (error, data) => {
      if (error) {
        console.error(error)
        return
      }
      response.send(__('shared.clear'))
    })
  })
}
