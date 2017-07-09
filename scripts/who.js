module.exports = robot => {
  robot.hear(/誰か|だれか/, '誰か - Replay with random channel user', response => {
    response.randomChannelUser((error, user) => {
      response.send(`<@${user.name}>の出番`)
    })
  })
}
