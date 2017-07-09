module.exports = robot => {
  robot.hear(/help/i, null, response => {
    let helps = []
    robot.commands.forEach(command => {
      if (command.help) {
        helps.push(command.help)
      }
    })
    response.send(helps.join("\n"))
  })
}
