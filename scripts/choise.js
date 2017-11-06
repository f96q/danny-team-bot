'use strict';

const Util = require('../util')

module.exports = robot => {
  robot.hear(/choise (.*)/, 'choise <a,b,c>', response => {
    const choises = response.match[1].split(',')
    const choise = Util.random(choises)
    response.send(__('scripts.choise.message', {choise: choise}))
  })
}
