module.exports = robot => {
  robot.hear(/ping/i, 'ping - Replay with pong', response => {
    response.send('PONG')
  })
}
