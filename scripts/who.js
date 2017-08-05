module.exports = robot => {
  robot.hear(/who/, 'who - Replay with random channel user', response => {
    response.randomChannelUser((error, user) => {
      if (user) {
        response.send(__('scripts.who.message', {name: user.name}))
      }
    })
  })
}
